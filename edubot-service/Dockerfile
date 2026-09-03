FROM python:3.12-slim

WORKDIR /app

# Make pip resilient on slow/unstable networks during image builds:
# longer per-read timeout and more retries avoid spurious ReadTimeoutError
# failures when pulling large wheels (e.g. openai-agents).
ENV PIP_DEFAULT_TIMEOUT=120 \
    PIP_RETRIES=10 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONUNBUFFERED=1

# Create unprivileged application user and group
RUN groupadd -g 10001 appuser && \
    useradd -u 10001 -g appuser -s /bin/bash -m appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code with unprivileged ownership
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
