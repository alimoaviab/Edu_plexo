"""Plexa agent — OpenAI Agents SDK backed by Gemini (primary) + OpenRouter (fallback).

Architecture:
  - Primary: Gemini 2.5 Flash via Google's OpenAI-compatible endpoint
  - Fallback: OpenRouter (same model or any other) if Gemini fails
  - OpenAI Agents SDK provides: Agent, Runner, function_tool, streaming
"""

from __future__ import annotations

import asyncio

import structlog
from openai import AsyncOpenAI
from agents import Agent, Runner, function_tool, ModelSettings
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel

from app.agents.instructions import build_instruction
from app.core.config import settings
from app.tools.catalog import (
    get_attendance,
    get_dashboard_stats,
    get_timetable,
    list_announcements,
    list_behavior,
    list_classes,
    list_events,
    list_exams,
    list_fees,
    list_homework,
    list_results,
    list_students,
    list_subjects,
    list_teachers,
)

logger = structlog.get_logger()


from app.core.ai_keys import key_pool


# ─── Tools ────────────────────────────────────────────────────────────────

_tools = [
    function_tool(get_dashboard_stats),
    function_tool(list_students),
    function_tool(list_teachers),
    function_tool(list_classes),
    function_tool(list_subjects),
    function_tool(get_attendance),
    function_tool(list_exams),
    function_tool(list_results),
    function_tool(list_homework),
    function_tool(list_events),
    function_tool(list_announcements),
    function_tool(list_behavior),
    function_tool(list_fees),
    function_tool(get_timetable),
]


# ─── Agent factory ────────────────────────────────────────────────────────


def create_agent(
    role: str,
    name: str,
    language: str,
    model: OpenAIChatCompletionsModel,
) -> Agent:
    """Create a per-turn agent with the specified model and instructions."""
    return Agent(
        name="Plexa",
        model=model,
        instructions=build_instruction(role=role, name=name, language=language),
        tools=_tools,
        model_settings=ModelSettings(
            temperature=0.5,
            top_p=0.95,
            max_tokens=4096,
        ),
    )


async def run_with_fallback(agent_kwargs: dict, user_input: str) -> str:
    """Run the agent with automatic multi-key and multi-provider pool failover."""
    key_specs = key_pool.get_available_key_specs()

    for spec in key_specs:
        model_obj, api_key, provider = key_pool.get_model_for_spec(spec)
        try:
            agent = create_agent(**agent_kwargs, model=model_obj)
            result = await Runner.run(agent, user_input)
            if result.final_output:
                return result.final_output
        except Exception as e:
            error_str = str(e).lower()
            is_rate_limit = (
                "429" in str(e)
                or "quota" in error_str
                or "resource_exhausted" in error_str
                or "rate limit" in error_str
            )
            if is_rate_limit:
                key_pool.mark_rate_limited(api_key, cooldown_seconds=60.0)
            logger.warning(
                "agent_key_failed",
                provider=provider,
                model=spec["model"],
                error=str(e),
                rate_limited=is_rate_limit,
            )
            continue

    return "The AI service is temporarily at capacity. Please try again in a few moments."


async def stream_with_fallback(agent_kwargs: dict, user_input: str):
    """Stream the agent's reply chunk-by-chunk with automatic multi-key failover."""
    key_specs = key_pool.get_available_key_specs()
    last_error: Exception | None = None

    for spec in key_specs:
        model_obj, api_key, provider = key_pool.get_model_for_spec(spec)
        try:
            agent = create_agent(**agent_kwargs, model=model_obj)
            result = Runner.run_streamed(agent, user_input)

            got_text = False
            async for event in result.stream_events():
                text = _extract_text(event)
                if text:
                    got_text = True
                    yield text

            if not got_text and result.final_output:
                yield result.final_output
                got_text = True

            if got_text:
                return  # Success with current key
        except Exception as e:
            last_error = e
            error_str = str(e).lower()
            is_rate_limit = (
                "429" in str(e)
                or "quota" in error_str
                or "resource_exhausted" in error_str
                or "rate limit" in error_str
            )
            if is_rate_limit:
                key_pool.mark_rate_limited(api_key, cooldown_seconds=60.0)
            logger.warning(
                "agent_stream_key_failed",
                provider=provider,
                model=spec["model"],
                error=str(e),
                rate_limited=is_rate_limit,
            )
            continue

    logger.error("stream_all_keys_failed", last_error=str(last_error) if last_error else None)
    yield "The AI service is temporarily at capacity. Please try again in a few moments."


def _extract_text(event) -> str:
    """Extract text delta from a stream event."""
    # pyrefly: ignore [missing-import]
    from agents.stream_events import RawResponsesStreamEvent

    # Try standard RawResponsesStreamEvent
    if isinstance(event, RawResponsesStreamEvent):
        data = event.data
        if hasattr(data, "choices"):
            for choice in data.choices:
                delta = getattr(choice, "delta", None)
                if delta:
                    text = getattr(delta, "content", None)
                    if text:
                        return text

    # Fallback: check if event has data and choices directly
    data = getattr(event, "data", None)
    if data:
        choices = getattr(data, "choices", None)
        if choices:
            for choice in choices:
                delta = getattr(choice, "delta", None)
                if delta:
                    text = getattr(delta, "content", None)
                    if text:
                        return text

    # Fallback: check if event itself has choices (raw OpenAI chunk)
    choices = getattr(event, "choices", None)
    if choices:
        for choice in choices:
            delta = getattr(choice, "delta", None)
            if delta:
                text = getattr(delta, "content", None)
                if text:
                    return text

    # Fallback: check if event has 'content' or 'text' attribute
    content = getattr(event, "content", None)
    if content:
        return content
    text = getattr(event, "text", None)
    if text:
        return text

    return ""
