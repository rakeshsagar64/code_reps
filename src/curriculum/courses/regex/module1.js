export const module1 = {
  id: 'regex_m1',
  courseId: 'regex',
  order: 1,
  title: 'Digits & Word Characters',
  description: 'Master the fundamental character classes: \\d, \\w, and \\s.',
  primer: {
    syntaxToken: '\\d, \\w, \\s',
    definition: '\\d matches digits (0-9). \\w matches letters, numbers, and underscores. \\s matches whitespace.',
    goldenRule: 'Capitalization inverts the rule: \\D is non-digit, \\W is non-word, \\S is non-space.'
  },
  cards: [
    {
      id: 'regex_m1_c1',
      title: 'Match Any Digit',
      prompt: 'Write a pattern to match any single digit.',
      ghostTemplate: '\\d',
      canonicalSolution: '\\d',
      validationData: {
        testCases: [
          { text: 'User 7', shouldMatch: true },
          { text: 'No numbers here', shouldMatch: false }
        ]
      },
      explanation: '\\d matches any decimal digit from 0 through 9.'
    },
    {
      id: 'regex_m1_c2',
      title: 'Match Word Character',
      prompt: 'Write a pattern to match any letter, digit, or underscore.',
      ghostTemplate: '\\w',
      canonicalSolution: '\\w',
      validationData: {
        testCases: [
          { text: 'code_123', shouldMatch: true },
          { text: '!@#$', shouldMatch: false }
        ]
      },
      explanation: '\\w matches any alphanumeric character [A-Za-z0-9_].'
    }
  ]
};
