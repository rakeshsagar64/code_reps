# Regex Card Authoring Guidelines & Module Rewrites

## Core Principles for Compassionate Card Writing

1. **State the Goal Before Mechanics:** Frame tasks around real-world scenarios (e.g., parsing log files, cleaning user inputs) instead of dry regex terminology.
2. **Explicit Extraction Rules:** When validating capture groups (`expectedGroups`), explicitly state what text should be captured (e.g., *"capturing only the number, leaving out the prefix"*).
3. **Transparent Boundary Guidance:** If start (`^`) or end (`$`) anchors are required, state the requirement clearly in the prompt (e.g., *"strictly from start to end"* or *"at the start of the line"*).
4. **Predictable Test Cases:** Every anchored card must include leading-noise (`"prefix_data"`) and trailing-noise (`"data_suffix"`) test cases. Avoid unannounced edge cases (like matching empty strings `""`) unless optional quantifiers are explicitly being taught.

---

## Card Authoring Template

```json
{
  "id": "mX_cY",
  "type": "atomic | compound",
  "scaffold": "fading",
  "prompt": "[Goal in friendly language]. [Explicit capture/group instruction]. [Anchor hint if required].",
  "hint": "[Kind nudge explaining the structure without giving away the exact solution].",
  "ghostTemplate": "Expected regex shape",
  "canonicalSolution": "Canonical regex solution",
  "testCases": [
    { "text": "valid1", "shouldMatch": true, "expected": "full_match", "expectedGroups": ["group1"] },
    { "text": "valid2", "shouldMatch": true, "expected": "full_match", "expectedGroups": ["group1"] },
    { "text": "prefix_valid1", "shouldMatch": false, "description": "Enforces ^ anchor" },
    { "text": "valid1_suffix", "shouldMatch": false, "description": "Enforces $ anchor" },
    { "text": "invalid_format", "shouldMatch": false, "description": "Tests invalid core pattern" }
  ]
}
