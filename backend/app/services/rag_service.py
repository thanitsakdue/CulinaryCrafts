from datasets import load_dataset
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
import os

class RAGService:
    def __init__(self):
        self.vector_db = None
        self.embeddings = OpenAIEmbeddings()
        self.db_path = "./chroma_db_thai"

    def initialize_db(self):
        """โหลด Dataset และสร้าง Vector DB ถ้ายังไม่มี"""
        if os.path.exists(self.db_path):
            self.vector_db = Chroma(persist_directory=self.db_path, embedding_function=self.embeddings)
            return

        print("📦 Loading Thai Food Dataset...")
        ds = load_dataset("pythainlp/thai_food_v1.0")
        
        docs = []
        for entry in ds['train'].select(range(100)):
            content = f"เมนู: {entry['name']}\nวัตถุดิบ: {entry['ingredients']}\nวิธีทำ: {entry['steps']}"
            docs.append(Document(page_content=content, metadata={"name": entry['name']}))
        
        self.vector_db = Chroma.from_documents(
            documents=docs, 
            embedding=self.embeddings,
            persist_directory=self.db_path
        )
        print("✅ Vector DB initialized!")

    def search_recipes(self, query: str, k: int = 3):
        """ค้นหาสูตรอาหารที่ใกล้เคียงที่สุด"""
        if not self.vector_db:
            self.initialize_db()
        return self.vector_db.similarity_search(query, k=k)