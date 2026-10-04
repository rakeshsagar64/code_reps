export const validators = {
  // Regex Strategy
  regex: (userInput, validationData) => {
    if (!userInput || typeof userInput !== 'string') return false;

    try {
      // 1. Normalize non-breaking spaces in user input
      const cleanInput = userInput.replace(/\u00a0/g, ' ');
      const flags = validationData.flags || '';
      const rx = new RegExp(cleanInput, flags);

      return validationData.testCases.every((tc) => {
        // 2. Normalize text and reset regex state for 'g' / 'y' flags
        const text = (tc.text || '').replace(/\u00a0/g, ' ');
        rx.lastIndex = 0;

        const execMatch = rx.exec(text);
        const didMatch = execMatch !== null;

        // 3. Validate boolean match condition
        if (tc.shouldMatch !== didMatch) {
          return false;
        }

        // If it shouldn't match and didn't, the negative test case passes
        if (!tc.shouldMatch) {
          return true;
        }

        // --- POSITIVE TEST CASE VALIDATIONS ---

        // A. Validate exact full match string (tc.expected)
        if (typeof tc.expected === 'string') {
          const normalizedExpected = tc.expected.replace(/\u00a0/g, ' ');
          if (execMatch[0] !== normalizedExpected) {
            return false;
          }
        }

        // B. Validate Capture Groups (Crucial for Grouping/Quantifier modules)
        if (Array.isArray(tc.expectedGroups)) {
          const actualGroups = execMatch.slice(1); // Exclude fullMatch at index 0
          if (actualGroups.length !== tc.expectedGroups.length) {
            return false;
          }
          const groupsMatch = tc.expectedGroups.every((expGroup, idx) => {
            if (expGroup === undefined || expGroup === null) {
              return actualGroups[idx] === undefined;
            }
            return actualGroups[idx] === expGroup.replace(/\u00a0/g, ' ');
          });
          if (!groupsMatch) return false;
        }

        // C. Validate Multiple Global Matches (when tc.expectedMatches is defined)
        if (Array.isArray(tc.expectedMatches)) {
          // Collect all global matches cleanly using matchAll
          const globalRx = new RegExp(cleanInput, flags.includes('g') ? flags : flags + 'g');
          const allMatches = Array.from(text.matchAll(globalRx)).map((m) =>
            m[0].replace(/\u00a0/g, ' ')
          );

          if (allMatches.length !== tc.expectedMatches.length) {
            return false;
          }
          const allMatchEqual = tc.expectedMatches.every(
            (exp, idx) => allMatches[idx] === exp.replace(/\u00a0/g, ' ')
          );
          if (!allMatchEqual) return false;
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
