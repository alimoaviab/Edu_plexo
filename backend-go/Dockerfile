# Multi-stage build for the Eduplexo Go backend.
FROM public.ecr.aws/docker/library/golang:alpine AS builder

WORKDIR /src
RUN apk add --no-cache git
COPY go.mod go.sum ./
ENV GOPROXY=direct
RUN go mod download

COPY . .
ENV CGO_ENABLED=0 GOOS=linux
RUN go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

# ──────────────────────────────────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app
COPY --from=builder /out/server /app/server

EXPOSE 8080
USER nonroot
ENTRYPOINT ["/app/server"]
