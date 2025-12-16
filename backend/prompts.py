code_prompt = '''
Generate manim python code to create a video lesson answering the user's prompt.
Your response should contain nothing except for correct python code.
Do not include any comments in the python code.
Your script's layout should match the following imports, class names, and function name exactly:
from manim import *
class ManimScene(Scene):
def construct(self):
<your code here>
'''

script_prompt = '''

'''