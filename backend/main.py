from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google import genai
from google.genai import types
from elevenlabs.client import ElevenLabs
from elevenlabs import play
from dotenv import load_dotenv
import os
from prompts import code_prompt


# Initialization
load_dotenv()
gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
elevenlabs_client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))
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

# Pydantic model
class CreateVideo(BaseModel):
    query: str

def generate_manim_code(query: str):
    response = gemini_client.models.generate_content (
        model='gemini-2.5-flash-lite',
        config=types.GenerateContentConfig(
            system_instruction=code_prompt
        ),
        contents=query
    )
    return response.text

def write_code_to_file(code: str):
    code = code.replace('```python\n', '').replace('\n```', '')
    os.makedirs('manim_files/scripts/', exist_ok=True)
    with open('manim_files/scripts/manim_scene.py', 'w') as file:
        file.write(code)

@app.post('/create-video')
def create_video(request: CreateVideo):
    code = generate_manim_code(request.query)
    write_code_to_file(code)

    script_path = 'manim_files/scripts/manim_scene.py'
    output_path = 'manim_files'
    command = f'manim -ql {script_path} ManimScene --media_dir {output_path}'
    os.system(command)

    return FileResponse(
        path=f'{output_path}/videos/manim_scene/480p15/ManimScene.mp4',
        media_type='video/mp4',
        filename='video.mp4'
    )