"""Multi-provider AI factory mirroring ``backend/src/config/aiProviders.js``.

Public surface:
    create_ai_provider(provider=None, api_key=None, model=None) -> Provider | None

A ``Provider`` exposes a single ``generate(prompt: str) -> str`` method. If
``provider`` is omitted (the recommended "default" path), the factory walks
``DEFAULT_CHAIN`` and picks the first provider whose API key is configured in
the environment. Gemini is third in that chain, matching the Node factory's
fallback order, and is the de-facto default whenever ``GROQ_API_KEY`` and
``OPENAI_API_KEY`` are not set.

If no provider is available at all (no env keys, no explicit key), the
factory returns ``None`` so callers can degrade gracefully and skip the LLM
step.
"""

from __future__ import annotations

import os
import sys
from typing import Optional


# Mirrors the Node DEFAULT_CHAIN in aiProviders.js
DEFAULT_CHAIN = ("groq", "openai", "gemini", "openrouter")

DEFAULT_MODELS = {
    "gemini": "gemini-2.5-flash",
    "openai": "gpt-4o-mini",
    "openrouter": "openai/gpt-4o-mini",
    "groq": "llama-3.3-70b-versatile",
}

# Env-var map; same names as the Node backend.
ENV_KEYS = {
    "gemini": "GEMINI_API_KEY",
    "openai": "OPENAI_API_KEY",
    "groq": "GROQ_API_KEY",
    "openrouter": "OPENROUTER_API_KEY",
}


class ProviderError(RuntimeError):
    """Raised when a provider cannot be created or fails to generate."""


class _Provider:
    """Common interface implemented by every adapter."""

    name: str = "provider"
    model: str = ""

    def generate(self, prompt: str) -> str:  # pragma: no cover - interface
        raise NotImplementedError


class _GeminiProvider(_Provider):
    name = "gemini"

    def __init__(self, api_key: str, model: str):
        try:
            import google.generativeai as genai  # type: ignore
        except ImportError as exc:  # pragma: no cover
            raise ProviderError(
                "google-generativeai is not installed. Run: pip install -r requirements.txt"
            ) from exc
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(model)
        self.model = model

    def generate(self, prompt: str) -> str:
        response = self._model.generate_content(prompt)
        return (response.text or "").strip()


class _OpenAIProvider(_Provider):
    name = "openai"

    def __init__(self, api_key: str, model: str):
        try:
            from openai import OpenAI  # type: ignore
        except ImportError as exc:  # pragma: no cover
            raise ProviderError(
                "openai is not installed. Run: pip install -r requirements.txt"
            ) from exc
        self._client = OpenAI(api_key=api_key)
        self.model = model

    def generate(self, prompt: str) -> str:
        completion = self._client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        return (completion.choices[0].message.content or "").strip()


class _GroqProvider(_Provider):
    name = "groq"

    def __init__(self, api_key: str, model: str):
        try:
            from groq import Groq  # type: ignore
        except ImportError as exc:  # pragma: no cover
            raise ProviderError(
                "groq is not installed. Run: pip install -r requirements.txt"
            ) from exc
        self._client = Groq(api_key=api_key)
        self.model = model

    def generate(self, prompt: str) -> str:
        completion = self._client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=2048,
        )
        return (completion.choices[0].message.content or "").strip()


class _OpenRouterProvider(_Provider):
    name = "openrouter"

    def __init__(self, api_key: str, model: str):
        # OpenRouter is OpenAI-compatible; reuse the openai SDK.
        try:
            from openai import OpenAI  # type: ignore
        except ImportError as exc:  # pragma: no cover
            raise ProviderError(
                "openai is not installed (required for OpenRouter). "
                "Run: pip install -r requirements.txt"
            ) from exc
        self._client = OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")
        self.model = model

    def generate(self, prompt: str) -> str:
        completion = self._client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
        return (completion.choices[0].message.content or "").strip()


_PROVIDERS = {
    "gemini": _GeminiProvider,
    "openai": _OpenAIProvider,
    "groq": _GroqProvider,
    "openrouter": _OpenRouterProvider,
}


def _resolve_env_key(name: str) -> Optional[str]:
    """Pull a key from the environment, accepting a couple of common aliases."""
    primary = ENV_KEYS.get(name, "")
    if primary and os.environ.get(primary):
        return os.environ[primary]

    # OpenRouter has historically been documented as OPENROUTER_API_KEY; some
    # deployments also use OPENAI_API_KEY_OPENROUTER. Accept both.
    if name == "openrouter":
        for alt in ("OPENROUTER_API_KEY", "OPENAI_API_KEY_OPENROUTER"):
            if os.environ.get(alt):
                return os.environ[alt]
    return None


def create_ai_provider(
    provider: Optional[str] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> Optional[_Provider]:
    """Build an AI provider adapter, mirroring the Node factory.

    Args:
        provider: One of ``gemini`` / ``openai`` / ``groq`` / ``openrouter``,
            or ``None`` to auto-pick the first available key from
            ``DEFAULT_CHAIN``.
        api_key: Optional explicit key. If omitted, the env var is used.
        model: Optional model override. Defaults to ``DEFAULT_MODELS[name]``.

    Returns:
        A provider with a ``generate(prompt) -> str`` method, or ``None`` if
        no provider could be configured.
    """
    name = (provider or "").strip().lower() or None

    if name:
        key = api_key or _resolve_env_key(name)
        if not key:
            return None
        cls = _PROVIDERS.get(name)
        if not cls:
            raise ProviderError(
                f"Unsupported AI provider '{name}'. "
                f"Supported: {', '.join(_PROVIDERS)}"
            )
        return cls(key, model or DEFAULT_MODELS[name])

    # Default path: walk the chain, pick the first provider with a key.
    for candidate in DEFAULT_CHAIN:
        key = _resolve_env_key(candidate)
        if key:
            cls = _PROVIDERS[candidate]
            return cls(key, model or DEFAULT_MODELS[candidate])

    return None


def _self_test() -> int:
    """Tiny CLI: prints the resolved provider, exits 0/1."""
    provider = create_ai_provider()
    if provider is None:
        print("no_provider", file=sys.stderr)
        return 1
    print(f"{provider.name}:{provider.model}")
    return 0


if __name__ == "__main__":
    raise SystemExit(_self_test())
