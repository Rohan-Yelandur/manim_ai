Goal
Optimize the backend for video generation by handling requests asynchronously and securing the Manim code execution.

User Review Required
IMPORTANT

Docker Requirement: The sandboxing solution relies on Docker. Please ensure Docker Desktop is installed and running on your machine. Redis Requirement: This solution requires a Redis instance to act as the message broker. You will need to have Redis installed or run it via Docker.

Proposed Changes
Configuration
[MODIFY] 
requirements.txt
Add celery and redis.
Add docker (python client) if we choose to use the library, or just use subprocess for CLI.
Infrastructure
[NEW] 
Dockerfile
Create a Docker image that contains Manim and necessary dependencies to run the generated code.
This will be used to spawn ephemeral containers for rendering.
[NEW] 
docker-compose.yml
Define services: web (FastAPI), worker (Celery), redis (Broker).
Backend Logic
[NEW] 
celery_app.py
Configure Celery instance.
[NEW] 
tasks.py
Move the heavy lifting from 
main.py
 and 
generation.py
 into a Celery task create_video_task.
[MODIFY] 
generation.py
Concurrency Fix: Update all functions to accept a unique_id or task_id.
Use this ID to create unique subdirectories for artifacts (e.g., temp/{task_id}/audio.mp3, temp/{task_id}/video.mp4).
Security Fix: Remove exec().
Refactor 
generate_manim_video
 to:
Write the generated code to a temporary file in the unique directory.
Spin up a Docker container mounting this unique directory.
Run Manim inside the container.
Retrieve the output video.
Ensure file paths are handled correctly between host and container.
[MODIFY] 
main.py
Change /create-video Endpoint:
Trigger create_video_task.delay().
Return a task_id immediately.
Add /status/{task_id} Endpoint:
Check the status of the Celery task (PENDING, STARTED, SUCCESS, FAILURE).
If SUCCESS, provide a download link or path (serve static files).