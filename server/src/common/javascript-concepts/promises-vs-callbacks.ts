export function callbackExample(
  callback: (message: string) => void,
): void {
  setTimeout(() => {
    callback('Callback completed');
  }, 10);
}

export function promiseExample(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise completed');
    }, 10);
  });
}

export async function demonstrateAsyncPatterns(): Promise<string[]> {
  const results: string[] = [];

  callbackExample((message) => {
    results.push(message);
  });

  const promiseResult = await promiseExample();
  results.push(promiseResult);

  return results;
}