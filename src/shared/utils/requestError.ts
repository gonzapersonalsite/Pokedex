/** A non-2xx HTTP response. The status is kept so callers can classify it without parsing the message. */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export type RequestErrorKind = 'network' | 'notFound' | 'other';

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * The single place that decides what a failed request means, so the global toasts,
 * the retry policy and every inline error message agree on it.
 */
export function classifyRequestError(error: unknown): RequestErrorKind {
  if (error instanceof HttpError && error.status === 404) return 'notFound';
  if (isOffline()) return 'network';
  if (error instanceof Error && /failed to fetch/i.test(error.message)) return 'network';
  return 'other';
}
