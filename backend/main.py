from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from generation import generate_manim_video, generate_script, generate_audio, stitch_video_and_audio

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

@app.post('/create-video')
def create_video(request: CreateVideo):
    script = generate_script(request.query)
    timing_data = generate_audio(script)
    manim_video_path = generate_manim_video(timing_data)
    final_video_path = stitch_video_and_audio(manim_video_path)
    file_response = FileResponse(path=final_video_path, media_type='video/mp4', filename='video.mp4')
    return file_response