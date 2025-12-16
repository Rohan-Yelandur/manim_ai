from dotenv import load_dotenv
import os
import shutil
from manim import tempconfig
from google import genai
from google.genai import types
from elevenlabs.client import ElevenLabs
from prompts import code_prompt
from configs import gemini_manim_model

load_dotenv()
gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
elevenlabs_client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))

def generate_manim_video(query: str, system_prompt:str=code_prompt, gemini_model:str=gemini_manim_model) -> str:
    # Get manim code from Gemini
    try:
        response = gemini_client.models.generate_content (
            model=gemini_manim_model,
            config=types.GenerateContentConfig(system_instruction=system_prompt),
            contents=query
        )
        code = response.text.replace('```python\n', '').replace('\n```', '')
    except Exception as e:
        raise Exception(f'Gemini API call failed: {str(e)}')

    # Execute manim code and render the video
    try:
        exec_globals = {}
        exec('from manim import *\n' + code, exec_globals)
        with tempconfig({
            'quality': 'low_quality',
            'frame_rate': 10,
            'media_dir': 'manim_videos',
            'verbosity': 'ERROR',
            'flush_cache': True
        }):
            scene = exec_globals.get('ManimScene')()
            scene.render()
            original_video_path = scene.renderer.file_writer.movie_file_path
    except Exception as e:
        raise Exception(f'Rendering the Manim video failed')
    
    # Rearrange file structure and clean up
    final_video_path = 'manim_videos/ManimScene.mp4'
    shutil.move(original_video_path, final_video_path)
    shutil.rmtree('manim_videos/videos', ignore_errors=True)
    shutil.rmtree('manim_videos/images', ignore_errors=True)
        
    return final_video_path