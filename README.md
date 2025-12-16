# MathVision

Generate animated and narrated AI videos lessons for any math topic.

## Run App Locally

### Frontend
1. ```cd frontend```

2. ```npm install```

3. ```npm start```

### Backend
1. ```cd backend```

2. ```pip install -r requirements.txt```

3. Create a .env file with the following variables:
```
GEMINI_API_KEY=<Your key here>
ELEVENLABS_API_KEY=<Your key here>
```
Get your own api keys here: [Google Gemini](https://aistudio.google.com/api-keys), [ElevenLabs](https://elevenlabs.io/)

4. ```uvicorn main:app```