import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("API Key not found")
else:
    genai.configure(api_key=GOOGLE_API_KEY)
    try:
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content="Hello world",
            task_type="retrieval_document",
            title="Embedding of single string"
        )
        print("Success with models/gemini-embedding-001")
    except Exception as e:
        print(f"Failed with models/gemini-embedding-001: {e}")
