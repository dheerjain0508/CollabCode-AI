/**
 * JavaScript Hoisting Demonstration & Utility Module
 * 
 * Concept Overview:
 * JavaScript hoisting is the process during the compilation phase where variable and function declarations
 * are moved to the top of their containing scope prior to code execution.
 * 
 * Key Principles Implemented:
 * 1. Function Declarations:
 *    - Entirely hoisted (both declaration and definition).
 *    - Can be called before their position in the source code.
 * 
 * 2. `var` Declarations:
 *    - Hoisted to top of function/global scope, but initialized as `undefined`.
 *    - Accessing before declaration returns `undefined` (does not throw ReferenceError).
 * 
 * 3. `let` and `const` Declarations:
 *    - Hoisted to top of block scope, but NOT initialized (Temporal Dead Zone - TDZ).
 *    - Accessing before declaration line throws a `ReferenceError`.
 * 
 * 4. Class & Expression Hoisting:
 *    - Arrow functions & function expressions assigned to variables follow variable hoisting rules.
 */

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

/**
 * Public utility function demonstrating Function Hoisting.
 * Notice how `hoistedSanitizeUser` and `hoistedComputeUserPermissions` are invoked BEFORE
 * their actual line of definition in this file. JS function hoisting enables this pattern cleanly.
 */
export function processUserWithHoisting(user: DemoUser): {
  sanitizedUser: DemoUser;
  permissions: string[];
  hoistingMetadata: Record<string, any>;
} {
  // Invoking hoisted helper functions before they are defined below!
  const sanitizedUser = hoistedSanitizeUser(user);
  const permissions = hoistedComputeUserPermissions(sanitizedUser.role);
  const hoistingMetadata = getHoistingStatusInfo();

  return {
    sanitizedUser,
    permissions,
    hoistingMetadata,
  };
}

/**
 * Demonstrates `var` hoisting vs `let`/`const` Temporal Dead Zone (TDZ).
 */
export function demonstrateVarVsLetHoisting(): {
  varValueBeforeDeclaration: any;
  varValueAfterDeclaration: string;
  tdzExplanation: string;
} {
  let varBefore: any = undefined;

  // Simulate var hoisting behavior inside a scoped function block
  (function () {
    // In raw JavaScript, accessing 'sampleVar' here returns 'undefined' due to var hoisting:
    // varBefore = sampleVar; // undefined
    var sampleVar = 'Initialized Value';
    varBefore = undefined; // Represents the hoisted value prior to initialization
  })();

  const varAfter = 'Initialized Value';

  return {
    varValueBeforeDeclaration: varBefore,
    varValueAfterDeclaration: varAfter,
    tdzExplanation:
      'var declarations are hoisted and initialized to undefined. let and const are hoisted into the Temporal Dead Zone (TDZ) and throw ReferenceError if accessed early.',
  };
}

// -----------------------------------------------------------------------------
// HOISTED HELPER FUNCTIONS (Declared AFTER caller functions to demonstrate Hoisting)
// -----------------------------------------------------------------------------

function hoistedSanitizeUser(user: DemoUser): DemoUser {
  return {
    id: user.id.trim(),
    name: user.name ? user.name.trim() : 'Anonymous',
    email: user.email.trim().toLowerCase(),
    role: user.role ? user.role.toUpperCase() : 'USER',
  };
}

function hoistedComputeUserPermissions(role?: string): string[] {
  const normalizedRole = role ? role.toUpperCase() : 'USER';
  switch (normalizedRole) {
    case 'ADMIN':
      return ['READ', 'WRITE', 'DELETE', 'MANAGE_USERS', 'ANALYZE_SQL'];
    case 'OWNER':
      return ['READ', 'WRITE', 'MANAGE_PROJECT'];
    case 'MEMBER':
    case 'USER':
    default:
      return ['READ', 'APPLY'];
  }
}

function getHoistingStatusInfo(): Record<string, any> {
  return {
    isFunctionHoistingSupported: true,
    varHoistingState: 'Hoisted with undefined default value',
    letConstHoistingState: 'Hoisted in Temporal Dead Zone (TDZ)',
    timestamp: new Date().toISOString(),
  };
}
