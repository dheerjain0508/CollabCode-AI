export function demonstrateHoisting(): string {
  const result: string[] = [];

  result.push(hoistedFunction());

  function hoistedFunction(): string {
    return 'Function declarations are hoisted';
  }

  var message = 'var declaration is hoisted';

  if (message) {
    result.push(message);
  }

  return result.join(' | ');
}