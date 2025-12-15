# Create api endpoints

Problem: right now calling generate_content with gemini is blocking which will cause problems if multiple users are on my app.

Need to somehow multithread the various api calls.

Polling vs interrupts?