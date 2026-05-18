/**
 * Cross-component cache invalidation channel.
 *
 * Mirrors school-react-app/src/services/data-bus.ts so screens that mutate a
 * domain entity can broadcast it and sibling screens (or React Query caches)
 * react without a hard reload. Used together with TanStack Query —
 * `bindRefresh(channel, () => queryClient.invalidateQueries(...))`.
 */

export type DataBusChannel =
  | 'classes'
  | 'teachers'
  | 'students'
  | 'subjects'
  | 'exams'
  | 'results'
  | 'events'
  | 'homework'
  | 'leave'
  | 'timetable'
  | 'behavior'
  | 'attendance'
  | 'academic-years'
  | 'fees'
  | 'live-classes'
  | 'tests'
  | 'announcements'
  | 'notifications'
  | 'settings'
  | 'subscription';

type Listener = () => void;

const listeners = new Map<DataBusChannel, Set<Listener>>();

export function publish(channel: DataBusChannel): void {
  const set = listeners.get(channel);
  if (!set || set.size === 0) return;
  Array.from(set).forEach((fn) => {
    try {
      fn();
    } catch {
      // Swallow listener errors so one broken consumer doesn't poison others.
    }
  });
}

export function subscribe(
  channel: DataBusChannel,
  listener: Listener,
): () => void {
  let set = listeners.get(channel);
  if (!set) {
    set = new Set();
    listeners.set(channel, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
  };
}

export function bindRefresh(
  channel: DataBusChannel,
  refresh: () => void | Promise<unknown>,
): () => void {
  return subscribe(channel, () => {
    void refresh();
  });
}
