import os
from typing import Optional, Any, List

class RAGService:
    def __init__(self):
        self.vector_db = None
        self.embeddings = None
        self.db_path = "./chroma_db_thai"
        self.disabled_reason: Optional[str] = None

        try:
            from langchain_openai import OpenAIEmbeddings  # type: ignore

            self.embeddings = OpenAIEmbeddings()
        except Exception as e:
            # Covers missing package and missing OpenAI credentials.
            self.disabled_reason = (
                "RAG is disabled because optional dependencies are missing or misconfigured "
                f"(reason: {e})."
            )

    def initialize_db(self):
        """โหลด Dataset และสร้าง Vector DB ถ้ายังไม่มี"""
        if self.disabled_reason:
            raise RuntimeError(self.disabled_reason)

        try:
            from datasets import load_dataset  # type: ignore
            from langchain_chroma import Chroma  # type: ignore
            from langchain_core.documents import Document  # type: ignore
        except ModuleNotFoundError as e:
            raise RuntimeError(
                "RAG optional dependencies are not installed. Install backend/requirements.txt (full) "
                "or backend/requirements-ai.txt plus required vector DB deps."  # noqa: E501
            ) from e

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
        if self.disabled_reason:
            raise RuntimeError(self.disabled_reason)

        if not self.vector_db:
            self.initialize_db()
        return self.vector_db.similarity_search(query, k=k)