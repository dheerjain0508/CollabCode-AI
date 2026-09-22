export function demonstrateHoisting(): string {
  const results: string[] = [];

  // Function declaration hoisting
  results.push(hoistedFunction());

  function hoistedFunction(): string {
    return 'Function declaration was hoisted';
  }

  // var declaration is hoisted, but its assignment happens later.
  // @ts-expect-error TS2454: intentional hoisting demonstration
  results.push(`Before assignment: ${hoistedVariable}`);

  var hoistedVariable = 'var assignment completed';

  results.push(hoistedVariable);

  return results.join(' | ');
}