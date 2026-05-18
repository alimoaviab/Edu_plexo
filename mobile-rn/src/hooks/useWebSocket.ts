/**
 * Persistent WebSocket connection for live data updates. Mirrors the web
 * app's useWebSocket hook in behaviour:
 *   - Connects to `ws://<host>/ws?token=<jwt>` with exponential backoff.
 *   - Routes typed messages onto TanStack Query's invalidate API so any
 *     mutation made on web instantly refreshes mobile screens.
 *
 * Mount this once at the root layout — the hub uses module-level state so
 * subscribers get notified as soon as a connection comes up.
 */

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth-store';
import { secureStorage, StorageKeys } from '@/utils/secure-storage';

interface WSMessage {
  type: string;
  payload?: Record<string, unknown>;
}

const MAX_DELAY = 30_000;
const INITIAL_DELAY = 1_000;

export function useWebSocket(opts: { enabled?: boolean } = {}) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (opts.enabled === false || !user) {
      return () => {
        mountedRef.current = false;
      };
    }

    let disposed = false;

    async function connect() {
      if (disposed || !mountedRef.current) return;
      const token = await secureStorage.get(StorageKeys.token);
      if (!token) return;

      try {
        const ws = new WebSocket(`${env.wsUrl}?token=${encodeURIComponent(token)}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!mountedRef.current) return;
          attemptRef.current = 0;
          setConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const messages = String(event.data).split('\n').filter(Boolean);
            for (const raw of messages) {
              const msg: WSMessage = JSON.parse(raw);
              switch (msg.type) {
                case 'notification':
                  queryClient.invalidateQueries({ queryKey: ['notifications'] });
                  break;
                case 'attendance':
                  queryClient.invalidateQueries({ queryKey: ['attendance'] });
                  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                  break;
                case 'fee_update':
                case 'fee':
                  queryClient.invalidateQueries({ queryKey: ['fees-monthly'] });
                  queryClient.invalidateQueries({ queryKey: ['fee-dashboard-stats'] });
                  queryClient.invalidateQueries({ queryKey: ['student-fees'] });
                  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                  break;
                case 'student':
                  queryClient.invalidateQueries({ queryKey: ['students'] });
                  break;
                case 'teacher':
                  queryClient.invalidateQueries({ queryKey: ['teachers'] });
                  break;
                case 'announcement':
                  queryClient.invalidateQueries({ queryKey: ['announcements'] });
                  break;
                case 'event':
                  queryClient.invalidateQueries({ queryKey: ['events'] });
                  break;
                case 'leave':
                  queryClient.invalidateQueries({ queryKey: ['leave'] });
                  break;
                case 'homework':
                  queryClient.invalidateQueries({ queryKey: ['homework'] });
                  break;
                case 'result':
                  queryClient.invalidateQueries({ queryKey: ['results'] });
                  break;
                default:
                  break;
              }
            }
          } catch {
            // ignore non-JSON ping/pong frames
          }
        };

        ws.onclose = (e) => {
          wsRef.current = null;
          if (!mountedRef.current) return;
          setConnected(false);
          if (e.code === 1000 || e.code === 4001 || disposed) return;
          const attempt = attemptRef.current;
          const delay = Math.min(INITIAL_DELAY * 2 ** attempt, MAX_DELAY);
          attemptRef.current = attempt + 1;
          timerRef.current = setTimeout(connect, delay);
        };

        ws.onerror = () => {
          // onclose follows
        };
      } catch {
        const attempt = attemptRef.current;
        const delay = Math.min(INITIAL_DELAY * 2 ** attempt, MAX_DELAY);
        attemptRef.current = attempt + 1;
        timerRef.current = setTimeout(connect, delay);
      }
    }

    connect();

    return () => {
      disposed = true;
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wsRef.current) {
        wsRef.current.close(1000, 'unmount');
        wsRef.current = null;
      }
    };
  }, [opts.enabled, queryClient, user?.id]);

  return { connected };
}
