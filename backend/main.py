"""Compatibility entrypoint for platform start commands.

Allows `uvicorn main:app` (repo root `/backend`) to work by re-exporting
`app` from `app.main`.
"""

from app.main import app
