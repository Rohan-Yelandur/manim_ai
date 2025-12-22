from dotenv import load_dotenv
import os
import shutil
import subprocess
import base64
from manim import tempconfig
from google import genai
from google.genai import types
from elevenlabs.client import ElevenLabs
from textwrap import indent
from prompts import code_prompt, script_prompt
from configs import GEMINI_NARRATION_MODEL, GEMINI_MANIM_MODEL, ELEVENLABS_MODEL, ELEVENLABS_VOICE_ID

load_dotenv()
gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
elevenlabs_client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))

def generate_script(user_query:str) -> str:
    # Get narration script from Gemini
    try:
        response = gemini_client.models.generate_content (
            model=GEMINI_NARRATION_MODEL,
            contents=script_prompt(user_query)
        )
    except Exception as e:
        raise Exception(f'Gemini API call failed: {str(e)}')
    
    return response.text
    
def generate_audio(narration_script: str) -> dict:
    # Get audio from ElevenLabs
    try:
        response = elevenlabs_client.text_to_speech.convert_with_timestamps(
            voice_id=ELEVENLABS_VOICE_ID,
            model_id=ELEVENLABS_MODEL,
            text=narration_script,
            output_format="mp3_44100_128"
        )
    except Exception as e:
        raise Exception(f'ElevenLabs API call failed: {str(e)}')

    # 2. Save audio file
    os.makedirs('elevenlabs_audios', exist_ok=True)
    audio_bytes = base64.b64decode(response.audio_base_64)
    with open('elevenlabs_audios/audio.mp3', 'wb') as audio_file:
        audio_file.write(audio_bytes)

    # 3. Convert character-level timings to word-level timings
    alignment = response.alignment
    characters = alignment.characters
    start_times = alignment.character_start_times_seconds
    timing_dict = {}
    current_word = ''
    word_start = None
    for char, start_time in zip(characters, start_times):
        if char.isspace():
            if current_word:
                timing_dict[current_word] = word_start
                current_word = ''
                word_start = None
        else:
            if word_start is None:
                word_start = start_time
            current_word += char
    if current_word:
        timing_dict[current_word] = word_start

    return timing_dict

def generate_manim_video(timing_data: str) -> str:
    # Get manim code from Gemini
    try:
        response = gemini_client.models.generate_content (
            model=GEMINI_MANIM_MODEL,
            contents=code_prompt(timing_data)
        )
        code = response.text.replace('```python\n', '').replace('\n```', '')
    except Exception as e:
        raise Exception(f'Gemini API call failed: {str(e)}')

    # Execute manim code and render the video
    try:
        exec_globals = {}
        full_code = f'''
from manim import *
class ManimScene(Scene):
    def construct(self):
{indent(code, '        ')}
        '''
        exec(full_code, exec_globals)
        with tempconfig({
            'quality': 'low_quality',
            'frame_rate': 10,
            'media_dir': 'manim_videos',
            'verbosity': 'ERROR',
            'flush_cache': True
        }):
            scene = exec_globals.get('ManimScene')()
            scene.render()
            manim_video_path = scene.renderer.file_writer.movie_file_path
    except Exception as e:
        raise Exception(f'Rendering the Manim video failed')
        
    return manim_video_path

def stitch_video_and_audio(video_path : str) -> str:
    os.makedirs('final_videos', exist_ok=True)
    result = subprocess.run([
        'ffmpeg',
        '-i', f'{video_path}',
        '-i', 'elevenlabs_audios/audio.mp3',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-strict', 'experimental',
        '-y',
        'final_videos/final_video.mp4'
    ], capture_output=True, text=True)
    
    if result.returncode != 0:
        raise Exception(f'FFmpeg failed: {result.stderr}')
    
    return 'final_videos/final_video.mp4'