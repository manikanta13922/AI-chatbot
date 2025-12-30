# from fastapi import FastAPI, UploadFile, Form
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from ai import generate_text_stream

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/chat-stream")
# async def chat_stream(
#     message: str = Form(...),
#     file: UploadFile | None = None
# ):
#     def stream():
#         if file:
#             yield f"\n📄 **File received:** `{file.filename}`\n\n"
#             yield "🔍 Analyzing document...\n\n"

#         for chunk in generate_text_stream(message):
#             yield chunk

#     return StreamingResponse(stream(), media_type="text/plain")


from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pypdf import PdfReader
from docx import Document
from ai import generate_text_stream

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file: UploadFile) -> str:
    if file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if file.filename.endswith(".docx"):
        doc = Document(file.file)
        return "\n".join(p.text for p in doc.paragraphs)

    return ""

@app.post("/chat-stream")
async def chat_stream(
    message: str = Form(...),
    file: UploadFile | None = None
):
    def stream():
        context = ""

        if file:
            extracted_text = extract_text(file)
            context = f"""
THE USER UPLOADED THIS DOCUMENT.
YOU MUST USE IT TO ANSWER.

DOCUMENT CONTENT:
-----------------
{extracted_text}
-----------------
"""
            yield f"📄 **File received:** `{file.filename}`\n\n"
            yield "🔍 **Analyzing document...**\n\n"

        final_prompt = f"""
{context}

USER QUESTION:
{message}

RULES:
- Use ONLY the document if provided
- Give concrete answers
- No generic instructions
- Explain clearly
"""

        for chunk in generate_text_stream(final_prompt):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain")
