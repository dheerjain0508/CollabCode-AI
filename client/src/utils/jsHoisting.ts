/**
 * JavaScript Hoisting Principles & Frontend Client Utilities
 * 
 * Hoisting Overview:
 * In JavaScript engines (V8, JavaScriptCore, SpiderMonkey), variable and function declarations
 * are hoisted to the top of their enclosing scope before code execution begins.
 * 
 * 1. Function Declarations:
 *    - Fully hoisted with initial function body binding.
 *    - Can be legally executed anywhere in the scope before declaration line.
 * 
 * 2. `var` Variables:
 *    - Hoisted and assigned `undefined`.
 *    - Reading prior to declaration yields `undefined`.
 * 
 * 3. `let` and `const` Variables:
 *    - Hoisted into the Temporal Dead Zone (TDZ).
 *    - Reading prior to declaration line throws a `ReferenceError`.
 */

export interface FormattedState {
  isValid: boolean;
  message: string;
  hoistingApplied: boolean;
}

/**
 * Public client function demonstrating Function Hoisting.
 * Functions `hoistedValidateInput` and `hoistedFormatErrorMessage` are declared lower down,
 * but invoked here seamlessly due to function hoisting in JavaScript.
 */
export function validateAndFormatState(input: string | null | undefined): FormattedState {
  // Invoking functions before their declaration line in source code:
  const isValid = hoistedValidateInput(input);
  const message = isValid
    ? 'State input is valid and sanitized.'
    : hoistedFormatErrorMessage(input);

  return {
    isValid,
    message,
    hoistingApplied: true,
  };
}

// -----------------------------------------------------------------------------
// HOISTED HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function hoistedValidateInput(input: string | null | undefined): boolean {
  if (!input) return false;
  return input.trim().length > 0;
}

function hoistedFormatErrorMessage(input: string | null | undefined): string {
  if (input === null) return 'Input is null.';
  if (input === undefined) return 'Input is undefined.';
  return 'Input contains only whitespace.';
}
