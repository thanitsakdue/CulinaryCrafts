import google.generativeai as genai

genai.configure(api_key="AIzaSyCL3OiyV7ACfk0SjGTjHurDdetaUp6vTkQ")

for m in genai.list_models():
    if "embedContent" in m.supported_generation_methods:
        print(m.name)