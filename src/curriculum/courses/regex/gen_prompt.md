You are an expert Regex Curriculum Engineer and QA System Auditor. 

Your task is to take the provided Regex Course Module JSON file, audit every card, and return the complete, corrected, and production-ready JSON file.

### Required Audits & Fixes for Every Card:

1. Prompt & Domain Alignment (STRICT)
   - The card's "prompt" must clearly explain the extraction objective in practical terms.
   - The "text" inside each item in "testCases" MUST directly contain the real-world domain examples mentioned in the prompt.
   - Example: If the prompt mentions "postal codes or feature flags", test cases MUST use real ZIP codes (e.g., "ZIP 90210") or feature flag strings (e.g., "FEATURE_BETA1"), NOT arbitrary placeholder text like "trace_logs_data".

2. First-Match & Quantifier Shortcut Blocking
   - Ensure target match strings in "expected" represent the complete sequence (e.g., "404" for \d+, not "4").
   - Structure test strings so that the intended sequence is either the first match or uniquely identifiable.
   - Include test strings with multi-digit/multi-character sequences to immediately block user shortcut submissions (e.g., submitting \d when \d+ is required, or \w+ when \w{3} is required).

3. Character Sanitization
   - Strip and replace all non-breaking spaces (\u00A0 or hidden Unicode space characters) with standard ASCII spaces (\u0020) across all "prompt", "text", "expected", and "description" fields.

4. Test Case Coverage
   - Ensure each card contains at least:
     - 2 Positive Test Cases (shouldMatch: true) with an explicit "expected" string.
     - 2 Negative Test Cases (shouldMatch: false) testing missing tokens or invalid symbol inputs.
   - Ensure "description" fields explicitly state what requirement is being validated (e.g., "Extracts exact 3-digit HTTP code; blocks single \\d shortcut").

5. JSON Integrity & Output Format
   - Retain all root module metadata (id, title, primer, order, etc.).
   - Preserve all structural keys for each card (id, type, scaffold, prompt, ghostTemplate, canonicalSolution, validatorType, flags, testCases).
   - Return ONLY the updated, fully valid JSON inside a raw JSON code block without conversational wrappers.

Here is the module JSON to audit and align:

{
  "id": "module-3",
  "courseId": "regex",
  "order": 3,
  "title": "Anchors & Concept Stacking",
  "description": "Enforce structural position boundaries (^, $, \\b) combined with M1 classes and M2 quantifiers.",
  "primer": {
    "syntaxToken": "^, $, \\b",
    "definition": "^ asserts the start of string, $ asserts the end of string, and \\b asserts a word boundary position.",
    "goldenRule": "Anchors do not consume any characters—they strictly enforce location boundaries."
  },
  "cards": [
    {
      "id": "m3_c1",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Assert the start of a string using ^.",
      "ghostTemplate": "^\\w",
      "canonicalSolution": "^\\w",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "code", "shouldMatch": true, "description": "Starts with word character" },
        { "text": "#code", "shouldMatch": false, "description": "Starts with symbol (fails unanchored \\w)" }
      ]
    },
    {
      "id": "m3_c2",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Assert the end of a string using $.",
      "ghostTemplate": "\\d$",
      "canonicalSolution": "\\d$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "order9", "shouldMatch": true, "description": "Ends with digit" },
        { "text": "order9abc", "shouldMatch": false, "description": "Digit not at end (fails unanchored \\d)" }
      ]
    },
    {
      "id": "m3_c3",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Assert a word boundary using \\b.",
      "ghostTemplate": "\\bcat",
      "canonicalSolution": "\\bcat",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "cat", "shouldMatch": true, "description": "Starts with word boundary" },
        { "text": "wildcat", "shouldMatch": false, "description": "No boundary before cat (fails cat without \\b)" }
      ]
    },
    {
      "id": "m3_c4",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Enforce match from start to end using ^ and $.",
      "ghostTemplate": "^\\d+$",
      "canonicalSolution": "^\\d+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "9982", "shouldMatch": true, "description": "Entirely digits" },
        { "text": "a9982", "shouldMatch": false, "description": "Leading letter (fails unanchored \\d+)" },
        { "text": "9982a", "shouldMatch": false, "description": "Trailing letter (fails unanchored \\d+)" }
      ]
    },
    {
      "id": "m3_c5",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Assert start boundary before word character.",
      "ghostTemplate": "^\\b\\w",
      "canonicalSolution": "^\\b\\w",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "start", "shouldMatch": true, "description": "Starts with word character" },
        { "text": "#start", "shouldMatch": false, "description": "Starts with symbol (fails \\w without ^)" }
      ]
    },
    {
      "id": "m3_c6",
      "type": "atomic",
      "scaffold": "ghost",
      "prompt": "Assert word boundary before end of string.",
      "ghostTemplate": "\\w\\b$",
      "canonicalSolution": "\\w\\b$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "finish", "shouldMatch": true, "description": "Ends with word character" },
        { "text": "finish!", "shouldMatch": false, "description": "Ends with symbol (fails \\w without $)" }
      ]
    },
    {
      "id": "m3_c7",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Ensure entire string contains ONLY digits.",
      "ghostTemplate": "^\\d+$",
      "canonicalSolution": "^\\d+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "12345", "shouldMatch": true, "description": "Digits only" },
        { "text": "123a45", "shouldMatch": false, "description": "Contains letter (fails unanchored \\d+)" }
      ]
    },
    {
      "id": "m3_c8",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Ensure entire string contains ONLY word characters.",
      "ghostTemplate": "^\\w+$",
      "canonicalSolution": "^\\w+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "user_name", "shouldMatch": true, "description": "Word characters only" },
        { "text": "user-name", "shouldMatch": false, "description": "Contains hyphen (fails unanchored \\w+)" }
      ]
    },
    {
      "id": "m3_c9",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match a string consisting strictly of 2 to 4 word characters.",
      "ghostTemplate": "^\\w{2,4}$",
      "canonicalSolution": "^\\w{2,4}$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "code", "shouldMatch": true, "description": "4 word characters" },
        { "text": "a", "shouldMatch": false, "description": "1 character (too short)" },
        { "text": "coding", "shouldMatch": false, "description": "6 characters (fails \\w+ or unanchored \\w{2,4})" }
      ]
    },
    {
      "id": "m3_c10",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string starting with one or more digits.",
      "ghostTemplate": "^\\d+",
      "canonicalSolution": "^\\d+",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "100 apples", "shouldMatch": true, "description": "Starts with digits" },
        { "text": "apples 100", "shouldMatch": false, "description": "Digits not at start (fails unanchored \\d+)" }
      ]
    },
    {
      "id": "m3_c11",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string ending with one or more digits.",
      "ghostTemplate": "\\d+$",
      "canonicalSolution": "\\d+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "Item 42", "shouldMatch": true, "description": "Ends with digits" },
        { "text": "Item 42a", "shouldMatch": false, "description": "Letter at end (fails unanchored \\d+)" }
      ]
    },
    {
      "id": "m3_c12",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string starting with a letter or word character.",
      "ghostTemplate": "^\\w",
      "canonicalSolution": "^\\w",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "hello", "shouldMatch": true, "description": "Starts with word character" },
        { "text": "#hello", "shouldMatch": false, "description": "Starts with symbol (fails unanchored \\w)" }
      ]
    },
    {
      "id": "m3_c13",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string ending with one or more word characters.",
      "ghostTemplate": "\\w+$",
      "canonicalSolution": "\\w+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "status: ok", "shouldMatch": true, "description": "Ends with word characters" },
        { "text": "status: ok!", "shouldMatch": false, "description": "Ends with punctuation (fails unanchored \\w+)" }
      ]
    },
    {
      "id": "m3_c14",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string consisting strictly of a 5-digit ZIP code.",
      "ghostTemplate": "^\\d{5}$",
      "canonicalSolution": "^\\d{5}$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "90210", "shouldMatch": true, "description": "Exactly 5 digits" },
        { "text": "9021", "shouldMatch": false, "description": "4 digits (too short)" },
        { "text": "902101", "shouldMatch": false, "description": "6 digits (fails unanchored \\d{5})" }
      ]
    },
    {
      "id": "m3_c15",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match standalone word 'cat' using word boundaries.",
      "ghostTemplate": "\\bcat\\b",
      "canonicalSolution": "\\bcat\\b",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "the cat sat", "shouldMatch": true, "description": "Standalone word cat" },
        { "text": "category", "shouldMatch": false, "description": "cat as prefix (fails cat\\b)" },
        { "text": "wildcat", "shouldMatch": false, "description": "cat as suffix (fails \\bcat)" }
      ]
    },
    {
      "id": "m3_c16",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string starting with 'LOG:' followed by word characters.",
      "ghostTemplate": "^LOG:\\w+",
      "canonicalSolution": "^LOG:\\w+",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "LOG:Init", "shouldMatch": true, "description": "Starts with LOG: followed by chars" },
        { "text": "ERR LOG:Init", "shouldMatch": false, "description": "LOG: not at start (fails unanchored LOG:\\w+)" },
        { "text": "LOG:", "shouldMatch": false, "description": "Missing word characters after prefix" }
      ]
    },
    {
      "id": "m3_c17",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string ending with 'END'.",
      "ghostTemplate": "END$",
      "canonicalSolution": "END$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "THE END", "shouldMatch": true, "description": "Ends with END" },
        { "text": "ENDING", "shouldMatch": false, "description": "END not at end (fails unanchored END)" }
      ]
    },
    {
      "id": "m3_c18",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match standalone word 'code'.",
      "ghostTemplate": "\\bcode\\b",
      "canonicalSolution": "\\bcode\\b",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "write code now", "shouldMatch": true, "description": "Standalone word code" },
        { "text": "codex", "shouldMatch": false, "description": "code as prefix" },
        { "text": "decode", "shouldMatch": false, "description": "code as suffix (fails \\bcode)" }
      ]
    },
    {
      "id": "m3_c19",
      "type": "compound",
      "scaffold": "fading",
      "prompt": "Match string consisting exclusively of whitespace spaces.",
      "ghostTemplate": "^\\s+$",
      "canonicalSolution": "^\\s+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "   ", "shouldMatch": true, "description": "Whitespace spaces only" },
        { "text": " a ", "shouldMatch": false, "description": "Contains letter (fails unanchored \\s+)" }
      ]
    },
    {
      "id": "m3_c20",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure string contains ONLY 3 to 6 digits.",
      "canonicalSolution": "^\\d{3,6}$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "1234", "shouldMatch": true, "description": "4 digits (within range)" },
        { "text": "12", "shouldMatch": false, "description": "2 digits (too short)" },
        { "text": "1234567", "shouldMatch": false, "description": "7 digits (fails \\d+ or open-ended range)" }
      ]
    },
    {
      "id": "m3_c21",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure string contains ONLY non-digit characters.",
      "canonicalSolution": "^\\D+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "hello", "shouldMatch": true, "description": "Non-digits only" },
        { "text": "hello5", "shouldMatch": false, "description": "Contains digit at end (fails unanchored \\D+)" }
      ]
    },
    {
      "id": "m3_c22",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match string starting with exactly 3 digits.",
      "canonicalSolution": "^\\d{3}",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "555-1234", "shouldMatch": true, "description": "Starts with 3 digits" },
        { "text": "55-1234", "shouldMatch": false, "description": "Starts with 2 digits (fails unanchored \\d{3})" }
      ]
    },
    {
      "id": "m3_c23",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match string ending with exactly 4 digits.",
      "canonicalSolution": "\\d{4}$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "card-9821", "shouldMatch": true, "description": "Ends with 4 digits" },
        { "text": "card-982", "shouldMatch": false, "description": "Ends with 3 digits (too short)" }
      ]
    },
    {
      "id": "m3_c24",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match string starting with 'USER_' followed by one or more digits.",
      "canonicalSolution": "^USER_\\d+",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "USER_102", "shouldMatch": true, "description": "Starts with USER_ and digits" },
        { "text": "GUEST_102", "shouldMatch": false, "description": "Wrong prefix" },
        { "text": "OLD_USER_102", "shouldMatch": false, "description": "USER_ not at start (fails unanchored USER_\\d+)" },
        { "text": "USER_ABC", "shouldMatch": false, "description": "Non-digits after prefix" }
      ]
    },
    {
      "id": "m3_c25",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match any standalone 3-letter word.",
      "canonicalSolution": "\\b\\w{3}\\b",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "the cat sat", "shouldMatch": true, "description": "Contains 3-letter word" },
        { "text": "four", "shouldMatch": false, "description": "4-letter word (fails unanchored \\w{3})" }
      ]
    },
    {
      "id": "m3_c26",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure string starts with digit and consists strictly of word characters.",
      "canonicalSolution": "^\\d\\w+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "1test", "shouldMatch": true, "description": "Starts with digit, word chars only" },
        { "text": "test1", "shouldMatch": false, "description": "Does not start with digit" },
        { "text": "1test!", "shouldMatch": false, "description": "Contains symbol at end (fails unanchored \\d\\w+)" }
      ]
    },
    {
      "id": "m3_c27",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure string consists strictly of 3 to 8 word characters.",
      "canonicalSolution": "^\\w{3,8}$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "admin", "shouldMatch": true, "description": "5 word characters" },
        { "text": "hi", "shouldMatch": false, "description": "2 word characters (too short)" },
        { "text": "superadministrator", "shouldMatch": false, "description": "18 characters (fails \\w+ or unanchored range)" }
      ]
    },
    {
      "id": "m3_c28",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match standalone word 'dev'.",
      "canonicalSolution": "\\bdev\\b",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "senior dev lead", "shouldMatch": true, "description": "Standalone word dev" },
        { "text": "developer", "shouldMatch": false, "description": "dev as prefix" },
        { "text": "redev", "shouldMatch": false, "description": "dev as suffix (fails \\bdev)" }
      ]
    },
    {
      "id": "m3_c29",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure entire string is non-whitespace characters.",
      "canonicalSolution": "^\\S+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "no_spaces_here", "shouldMatch": true, "description": "Non-whitespace only" },
        { "text": "has space", "shouldMatch": false, "description": "Contains space (fails unanchored \\S+)" }
      ]
    },
    {
      "id": "m3_c30",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match string starting with one or more whitespace spaces.",
      "canonicalSolution": "^\\s+",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "   indented", "shouldMatch": true, "description": "Starts with spaces" },
        { "text": "not_indented", "shouldMatch": false, "description": "No spaces" },
        { "text": "not indented", "shouldMatch": false, "description": "Space in middle, not at start (fails unanchored \\s+)" }
      ]
    },
    {
      "id": "m3_c31",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Match string ending with one or more whitespace spaces.",
      "canonicalSolution": "\\s+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "trailing   ", "shouldMatch": true, "description": "Ends with spaces" },
        { "text": "no_trailing", "shouldMatch": false, "description": "No trailing spaces" },
        { "text": "has space inside", "shouldMatch": false, "description": "Space in middle, not at end (fails unanchored \\s+)" }
      ]
    },
    {
      "id": "m3_c32",
      "type": "compound",
      "scaffold": "blind",
      "prompt": "Ensure entire string contains strictly one or more digits or letters.",
      "canonicalSolution": "^\\w+$",
      "validatorType": "regex",
      "flags": "g",
      "testCases": [
        { "text": "Valid123", "shouldMatch": true, "description": "Word characters only" },
        { "text": "Invalid!", "shouldMatch": false, "description": "Contains exclamation mark (fails unanchored \\w+)" }
      ]
    }
  ]
}
