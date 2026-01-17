*** Use vector embeddings to return videos for prompts already asked ***
Fill in prompts for videos already generated in supabase.

*** Only allow video generating after logging in ***
Atmost 1 video generation without paying.
Only users I allow can actually generate videos. 
Zelle me to get access to pro.

*** Fine-tuning ***
Create input (specfic request, general question) and output (code) pairs.
Gather data from hugging face.
Generate synthetic data.
JsonL format

QLoRa on UnSloth. Track training_loss and visualize with MatPlotLib.
Create a link to hugging face with Lora Assets ( just steal a model).


*** Backend_Plan.md ***
Security check against prompt injection.
Check manim code for malicious code.
Run exec() in a sandbox.
Create a jobID to synch narration scripts, audios, and videos to create the final video.
Create a background job queue.
Cleanup garbage on disk.
Multithreading for FFMPEG, database video uploads, elevenlabs audio chunk writing to disk.
Send API Call back to expensive manim model if code has errors.

*** RAG ***
Create knowledge base for Manim CE.
First gemini call gathers animation ideas (graphs, number line, etc)
Prove second gemini call with relevant code to prevent hallucination.