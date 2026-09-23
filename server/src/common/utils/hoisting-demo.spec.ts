import {
  processUserWithHoisting,
  demonstrateVarVsLetHoisting,
} from './hoisting-demo';

describe('JavaScript Hoisting Demonstration Utility', () => {
  it('should successfully execute hoisted function declarations before their definition line', () => {
    const rawUser = {
      id: '  user-123  ',
      name: '  Jane Doe  ',
      email: ' JANE.DOE@EXAMPLE.COM ',
      role: 'admin',
    };

    const result = processUserWithHoisting(rawUser);

    expect(result.sanitizedUser).toEqual({
      id: 'user-123',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'ADMIN',
    });
    expect(result.permissions).toContain('MANAGE_USERS');
    expect(result.hoistingMetadata.isFunctionHoistingSupported).toBe(true);
  });

  it('should demonstrate var hoisting and TDZ explanations', () => {
    const hoistingDemo = demonstrateVarVsLetHoisting();

    expect(hoistingDemo.varValueBeforeDeclaration).toBeUndefined();
    expect(hoistingDemo.varValueAfterDeclaration).toBe('Initialized Value');
    expect(hoistingDemo.tdzExplanation).toContain('Temporal Dead Zone');
  });
});
