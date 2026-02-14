import os
import pandas as pd
from langchain_community.document_loaders import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

# Configuration
import os
import glob
import json
import shutil
import time
from langchain_community.document_loaders import CSVLoader
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

# Configuration
DATASET_DIR = "../dataset"
CHROMA_DB_DIR = "chroma_db"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

def load_documents():
    documents = []
    
    # Load CSV files
    csv_files = glob.glob(os.path.join(DATASET_DIR, "*.csv"))
    for csv_file in csv_files:
        print(f"Loading CSV: {csv_file}")
        try:
            loader = CSVLoader(file_path=csv_file, source_column="context", encoding="utf-8")
            docs = loader.load()
            documents.extend(docs)
            print(f"Loaded {len(docs)} documents from CSV.")
        except Exception as e:
            print(f"Error loading CSV {csv_file}: {e}")

    # Load JSON files
    json_files = glob.glob(os.path.join(DATASET_DIR, "*.json"))
    for json_file in json_files:
        print(f"Loading JSON: {json_file}")
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            json_docs = []
            for item in data:
                # Combine question and answer into a single context
                if "question" in item and "answer" in item:
                    content = f"Question: {item['question']}\nAnswer: {item['answer']}"
                    metadata = {"source": os.path.basename(json_file)}
                    doc = Document(page_content=content, metadata=metadata)
                    json_docs.append(doc)
            
            documents.extend(json_docs)
            print(f"Loaded {len(json_docs)} documents from JSON.")
        except Exception as e:
            print(f"Error loading JSON {json_file}: {e}")
            
    return documents

def ingest_data():
    # Clear existing DB to avoid duplicates
    if os.path.exists(CHROMA_DB_DIR):
        print(f"Removing existing Chroma DB at {CHROMA_DB_DIR}...")
        shutil.rmtree(CHROMA_DB_DIR)

    documents = load_documents()
    print(f"Total documents to ingest: {len(documents)}")

    if not documents:
        print("No documents found. Exiting.")
        return

    print("Initializing embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=GOOGLE_API_KEY)

    print("Creating Vector Store...")
    # Initialize empty Chroma DB
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_DIR, 
        embedding_function=embeddings
    )
    
    batch_size = 5
    print(f"Ingesting {len(documents)} documents in batches of {batch_size}...")
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        max_retries = 10
        retry_count = 0
        while True:
            try:
                vectorstore.add_documents(batch)
                print(f"Processed batch {i//batch_size + 1}/{(len(documents)//batch_size)+1}")
                time.sleep(4) # Rate limit buffer
                break # Success, move to next batch
            except Exception as e:
                import re
                retry_count += 1
                
                # Check for specific retry delay in error message
                delay_match = re.search(r'retryDelay[^0-9]*([0-9]+)s', str(e))
                if delay_match:
                    wait_time = int(delay_match.group(1)) + 2 # Add buffer
                    print(f"Rate limit hit. Waiting {wait_time}s as requested by API...")
                else:
                    wait_time = min(120, 5 * (2 ** (retry_count - 1))) # Aggressive backoff: 5, 10, 20, 40...
                
                print(f"Error processing batch {i} (Attempt {retry_count}): {e}")
                print(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)            
    
    print("Vector Store created and persisted.")

if __name__ == "__main__":
    ingest_data()
