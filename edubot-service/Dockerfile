FROM python:3.12-slim

WORKDIR /app

# Make pip resilient on slow/unstable networks during image builds:
# longer per-read timeout and more retries avoid spurious ReadTimeoutError
# failures when pulling large wheels (e.g. openai-agents).
ENV PIP_DEFAULT_TIMEOUT=120 \
    PIP_RETRIES=10 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
