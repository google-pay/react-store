export async function waitFor(
  predicate: () => boolean,
  pollIntervalMilliseconds: number = 100,
  timeoutMilliseconds: number = -1,
): Promise<void> {
  let pollTimeout: NodeJS.Timeout;
  let abortTimeout: NodeJS.Timeout;

  return new Promise((resolve, reject) => {
    if (timeoutMilliseconds >= 0) {
      abortTimeout = setTimeout(() => {
        if (pollTimeout) {
          clearInterval(pollTimeout);
        }
        reject(new Error(`Timeout of ${timeoutMilliseconds}ms exceeded.`));
      }, timeoutMilliseconds);
    }

    pollTimeout = setInterval(() => {
      if (predicate()) {
        if (pollTimeout) {
          clearInterval(pollTimeout);
        }
        if (abortTimeout) {
          clearInterval(abortTimeout);
        }
        resolve();
      }
    }, pollIntervalMilliseconds);
  });
}
