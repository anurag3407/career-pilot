"""Time-series activity analyzer for a local git repository.

Usage (from the Node parent, or directly):

    python3 analyzer.py <repo_path> [--provider gemini] [--api-key …]
                             [--model …] [--weeks 52] [--detailed]

Reads ``git log`` from the given path, buckets commits into ISO weeks, and
emits a single JSON object on stdout with the shape consumed by
``backend/src/services/activityService.js`` and the React Activity tab.

If no AI provider is available the script still emits the ``weekly`` /
``totals`` data, but ``insight`` is set to ``null``.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict
from typing import Any, Dict, Iterable, List, Optional, Tuple

# Allow `python3 analyzer.py ...` to find the sibling ai_factory module.
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
if _THIS_DIR not in sys.path:
    sys.path.insert(0, _THIS_DIR)

from ai_factory import create_ai_provider  # noqa: E402


# ---------- git plumbing ---------------------------------------------------

# Commit format: hash | ISO date | author name | author email
# `--shortstat` after each commit gives " 1 file changed, 12 insertions(+), 3 deletions(-)"
_GIT_LOG_FORMAT = "%H|%aI|%an|%ae"
_SHORTSTAT_TRAILER = "__SHORTSTAT__"
_RECORD_SEP = "\x1e"  # unlikely to appear in commit messages
_LINE_SEP = "\x1f"


def _run_git_log(repo_path: str, max_commits: int = 5000) -> List[Dict[str, Any]]:
    """Run ``git log`` with shortstat and parse the output into a list of dicts."""
    cmd = [
        "git",
        "-C",
        repo_path,
        "log",
        f"--pretty=format:{_RECORD_SEP}{_GIT_LOG_FORMAT}{_LINE_SEP}{_SHORTSTAT_TRAILER}",
        "-n",
        str(max_commits),
        "--shortstat",
    ]
    try:
        proc = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    except FileNotFoundError:
        raise RuntimeError("git executable not found on PATH")
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"git log failed: {exc.stderr.strip() or exc.stdout.strip()}"
        ) from exc

    return list(_parse_log(proc.stdout))


# Pattern that matches the numeric portions of git's shortstat line.
# Examples we must handle:
#   " 1 file changed, 12 insertions(+), 3 deletions(-)"
#   " 2 files changed, 5 insertions(+)"
#   " 3 files changed, 1 insertion(+), 2 deletions(-)"
_INSERTIONS_RE = re.compile(r"(\d+)\s+insertion", re.IGNORECASE)
_DELETIONS_RE = re.compile(r"(\d+)\s+deletion", re.IGNORECASE)
_FILES_RE = re.compile(r"(\d+)\s+files?\s+changed", re.IGNORECASE)


def _parse_log(blob: str) -> Iterable[Dict[str, Any]]:
    """Parse the pretty-formatted ``git log`` output into commit dicts."""
    for raw in blob.split(_RECORD_SEP):
        if not raw.strip():
            continue
        # Split header / shortstat trailer
        if _LINE_SEP not in raw:
            # Commit has no shortstat (merge with no diff, or root commit).
            header = raw.strip()
            shortstat = ""
        else:
            header, shortstat = raw.split(_LINE_SEP, 1)
            shortstat = shortstat.replace(_SHORTSTAT_TRAILER, "").strip()

        parts = header.strip().split("|")
        if len(parts) < 4:
            continue
        sha, iso_date, author_name, author_email = (
            parts[0].strip(),
            parts[1].strip(),
            parts[2].strip(),
            parts[3].strip(),
        )

        added = 0
        removed = 0
        files_changed = 0
        if shortstat:
            m = _INSERTIONS_RE.search(shortstat)
            if m:
                added = int(m.group(1))
            m = _DELETIONS_RE.search(shortstat)
            if m:
                removed = int(m.group(1))
            m = _FILES_RE.search(shortstat)
            if m:
                files_changed = int(m.group(1))

        yield {
            "sha": sha,
            "date": iso_date,
            "author": author_name or author_email or "unknown",
            "added": added,
            "removed": removed,
            "filesChanged": files_changed,
        }


# ---------- aggregation ----------------------------------------------------


def _week_start(d: dt.date) -> dt.date:
    """Return the Monday on or before ``d`` (ISO week start)."""
    return d - dt.timedelta(days=d.weekday())


def aggregate(
    commits: List[Dict[str, Any]], weeks: int
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Bucket commits into the last ``weeks`` ISO weeks.

    Returns ``(weekly, totals)``.
    """
    if not commits:
        return [], _empty_totals()

    # Parse all dates once.
    parsed: List[Tuple[dt.date, Dict[str, Any]]] = []
    for c in commits:
        try:
            d = dt.datetime.fromisoformat(c["date"]).date()
        except (TypeError, ValueError):
            continue
        parsed.append((d, c))

    if not parsed:
        return [], _empty_totals()

    parsed.sort(key=lambda x: x[0], reverse=True)
    cutoff = parsed[0][0]  # most recent commit
    earliest = cutoff - dt.timedelta(weeks=weeks - 1)
    # Floor earliest to its week start so the range is exactly N weeks.
    earliest_week = _week_start(earliest)
    if earliest_week < earliest:
        # We want the *latest* Monday such that ``cutoff_week - N + 1`` weeks
        # covers everything. Always use week-aligned math.
        pass

    week_index: Dict[dt.date, Dict[str, Any]] = {}
    for d, c in parsed:
        ws = _week_start(d)
        if ws < _week_start(cutoff) - dt.timedelta(weeks=weeks - 1):
            continue
        bucket = week_index.setdefault(
            ws,
            {
                "weekStart": ws.isoformat(),
                "total": 0,
                "byAuthor": defaultdict(int),
                "added": 0,
                "removed": 0,
            },
        )
        bucket["total"] += 1
        bucket["byAuthor"][c["author"]] += 1
        bucket["added"] += c["added"]
        bucket["removed"] += c["removed"]

    weekly = []
    for ws in sorted(week_index):
        b = week_index[ws]
        weekly.append(
            {
                "weekStart": b["weekStart"],
                "total": b["total"],
                "byAuthor": dict(b["byAuthor"]),
                "added": b["added"],
                "removed": b["removed"],
            }
        )

    totals = _summarize(weekly)
    return weekly, totals


def _empty_totals() -> Dict[str, Any]:
    return {
        "commits": 0,
        "weeksActive": 0,
        "avgPerActiveWeek": 0,
        "peakWeek": None,
        "peakCount": 0,
        "topAuthors": [],
        "linesAdded": 0,
        "linesRemoved": 0,
    }


def _summarize(weekly: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not weekly:
        return _empty_totals()

    commits = sum(w["total"] for w in weekly)
    weeks_active = sum(1 for w in weekly if w["total"] > 0)
    avg = round(commits / weeks_active, 2) if weeks_active else 0

    peak = max(weekly, key=lambda w: w["total"])
    author_counter: Counter = Counter()
    added = 0
    removed = 0
    for w in weekly:
        for name, n in w["byAuthor"].items():
            author_counter[name] += n
        added += w["added"]
        removed += w["removed"]

    top = [{"name": n, "commits": c} for n, c in author_counter.most_common(5)]

    return {
        "commits": commits,
        "weeksActive": weeks_active,
        "avgPerActiveWeek": avg,
        "peakWeek": peak["weekStart"],
        "peakCount": peak["total"],
        "topAuthors": top,
        "linesAdded": added,
        "linesRemoved": removed,
    }


# ---------- prompt + insight -----------------------------------------------


_SUMMARY_SYSTEM = (
    "You are a senior software engineer who analyses git history. "
    "Given weekly commit totals and the top contributors, write a single "
    "short paragraph (max 90 words) describing the project's activity. "
    "Mention: overall trend, peak / quiet periods, and the dominant "
    "contributor. Do not use bullet points. Do not invent numbers."
)


_DETAILED_SYSTEM = (
    "You are a senior software engineer analysing git history. You will be "
    "given a JSON object with weekly commit counts. Reply with ONLY a raw "
    "JSON object (no markdown fences) of the form:\n"
    "{\n"
    '  "peaks": [{"week": "YYYY-MM-DD", "commits": 12, "reason": "..."}],\n'
    '  "valleys": [{"week": "YYYY-MM-DD", "commits": 0, "reason": "..."}],\n'
    '  "trend": "accelerating|steady|declining|stagnant",\n'
    '  "trendExplanation": "one sentence",\n'
    '  "busiestAuthor": "name",\n'
    '  "cadenceChange": "one sentence describing any shift in cadence"\n'
    "}\n"
    "Include at most 3 peaks and 3 valleys. Keep reasons short."
)


def _summary_prompt(weekly: List[Dict[str, Any]], totals: Dict[str, Any]) -> str:
    trimmed_weekly = [
        {"weekStart": w["weekStart"], "total": w["total"]} for w in weekly
    ]
    return (
        f"{_SUMMARY_SYSTEM}\n\n"
        f"Totals: {json.dumps(totals, default=str)}\n\n"
        f"Weekly (last {len(trimmed_weekly)} weeks): "
        f"{json.dumps(trimmed_weekly, default=str)}"
    )


def _detailed_prompt(weekly: List[Dict[str, Any]], totals: Dict[str, Any]) -> str:
    return (
        f"{_DETAILED_SYSTEM}\n\n"
        f"Totals: {json.dumps(totals, default=str)}\n\n"
        f"Weekly: {json.dumps(weekly, default=str)}"
    )


def _safe_generate(provider, prompt: str) -> Optional[str]:
    try:
        return provider.generate(prompt)
    except Exception as exc:  # pragma: no cover - network / SDK errors
        sys.stderr.write(f"ai_generate_failed: {exc}\n")
        return None


# ---------- CLI ------------------------------------------------------------


def _build_payload(
    repo_path: str,
    weeks: int,
    detail: bool,
    provider_name: Optional[str],
    api_key: Optional[str],
    model: Optional[str],
) -> Dict[str, Any]:
    commits = _run_git_log(repo_path)
    weekly, totals = aggregate(commits, weeks)

    provider = create_ai_provider(provider_name, api_key, model)
    used_provider = None
    used_model = None
    if provider is not None:
        used_provider = provider.name
        used_model = provider.model
        summary_text = _safe_generate(
            provider, _summary_prompt(weekly, totals)
        )
    else:
        summary_text = None

    detailed_payload: Optional[Dict[str, Any]] = None
    if detail and provider is not None and weekly:
        raw = _safe_generate(provider, _detailed_prompt(weekly, totals))
        if raw:
            try:
                cleaned = re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.M)
                detailed_payload = json.loads(cleaned)
            except json.JSONDecodeError:
                # Treat the raw text as a fallback if the model did not comply.
                detailed_payload = {"raw": raw}

    return {
        "weekly": weekly,
        "totals": totals,
        "insight": (
            {
                "summary": summary_text,
                "detailed": detailed_payload,
            }
            if summary_text or detailed_payload
            else None
        ),
        "meta": {
            "provider": used_provider,
            "model": used_model,
            "commitsScanned": len(commits),
            "weeks": weeks,
            "detail": detail,
        },
    }


def _parse_args(argv: List[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("repo_path", help="Path to a locally cloned git repository")
    p.add_argument(
        "--weeks",
        type=int,
        default=52,
        help="Number of weeks of history to aggregate (default: 52)",
    )
    p.add_argument(
        "--provider",
        default=None,
        help="AI provider override (gemini|openai|groq|openrouter). "
        "If omitted, the factory walks the default chain.",
    )
    p.add_argument(
        "--api-key",
        default=None,
        help="Explicit API key. If omitted, the env var is used.",
    )
    p.add_argument(
        "--model",
        default=None,
        help="Model name override (provider-specific).",
    )
    p.add_argument(
        "--detailed",
        action="store_true",
        help="Also generate the structured (peaks/valleys/trend) insight.",
    )
    return p.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = _parse_args(argv or sys.argv[1:])

    if not os.path.isdir(args.repo_path):
        print(
            json.dumps({"error": f"repo_path is not a directory: {args.repo_path}"}),
            file=sys.stdout,
        )
        return 2

    try:
        payload = _build_payload(
            repo_path=args.repo_path,
            weeks=max(1, min(args.weeks, 520)),
            detail=args.detailed,
            provider_name=args.provider,
            api_key=args.api_key,
            model=args.model,
        )
    except RuntimeError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stdout)
        return 1

    json.dump(payload, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
