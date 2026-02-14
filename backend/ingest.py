import os
import pandas as pd
from langchain_community.document_loaders import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

# Configuration
CSV_PATH = "../dataset/main_constitution_qa(in).csv"
CHROMA_DB_DIR = "chroma_db"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

def ingest_data():
    print(f"Loading data from {CSV_PATH}...")
    loader = CSVLoader(file_path=CSV_PATH, source_column="context", encoding="utf-8")
    documents = loader.load()
    
    print(f"Loaded {len(documents)} documents.")

    print("Initializing embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=GOOGLE_API_KEY)

    print("Creating Vector Store...")
    # Initialize empty Chroma DB
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR, 
        embedding_function=embeddings
    )
    
    batch_size = 30
    import time
    
    print(f"Ingesting {len(documents)} documents in batches of {batch_size}...")
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        max_retries = 5
        retry_count = 0
        while True:
            try:
                vectorstore.add_documents(batch)
                print(f"Processed batch {i//batch_size + 1}/{(len(documents)//batch_size)+1}")
                time.sleep(2) # Rate limit buffer
                break # Success, move to next batch
            except Exception as e:
                retry_count += 1
                wait_time = min(60, 2 ** retry_count) # Exponential backoff up to 60s
                print(f"Error processing batch {i} (Attempt {retry_count}): {e}")
                print(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)            
    print("Vector Store created and persisted.")

if __name__ == "__main__":
    ingest_data()
