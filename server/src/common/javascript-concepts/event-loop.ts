export async function demonstrateEventLoop(): Promise<string[]> {
  const executionOrder: string[] = [];

  executionOrder.push('synchronous');

  const timer = new Promise<void>((resolve) => {
    setTimeout(() => {
      executionOrder.push('setTimeout');
      resolve();
    }, 0);
  });

  Promise.resolve().then(() => {
    executionOrder.push('promise-microtask');
  });

  queueMicrotask(() => {
    executionOrder.push('queueMicrotask');
  });

  executionOrder.push('end-synchronous');

  await timer;

  return executionOrder;
}