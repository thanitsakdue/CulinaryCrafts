from datasets import load_dataset
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class RecipeEngine:
    def __init__(self):
        self.dataset = None
        self.recipes = []

    def initialize(self):
        """โหลด Dataset ภาษาไทยเตรียมไว้ใน Memory"""
        try:
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