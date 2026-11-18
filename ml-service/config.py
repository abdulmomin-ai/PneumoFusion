import os
from dotenv import load_dotenv

load_dotenv()

# Yeh environment variable se uthayega, file ke andar koi secret key nahi hogi
GROQ_API_KEY = os.getenv("GROQ_API_KEY")