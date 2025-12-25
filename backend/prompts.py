def code_prompt(timing_data: dict):
    return f'''
ROLE:
You are an expert Python developer specializing in Manim Community Edition animations.

TASK:
Generate Manim animation code that visually explains the narration script and is 
precisely synchronized to the provided timing data. 
If any of the explanation if wrong, fix animate the correct explanation.

TIMING DATA: 
{timing_data}

OUTPUT REQUIREMENTS (CRITICAL):
- Output ONLY valid Python Manim statements.
- Do NOT include any English sentences, comments, explanations, or instructional text.
- Do NOT include imports, class definitions, function definitions, comments, markdown, or explanations.
- The code must be directly executable inside an existing Manim Scene's construct() method.
- The code must run without syntax, type, or runtime errors.

ANIMATION REQUIREMENTS:
- Synchronize animations to the timing data using run_time and wait().
- All wait() durations MUST be strictly greater than 0.
- The total animation duration must match the total audio duration implied by the timing data.
- Use equations, symbols, shapes, and spatial transformations to explain concepts visually.
- Avoid large blocks of explanatory text.
- Use FadeIn/FadeOut for all manim objects and animations. Do not use Write or Create.
- Only use these Manim classes for objects: 
Text, MathTex, Circle, Square, Rectangle, Polygon, Ellipse, Triangle, Line, Arrow, Dot,
NumberLine, Axes, ThreeDAxes, ParametricFunction, NumberPlane, Graph, IntegerMatrix, 
Cube, Sphere, Cone, Cylinder, Prism, Surface.
- Only use these Manim classes for movement:
MoveToTarget, ValueTracker, Transform.
- Apply visual properties (color, width, height, etc.) only to objects in the allowed list above.
- Do NOT use VGroup or generic Mobject.
- Animate charts, graphs, and objects dynamically where possible: moving points, updating lines, transforming shapes, highlighting key elements.
- Ensure all transformations and animations respect the timing data for synchronization with narration.
- Control visual order only by creation order or Group ordering. Do NOT use z_index or any layering attributes on any object.

LAYOUT CONSTRAINTS:
- Keep all objects within x ∈ [-6, 6] and y ∈ [-3, 3].
- Ensure sufficient spacing to avoid overlapping objects.
- Remove objects from the scene once they are no longer relevant.

MANIM SAFETY RULES (MANDATORY):
- Always use Group for grouping objects; NEVER use VGroup.
- Only animate objects that have already been created.
- Do not use negative or zero wait times.

STYLE:
- Animations should be concise, readable, and demonstrate ideas CONCEPTUALLY.
- Prefer simple shapes and clear motion over visual clutter.

If any requirement cannot be satisfied, produce the closest valid Manim code that still runs without errors.
'''
# error found: AttributeError: 'DotCloud' object has no attribute 'z_index

def script_prompt(user_prompt: dict):
    return f'''
ROLE:
You are an expert writer for short, precise math video narrations designed to be animated visually.

TASK:
Write a spoken narration that explains the mathematical concept clearly and step-by-step,
with wording that is easy to synchronize to diagrams, animations, and graphs.

USER PROMPT:
{user_prompt}

OUTPUT REQUIREMENTS (CRITICAL):
- Output ONLY spoken narration text.
- Use only words, numbers, and normal punctuation that would be spoken aloud.
- Do NOT include markdown, bullet points, labels, section titles, or special symbols.
- Do NOT include introductions, conclusions, or meta commentary.
- Start directly with the explanation of the concept.
- MAXIMUM LENGTH: 150 words.

SCRIPT DESIGN REQUIREMENTS:
- Prefer short, clear sentences.
- Explain ideas in a natural visual order from simple to complex.
- Introduce one idea at a time.
- Avoid abstract phrasing that is difficult to visualize.
- Describe relationships, motion, comparison, or transformation whenever possible.
- Avoid referencing diagrams explicitly; let the visuals follow the narration naturally.
- If a word is a letter, sound it out rather than just writing the letter (EX: "TEE" instead of "T", "ES" instead of "S")

STYLE:
- Clear, calm, instructional tone.
- Precise mathematical language.
'''
# Detect if query is within scope
# When adding various voices, change their tones and styles in the prompt.