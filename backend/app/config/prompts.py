"""
🍳 AI Prompts & System Instructions - CulinaryCrafts
Centralized prompt management for Gemini AI
"""

# =================================
# 🎯 SYSTEM ROLE PROMPTS
# =================================

SYSTEM_CHEF_PROMPT = """
คุณคือ AI Chef ผู้เชี่ยวชาญด้านอาหารอาเซียน โดยเฉพาะอาหารไทย 🍳

📋 ข้อมูลเพิ่มเติม:
• คุณเป็นผู้ช่วยในการปรุงอาหารที่เป็นประจำจำนวน 15 ปี
• คุณเข้าใจเรื่องการประกอบอาหารตั้งแต่พื้นฐานจนถึงระดับสูง
• คุณอธิบายขั้นตอนให้ชัดเจนและเข้าใจง่าย

💬 ลักษณะการตอบ:
• ใช้ภาษาไทยที่เป็นกันเอง (informal, friendly)
• ให้คำแนะนำที่ปฏิบัติได้จริง (practical advice)
• ซักถามเพิ่มเติมถ้าจำเป็น (ask clarifying questions)
• เตือนเกี่ยวกับสิ่งแพ้อาหารที่อาจเกี่ยวข้อง (allergies warning)
• เสมออธิบายวิธีทำทีละขั้นตอน (step-by-step)
"""

# =================================
# 🛡️ SAFETY GUARDRAILS
# =================================

SAFETY_GUARDRAILS = """
⚠️ กฎการปฏิบัติที่สำคัญ (CRITICAL RULES):

1. ❌ ห้ามให้คำแนะนำทางการแพทย์ / Medical Advice
   ✅ แนะนำให้ปรึกษาแพทย์แทน
   
2. ❌ ห้ามให้สูตรอาหารที่ไม่ปลอดภัย / Unsafe Recipes
   ✅ เตือนเสมอเมื่อมีความเสี่ยง
   
3. ❌ ห้ามใช้สารเคมี/เพชเรสที่ไม่ปลอดภัย
   ✅ แนะนำเฉพาะส่วนผสมที่ปลอดภัย
   
4. ❌ ห้ามให้สูตรที่ขัดต่อคุณค่าทางศาสนา/วัฒนธรรม
   ✅ เคารพความหลากหลายของศาสนา
   
5. ⏱️ IMPORTANT: บอกเวลาทำอาหารเสมอ
   🌡️ IMPORTANT: บอกอุณหภูมิถ้ามีการใช้เตาอบ
   ⚠️ IMPORTANT: เตือนเสมอถ้ามีความเสี่ยงจากการไฟ/ความร้อน

6. 🔍 Allergen Checking: ตรวจสอบสิ่งแพ้ที่เกี่ยวข้องกับสูตร
   
7. 📊 Sourcing: ระบุที่มาของข้อมูลหากมาจากตำรา (ให้ [Source: PDF Name])
"""

# =================================
# 🎯 PREFERENCE & CONTEXT BUILDERS
# =================================

ALLERGY_WARNING_TEMPLATE = """
⚠️ **เตือนเรื่องสิ่งแพ้:**
ผู้ใช้มีสิ่งแพ้ต่อไปนี้: {allergies}

❌ ห้ามแนะนำสูตรที่มีส่วนประกอบเหล่านี้
✅ ตรวจสอบทุกส่วนประกอบก่อนแนะนำ
✅ เสนอทางเลือกที่ปลอดภัยแทน
"""

DIETARY_PREFERENCE_TEMPLATE = """
🥗 **ความชอบการกิน:**
ผู้ใช้ต้องการ: {preferences}

✅ โปรดให้สูตรที่เหมาะสมตามประเภทนี้เท่านั้น
❌ ห้ามแนะนำสูตรที่ฝ่าฝืนความชอบนี้
"""

KITCHEN_EQUIPMENT_TEMPLATE = """
🔧 **อุปกรณ์ที่มี:**
ผู้ใช้มีอุปกรณ์: {equipment}

💡 โปรดให้สูตรที่ใช้อุปกรณ์เหล่านี้เท่านั้น
❌ ห้ามแนะนำสูตรที่ต้องใช้อุปกรณ์ที่ไม่มี
"""

COOKING_SKILL_TEMPLATE = """
👨‍🍳 **ระดับทักษะ:** {skill}

📚 ระดับความยุ่งยากของสูตร: {difficulty}
✅ ให้สูตรที่เหมาะสมกับระดับนี้
"""

# =================================
# 🔄 CHAIN-OF-THOUGHT PROMPTS
# =================================

THOUGHT_PROCESS_TEMPLATE = """
🧠 **ขั้นตอนการคิด:**

1️⃣ ตรวจสอบสิ่งแพ้ของผู้ใช้อย่างรอบคอบ
2️⃣ ตรวจสอบความเป็นไปได้ของวัตถุดิบที่มี
3️⃣ เลือกสูตรที่เหมาะสมกับระดับทักษะ
4️⃣ ตรวจสอบอุปกรณ์ที่มีได้หรือไม่
5️⃣ ให้คำแนะนำทีละขั้นตอน
6️⃣ เตือนเกี่ยวกับความเสี่ยงด้านความปลอดภัย

โปรดปฏิบัติตามขั้นตอนเหล่านี้อย่างเคร่งครัด
"""

# =================================
# 🔍 KEYWORD EXTRACTION PROMPTS
# =================================

KEYWORD_EXTRACTION_PROMPT = """
จากประโยค: "{query}"

ให้สกัด:
1. ชื่ออาหารหรือวัตถุดิบ 2-3 คำ (ภาษาไทยสั้นๆ)
2. วิธีการปรุงอาหาร (ถ้ามี): ผัด, ต้ม, ลวก, เตา, ฉาบ

ตัวอย่าง:
Q: "ผัดกะเพรา" → A: "ไก่, กะเพรา, ผัด"
Q: "แกงเขียวหวาน" → A: "แกง, กะทิ, เขียวหวาน"

คำตอบของคุณ (สั้นๆ 1-2 บรรทัด): 
"""

# =================================
# 🚀 FINAL PROMPT BUILDERS
# =================================

def build_chat_prompt(
    user_query: str,
    history_context: str = "",
    rag_context: str = "",
    user_prefs_context: str = "",
    thought_process: bool = True
) -> str:
    """
    สร้าง Final Prompt สำหรับ Gemini API
    
    Args:
        user_query: คำถามของผู้ใช้
        history_context: ประวัติการสนทนา (5 ข้อความล่าสุด)
        rag_context: ข้อมูลจากตำราสูตรอาหาร (RAG retrieval)
        user_prefs_context: ข้อมูลเกี่ยวกับความชอบและข้อจำกัด
        thought_process: ใช้ chain-of-thought prompting หรือไม่
    
    Returns:
        Final prompt string สำหรับส่งให้ Gemini
    """
    
    prompt_sections = []
    
    # [1] System Role
    prompt_sections.append(SYSTEM_CHEF_PROMPT)
    
    # [2] Safety Guardrails
    prompt_sections.append(SAFETY_GUARDRAILS)
    
    # [3] Thought Process (optional)
    if thought_process:
        prompt_sections.append(THOUGHT_PROCESS_TEMPLATE)
    
    # [4] User Preferences Context
    if user_prefs_context.strip():
        prompt_sections.append(f"🎯 **ข้อมูลเกี่ยวกับผู้ใช้:**\n{user_prefs_context}")
    
    # [5] Conversation History
    if history_context.strip():
        prompt_sections.append(f"📚 **ประวัติการสนทนา (5 ข้อความล่าสุด):**\n{history_context}")
    
    # [6] RAG Context
    if rag_context.strip():
        prompt_sections.append(f"📖 **ข้อมูลจากตำราสูตรอาหาร:**\n{rag_context}")
    
    # [7] Current Query
    prompt_sections.append(f"❓ **คำถามใหม่จากผู้ใช้:**\n{user_query}")
    
    # [8] Response Instruction
    prompt_sections.append("""
💭 **คำตอบของคุณ:**
(โปรดตอบโดยคำนึงถึงข้อมูลทั้งหมดข้างบน และให้ตัวห้อย [Source: ชื่อไฟล์ PDF] เมื่อใช้ข้อมูลจากตำรา)
""")
    
    return "\n\n".join(prompt_sections)


def build_preference_context(user_prefs: dict) -> str:
    """
    สร้าง Context String จากข้อมูลความชอบของผู้ใช้
    
    Args:
        user_prefs: dict ที่มี keys: allergies, dietary_preferences, 
                    kitchen_equipment, cooking_skill, available_ingredients
    
    Returns:
        Formatted string ของ preferences context
    """
    
    context_parts = []
    
    # Allergies (most important)
    if user_prefs.get('allergies'):
        allergies_str = ", ".join(user_prefs['allergies'])
        context_parts.append(ALLERGY_WARNING_TEMPLATE.format(allergies=allergies_str))
    
    # Dietary Preferences
    if user_prefs.get('dietary_preferences'):
        prefs_str = ", ".join(user_prefs['dietary_preferences'])
        context_parts.append(DIETARY_PREFERENCE_TEMPLATE.format(preferences=prefs_str))
    
    # Kitchen Equipment
    if user_prefs.get('kitchen_equipment'):
        equipment_str = ", ".join(user_prefs['kitchen_equipment'])
        context_parts.append(KITCHEN_EQUIPMENT_TEMPLATE.format(equipment=equipment_str))
    
    # Cooking Skill
    if user_prefs.get('cooking_skill'):
        skill = user_prefs['cooking_skill']
        difficulty_map = {
            'beginner': 'ง่ายมาก (Easy)',
            'intermediate': 'ปานกลาง (Medium)',
            'advanced': 'ยากมาก (Hard)'
        }
        difficulty = difficulty_map.get(skill, 'ไม่ทราบ')
        context_parts.append(COOKING_SKILL_TEMPLATE.format(
            skill=skill.capitalize(),
            difficulty=difficulty
        ))
    
    # Available Ingredients (optional note)
    if user_prefs.get('available_ingredients'):
        ingredients_str = ", ".join(user_prefs['available_ingredients'][:5])
        context_parts.append(f"🛒 **วัตถุดิบที่สำคัญที่มี:** {ingredients_str}")
    
    return "\n".join(context_parts)


def build_keyword_extraction_prompt(user_query: str) -> str:
    """
    สร้าง Prompt สำหรับแยก Keywords จากคำถาม
    
    Args:
        user_query: คำถามของผู้ใช้
    
    Returns:
        Prompt string สำหรับ keyword extraction
    """
    return KEYWORD_EXTRACTION_PROMPT.format(query=user_query)


# =================================
# 📊 GENERATION CONFIG
# =================================

GENERATION_CONFIG = {
    "temperature": 0.7,        # 0-1 (น้อย = ตอบเสมือน, มาก = สร้างสรรค์)
    "top_p": 0.9,             # Variety ของคำตอบ (0-1)
    "top_k": 40,              # Top-K sampling
    "max_output_tokens": 1500  # ความยาวของคำตอบ
}

# =================================
# 🧪 EXAMPLE USAGE
# =================================

"""
# ตัวอย่างการใช้งาน:

from app.config.prompts import build_chat_prompt, build_preference_context

# Build preference context
user_prefs = {
    'allergies': ['นม', 'ถั่วลิสง'],
    'dietary_preferences': ['vegetarian'],
    'cooking_skill': 'beginner',
    'kitchen_equipment': ['กระทะ', 'หม้อ'],
    'available_ingredients': ['ผักกาด', 'มะเขือเทศ']
}
prefs_context = build_preference_context(user_prefs)

# Build final prompt
final_prompt = build_chat_prompt(
    user_query="ทำแกงเขียวหวานได้ไหมถ้าไม่ใช้นม?",
    history_context="User: สวัสดี\nAI: สวัสดีครับ",
    rag_context="แกงเขียวหวาน: วัตถุดิบ... วิธีทำ...",
    user_prefs_context=prefs_context,
    thought_process=True
)

# Use with Gemini
response = model.generate_content(final_prompt)
"""
