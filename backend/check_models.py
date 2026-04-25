import os
from google import genai

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("Set GEMINI_API_KEY before running this script")

client = genai.Client(api_key=api_key)
for m in client.models.list():
    if "generateContent" in getattr(m, "supported_actions", []):
        print(m.name)
