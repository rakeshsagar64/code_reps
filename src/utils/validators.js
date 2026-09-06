export const validators = {
  // Regex Strategy
  regex: (userInput, validationData) => {
    if (!userInput) return false;
    try {
      const rx = new RegExp(userInput);
      return validationData.testCases.every((tc) => {
        const matches = rx.test(tc.text);
        return tc.shouldMatch ? matches : !matches;
      });
    } catch {
      return false; // Syntax error in user regex
    }
  },

  // Exact String Strategy (For SQL / CLI)
  'exact-string': (userInput, validationData) => {
    if (!userInput) return false;
    return userInput.trim() === validationData.canonicalSolution.trim();
  }
};
