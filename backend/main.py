from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
app = FastAPI()

# Enable CORS for the locally hosted frontend website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- API Endpoints ----------

@app.get('/')
def get_root():
    return {'message': 'Yo you found the root'}


class CreateVideo(BaseModel):
    query: str

@app.post('/create-video')
async def gemini_request(request: CreateVideo):
    response = gemini_client.models.generate_content (
        model="gemini-2.5-flash",
        contents=request.query,
    )
    return {'response': response.text}