from google.genai import types

def image_part(file_bytes, mime):
    return types.Part.from_bytes(data=file_bytes, mime_type=mime)
