import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpError, classifyRequestError } from './requestError';

describe('classifyRequestError', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('treats a 404 response as not found, whatever its message', () => {
    expect(classifyRequestError(new HttpError(404, 'There is no Pokémon with that name or ID.'))).toBe(
      'notFound'
    );
  });

  it('treats a fetch that cannot reach the server as a network error', () => {
    expect(classifyRequestError(new TypeError('Failed to fetch'))).toBe('network');
  });

  it('treats any failure while the browser is offline as a network error', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    expect(classifyRequestError(new HttpError(500, 'HTTP 500: https://pokeapi.co/api/v2/type'))).toBe(
      'network'
    );
  });

  it('treats other HTTP statuses and unexpected values as other errors', () => {
    expect(classifyRequestError(new HttpError(500, 'HTTP 500: https://pokeapi.co/api/v2/type'))).toBe(
      'other'
    );
    expect(classifyRequestError(new Error('HTTP 404: https://pokeapi.co/api/v2/type/x'))).toBe('other');
    expect(classifyRequestError('boom')).toBe('other');
    expect(classifyRequestError(undefined)).toBe('other');
  });
});
