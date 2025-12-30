*** System Diagram ***

user query -> cheap gemini call -> script -> elevenlabs -> timestamps -> expensive gemini call ->
manim code -> ffmpeg -> video -> returned to user

Two gemini api calls, first to generate script, second for code.
First uses cheap model, second uses paid model.
Sync audio to animations via word-level timestamps.


*** Tech Stack ***

FastAPI (ASGI) over Flask (WSGI)

Auth w/ Json Web tokens for session management. Email and password, not OAuth.
Magic links in email.

PostgreSQL database.
S3 for video storage.


*** Prompting ***

Positive prompting is better than negative (What to DO instead of what NOT to do). 
Use few-shot prompting with input output pairs.


*** Fine-tuning ***