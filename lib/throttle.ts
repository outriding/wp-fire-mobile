/**
 * Limits how often a function can run.
 *
 * Useful for high-frequency events like `scroll` or `resize`, which can fire
 * dozens of times per second. Throttling ensures the wrapped function runs
 * at most once every `limit` milliseconds.
 *
 * Example: throttle(updateHeaderHeight, 200) will run the update at most
 * once every 200ms, even if resize fires 40 times while the user is dragging.
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let lastFunc: ReturnType<typeof setTimeout> | undefined;
  let lastRan: number | undefined;

  return (...args: Args) => {
    if (lastRan === undefined) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            fn(...args);
            lastRan = Date.now();
          }
        },
        Math.max(0, limit - (Date.now() - lastRan))
      );
    }
  };
}
