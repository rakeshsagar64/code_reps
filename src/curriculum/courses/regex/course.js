import { module1 } from './module1.js';

export const regexCourse = {
  id: 'regex',
  title: 'Regex Fundamentals',
  description: 'Build muscle memory for regex patterns without typing friction.',
  validatorType: 'regex',
  quickTokens: ['\\d', '\\w', '\\s', '\\D', '\\W', '\\S', '+', '*', '?', '{ }', '^', '$', '(', ')', '[ ]'],
  modules: [module1]
};
