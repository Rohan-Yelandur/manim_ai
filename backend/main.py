from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from generation import generate_manim_video

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class CreateVideo(BaseModel):
    query: str

# ---------- API Endpoints ----------

@app.post('/create-video')
def create_video(request: CreateVideo):
    video_path = generate_manim_video(request.query)
    return FileResponse(path=video_path, media_type='video/mp4', filename='video.mp4')