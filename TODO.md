*** Fine-tuning ***
Create input (specfic request, general question) and output (code) pairs.
Gather data from hugging face.
Generate synthetic data.
JsonL format

QLoRa on UnSloth. Track training_loss and visualize with MatPlotLib.


*** Fix video component too small in chat page ***
*** Changeable voices ***

*** Backend_Plan.md ***
Security check against prompt injection.
Check manim code for malicious code.
Run exec() in a sandbox.
Create a jobID to synch narration scripts, audios, and videos to create the final video.
Create a background job queue.
Cleanup garbage on disk.

Multithreading for FFMPEG, database video uploads, elevenlabs audio chunk writing to disk.

*** RAG ***
Create knowledge base for Manim CE.
First gemini call gathers animation ideas (graphs, number line, etc)
Prove second gemini call with relevant code to prevent hallucination.

Send API Call back to expensive manim model if code has errors.

*** Generate quiz quesitons ***
Show desmos stuff if math question.
Show code visualizer if coding question.


*** Hash prompts that were exactly used to return videos fast ***
Any saved video is worth returning to another user.
Allow for still generating your own video.