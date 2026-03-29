import fitz  # PyMuPDF
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
import logging
import time
logger = logging.getLogger(__name__)

class PDFRecipeEngine:
    def __init__(self):
        self.vector_store = None
        # ดึง API Key จาก Environment Variable
        api_key = os.getenv("GEMINI_API_KEY")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=api_key
        )

    def initialize(self):
            """โหลดไฟล์ PDF พร้อมระบบ Persistence (ไม่ต้องโหลดซ้ำถ้าเคยเซฟไว้แล้ว)"""
            import time
            import os
            from langchain_community.vectorstores import FAISS

            save_path = "faiss_index"  # ชื่อโฟลเดอร์ที่จะเก็บข้อมูล
            data_folder = os.path.join(os.getcwd(), "data")
            
            # --- [1. ตรวจสอบว่าเคยเซฟไว้หรือยัง] ---
            if os.path.exists(save_path):
                logger.info("📖 พบฐานความรู้เดิมในเครื่อง! กำลังโหลด...")
                try:
                    self.vector_store = FAISS.load_local(
                        save_path, 
                        self.embeddings,
                        allow_dangerous_deserialization=True
                    )
                    logger.info("✅ โหลดสำเร็จ! พร้อมใช้งานทันที (ไม่ต้องรอ 35 วินาที)")
                    return # จบการทำงานตรงนี้เลย
                except Exception as e:
                    logger.error(f"❌ โหลดไฟล์เซฟพลาด: {e} จะเริ่มอ่าน PDF ใหม่แทน")

            # --- [2. ถ้ายังไม่เคยเซฟ (หรือโหลดพลาด) ให้รันระบบเดิม] ---
            if not os.path.exists(data_folder):
                logger.error(f"❌ ไม่พบโฟลเดอร์ data ที่: {data_folder}")
                return

            pdf_files = [f for f in os.listdir(data_folder) if f.endswith('.pdf')]
            if not pdf_files:
                logger.warning(f"⚠️ ไม่พบไฟล์ PDF ในโฟลเดอร์: {data_folder}")
                return

            all_chunks = []
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

            try:
                # อ่าน PDF
                for filename in pdf_files:
                    pdf_path = os.path.join(data_folder, filename)
                    logger.info(f"📄 กำลังอ่านไฟล์: {filename}...")
                    doc = fitz.open(pdf_path)
                    text = "".join([page.get_text() for page in doc])
                    file_chunks = text_splitter.split_text(text)
                    all_chunks.extend(file_chunks)
                    logger.info(f"✅ อ่าน {filename} สำเร็จ ({len(file_chunks)} ส่วน)")

                # ทำ Embedding (Batching 30, Sleep 35)
                if all_chunks:
                    batch_size = 30
                    self.vector_store = None
                    
                    for i in range(0, len(all_chunks), batch_size):
                        batch = all_chunks[i:i + batch_size]
                        logger.info(f"⏳ กำลังประมวลผลส่วนที่ {i+1} ถึง {min(i+batch_size, len(all_chunks))}...")
                        
                        if self.vector_store is None:
                            self.vector_store = FAISS.from_texts(batch, self.embeddings)
                        else:
                            self.vector_store.add_texts(batch)
                        
                        if i + batch_size < len(all_chunks):
                            logger.info("😴 พัก 35 วินาที (ป้องกัน Quota Exceeded)...")
                            time.sleep(35)

                    # --- [3. เมื่อประมวลผลเสร็จ ให้ Save ลงเครื่อง] ---
                    self.vector_store.save_local(save_path)
                    logger.info(f"💾 บันทึกฐานความรู้ลงใน '{save_path}' เรียบร้อย! รอบหน้าจะเปิดได้เร็วขึ้น")
                    logger.info(f"🚀 เชฟเรียนรู้ข้อมูลเสร็จสิ้น! รวมทั้งหมด {len(all_chunks)} ส่วน")
                
            except Exception as e:
                logger.error(f"❌ เกิดข้อผิดพลาดระหว่างโหลดไฟล์: {e}")

    def search(self, query: str, limit: int = 3):
        """ค้นหาข้อมูลที่ใกล้เคียงที่สุดจากเนื้อหาใน PDF"""
        if not self.vector_store or not query:
            return []
        
        docs = self.vector_store.similarity_search(query, k=limit)
        return [{"content": d.page_content} for d in docs]
    
recipe_engine = PDFRecipeEngine()