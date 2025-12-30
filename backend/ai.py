import os
from dotenv import load_dotenv
from google import genai
from google.genai.types import GenerateContentConfig


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing")

client = genai.Client(api_key=API_KEY)

SYSTEM_PROMPT = """
You are a professional AI assistant.
Always respond in well-structured Markdown.

Rules:
- Use headings
- Use bullet points
- Use code blocks for code
- Never respond as a single paragraph
"""

def generate_text_stream(prompt: str):
    contents = [SYSTEM_PROMPT, prompt]

    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash",
        contents=contents
    ):
        if chunk.text:
            yield chunk.text
