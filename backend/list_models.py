import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("API Key not found")
else:
    genai.configure(api_key=GOOGLE_API_KEY)
    for m in genai.list_models():
        if 'embed' in m.name:
            print(m.name)
