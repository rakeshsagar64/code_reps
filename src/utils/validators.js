export const validators = {
  // Regex Strategy
  regex: (userInput, validationData) => {
    if (!userInput) return false;
    try {
      const flags = validationData.flags || '';
      const rx = new RegExp(userInput, flags);

      return validationData.testCases.every((tc) => {
        // Normalize non-breaking spaces (\u00A0) to standard ASCII spaces (\u0020)
        const text = tc.text.replace(/\u00a0/g, ' ');
        const matches = text.match(rx) || [];

        // Negative test cases: must yield zero matches
        if (!tc.shouldMatch) {
          return matches.length === 0;
        }

        // Positive test cases: must yield at least one match
        if (matches.length === 0) return false;

        // Check array of expected matches if defined
        if (Array.isArray(tc.expectedMatches)) {
          return tc.expectedMatches.every((exp) =>
            matches.includes(exp.replace(/\u00a0/g, ' '))
          );
        }

        // Check single expected match string if defined
        if (typeof tc.expected === 'string') {
          const normalizedExpected = tc.expected.replace(/\u00a0/g, ' ');
          return matches.includes(normalizedExpected);
        }

        return true;
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
