import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class RecipeEngine:
    def __init__(self):
        self.dataset = None
        self.recipes = []
        self.disabled_reason: Optional[str] = None

    def initialize(self):
        """โหลด Dataset ภาษาไทยเตรียมไว้ใน Memory"""
        # `datasets` (Hugging Face) is an optional dependency.
        # Allow the API to start in minimal/basic installs without it.
        try:
            try:
                from datasets import load_dataset  # type: ignore
            except ModuleNotFoundError as e:
                self.disabled_reason = (
                    "Optional dependency 'datasets' is not installed. "
                    "Install backend/requirements.txt (full) or add 'datasets' to your environment "
                    "to enable cookbook loading."
                )
                logger.warning(self.disabled_reason)
                logger.debug(f"datasets import error: {e}")
                self.dataset = None
                self.recipes = []
                return

            logger.info("📦 Loading Thai Food Dataset from Hugging Face...")
            ds = load_dataset("pythainlp/thai_food_v1.0")
            self.dataset = ds['train']
            if len(self.dataset) > 0:
                print(f"DEBUG: หัวข้อที่มีใน Dataset: {self.dataset[0].keys()}")
            for item in self.dataset:
                self.recipes.append({
                    "name": item.get("name", "ไม่ระบุชื่อ"),
                    "ingredients": item.get("text", "ไม่มีข้อมูลรายละเอียด"), 
                    "steps": ""
                })
            logger.info(f"✅ Loaded {len(self.recipes)} recipes successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to load dataset: {e}")
            self.disabled_reason = str(e)

    def search(self, query: str, limit: int = 5):
        if not query:
            return []
        keywords = query.replace(',', ' ').split()
        results_with_scores = []
        
        for recipe in self.recipes:
            text_to_search = f"{recipe.get('name', '')} {recipe.get('ingredients', '')} {recipe.get('description', '')}".lower()
            match_count = 0
            for kw in keywords:
                if kw.lower() in text_to_search:
                    match_count += 1
            if match_count > 0:
                results_with_scores.append({
                    "recipe": recipe,
                    "score": match_count
                })
                
        results_with_scores.sort(key=lambda x: x['score'], reverse=True)
        
        return [item['recipe'] for item in results_with_scores[:limit]]

recipe_engine = RecipeEngine()