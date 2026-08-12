"""AI model keys pool management with dynamic environment key loading and rotation."""

from __future__ import annotations

import os
import time
# pyrefly: ignore [missing-import]
import structlog
from openai import AsyncOpenAI
from agents.models.openai_chatcompletions import OpenAIChatCompletionsModel
from app.core.config import settings

logger = structlog.get_logger()


def load_key_specs() -> list[dict]:
    """Dynamically load AI model key specifications from environment settings."""
    specs: list[dict] = []

    # 1. Load Groq Keys (comma-separated GROQ_API_KEYS or single GROQ_API_KEY)
    groq_keys_raw = getattr(settings, "GROQ_API_KEYS", "") or os.getenv("GROQ_API_KEYS", "")
    if not groq_keys_raw and getattr(settings, "GROQ_API_KEY", ""):
        groq_keys_raw = settings.GROQ_API_KEY

    if groq_keys_raw:
        for k in groq_keys_raw.split(","):
            k = k.strip()
            if k:
                specs.append({
                    "provider": "groq",
                    "apiKey": k,
                    "model": getattr(settings, "GROQ_MODEL", "llama-3.3-70b-versatile"),
                    "base_url": "https://api.groq.com/openai/v1",
                })

    # 2. Load Gemini Keys (comma-separated GEMINI_API_KEYS or single GEMINI_API_KEY)
    gemini_keys_raw = getattr(settings, "GEMINI_API_KEYS", "") or os.getenv("GEMINI_API_KEYS", "")
    if not gemini_keys_raw and getattr(settings, "GEMINI_API_KEY", ""):
        gemini_keys_raw = settings.GEMINI_API_KEY

    if gemini_keys_raw:
        for k in gemini_keys_raw.split(","):
            k = k.strip()
            if k:
                specs.append({
                    "provider": "gemini",
                    "apiKey": k,
                    "model": getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash"),
                    "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
                })

    return specs


class AIKeyPoolManager:
    """Manages rotation, selection, and rate-limit cooldowns across all AI API keys."""

    def __init__(self, keys: list[dict] | None = None):
        self._keys = keys
        self._cooldowns: dict[str, float] = {}
        self._client_cache: dict[str, AsyncOpenAI] = {}
        self._model_cache: dict[str, OpenAIChatCompletionsModel] = {}

    @property
    def keys(self) -> list[dict]:
        if not self._keys:
            self._keys = load_key_specs()
        return self._keys

    def mark_rate_limited(self, api_key: str, cooldown_seconds: float = 60.0) -> None:
        """Mark a key as rate limited until current_time + cooldown_seconds."""
        expiry = time.time() + cooldown_seconds
        self._cooldowns[api_key] = expiry
        logger.warning("key_rate_limited_cooldown", api_key=api_key[:8] + "...", cooldown=cooldown_seconds)

    def is_available(self, key_info: dict) -> bool:
        """Check if a key is active and not currently on cooldown."""
        api_key = key_info["apiKey"]
        expiry = self._cooldowns.get(api_key, 0.0)
        return time.time() >= expiry

    def get_available_key_specs(self, provider: str | None = None) -> list[dict]:
        """Get list of active key specifications, optionally filtered by provider."""
        now = time.time()
        specs = []
        all_keys = self.keys
        for k in all_keys:
            if provider and k["provider"] != provider:
                continue
            if now >= self._cooldowns.get(k["apiKey"], 0.0):
                specs.append(k)
        if not specs and provider:
            specs = [k for k in all_keys if k["provider"] == provider]
        elif not specs:
            specs = list(all_keys)
        return specs

    def get_model_for_spec(self, spec: dict) -> tuple[OpenAIChatCompletionsModel, str, str]:
        """Returns (OpenAIChatCompletionsModel, apiKey, provider) for a given spec."""
        api_key = spec["apiKey"]
        if api_key not in self._model_cache:
            client = AsyncOpenAI(
                api_key=api_key,
                base_url=spec["base_url"],
            )
            model = OpenAIChatCompletionsModel(
                model=spec["model"],
                openai_client=client,
            )
            self._client_cache[api_key] = client
            self._model_cache[api_key] = model

        return self._model_cache[api_key], api_key, spec["provider"]


key_pool = AIKeyPoolManager()
