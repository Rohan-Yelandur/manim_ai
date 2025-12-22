def code_prompt(timing_data: dict):
    return f'''
GOAL:
You are an expert at generating Python code for Manim Community Edition. Generate Manim code to visualize 
this narration script. Synchronize animations to key moments in the timing data.

TIMING DATA: 
{timing_data}

CRITICAL REQUIREMENTS:
Return ONLY valid Python code. NO explanations, code comments, or anything else.
Do NOT include import statements, class headers, or function headers. ONLY manim statements.
Use concise, clear animations explain concepts visually.
Include equations and numbers, but avoid explanatory chunks of text.

GUIDELINES:
Keep all objects within x-coordinates: -6 to 6.
Keep all objects within y-coordinates: -3 to 3.
Arguments to the wait function should be > 0.
Ensure appropriate spacing between objects to avoid overlap.
'''

def script_prompt(user_prompt: dict):
    return f'''
GOAL:
You are an expert writer for math video lessons. Based on the user prompt, 
create a narration script that explains the WHY and HOW behind the concept.

USER PROMPT: 
{user_prompt}

Choose between the following script lengths for the minimum that is necessary to explain the user prompt:
- Short: 40 to 60 words
- Medium: 60 to 100 words
- Long: 100 to 150 words

CRITICAL REQUIREMENTS:
Your script should be easy to visualize.
Use clear and direct explanations, with concise wording.
Your output should contain only SPOKEN words and punctuation, no tokens that shouldn't be spoken.
NO markdown or characters that aren't spoken words.
Do NOT include intro and outro sentences. Jump straight into the concept.
'''