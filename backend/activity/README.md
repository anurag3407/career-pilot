# Activity Analyzer (Python)

Time-series activity analyzer that runs against a locally-cloned git
repository. Produces weekly commit aggregations and an LLM-generated
insight, consumed by the Project Visualizer's **Activity** tab.

This module is invoked by `backend/src/services/activityService.js` via
`child_process.execFile('python3', ['activity/analyzer.py', ...])`.

## Install

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run directly (smoke test)

```bash
# Aggregate the last 52 weeks for a repo on disk
python3 activity/analyzer.py /path/to/some-cloned-repo

# Override the AI provider / key / model
python3 activity/analyzer.py /path/to/some-cloned-repo \
  --provider gemini --api-key $GEMINI_API_KEY --model gemini-2.5-flash

# Include the structured peaks/valleys/trend insight
python3 activity/analyzer.py /path/to/some-cloned-repo --detailed
```

The script prints a single JSON object on stdout. With no provider
configured (no env keys) it still emits the `weekly` / `totals` blocks,
but `insight` is `null`.

## Provider resolution

Mirrors `backend/src/config/aiProviders.js`. If `--provider` is omitted,
the factory walks `DEFAULT_CHAIN = (groq, openai, gemini, openrouter)` and
picks the first provider whose env-var key is set. Gemini is third in
that chain and is the de-facto default whenever `GROQ_API_KEY` and
`OPENAI_API_KEY` are not set.

| Provider    | Env var             | Default model             |
|-------------|---------------------|---------------------------|
| groq        | `GROQ_API_KEY`      | `llama-3.3-70b-versatile` |
| openai      | `OPENAI_API_KEY`    | `gpt-4o-mini`             |
| gemini      | `GEMINI_API_KEY`    | `gemini-2.5-flash`        |
| openrouter  | `OPENROUTER_API_KEY`| `openai/gpt-4o-mini`      |

## Output shape

```jsonc
{
  "weekly": [
    {
      "weekStart": "2025-01-06",
      "total": 12,
      "byAuthor": { "Alice": 9, "Bob": 3 },
      "added": 245,
      "removed": 80
    }
  ],
  "totals": {
    "commits": 432,
    "weeksActive": 38,
    "avgPerActiveWeek": 11.4,
    "peakWeek": "2025-04-14",
    "peakCount": 27,
    "topAuthors": [{ "name": "Alice", "commits": 178 }],
    "linesAdded": 12345,
    "linesRemoved": 4321
  },
  "insight": {
    "summary": "Short paragraph describing the activity…",
    "detailed": {
      "peaks":    [{ "week": "2025-04-14", "commits": 27, "reason": "…" }],
      "valleys":  [{ "week": "2024-12-23", "commits":  0, "reason": "…" }],
      "trend": "accelerating",
      "trendExplanation": "…",
      "busiestAuthor": "Alice",
      "cadenceChange": "…"
    }
  },
  "meta": {
    "provider": "gemini",
    "model": "gemini-2.5-flash",
    "commitsScanned": 432,
    "weeks": 52,
    "detail": false
  }
}
```
