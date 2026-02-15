from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI(title="Legal Decision Bot API", version="1.0.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Legal Decision Bot API is running"}

@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Google API Key not configured")
    
    try:
        # Import here to avoid circular dependencies or initialization issues
        from rag_chain import get_rag_chain
        
        qa_chain = get_rag_chain()
        result = qa_chain.invoke(request.query)
        
        # Extract the answer and source documents
        answer = result.get('result', "No answer found.")
        source_docs = result.get('source_documents', [])
        
        sources = []
        for doc in source_docs:
            sources.append(doc.metadata.get('source', 'Unknown'))
            
        return {
            "response": answer,
            "sources": list(set(sources)) # Unique sources
        }
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
