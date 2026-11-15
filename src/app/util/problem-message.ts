/**
 * Turns an HttpErrorResponse (or anything thrown) into one readable sentence.
 * The API returns RFC 7807 ProblemDetails: validation failures carry `errors`,
 * conflicts and not-founds carry `detail` / `title`.
 */
export function problemMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const e = err as { status?: number; error?: { errors?: Record<string, string[]>; detail?: string; title?: string } } | null;

  if (!e) return fallback;
  if (e.status === 0) return 'Cannot reach the server. Check your connection.';
  if (e.status === 403) return "You don't have permission to do that.";

  const problem = e.error;
  if (problem?.errors) {
    const first = Object.values(problem.errors).flat()[0];
    if (first) return first;
  }
  return problem?.detail ?? problem?.title ?? fallback;
}
