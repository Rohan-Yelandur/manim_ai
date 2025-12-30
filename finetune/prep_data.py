import pandas as pd
import json
from itertools import islice

# df = pd.read_csv("hf://datasets/Edoh/manim_python/train.csv")
# df.to_json("edoh_data.jsonl", orient="records", lines=True)
# NEED TO FIX THIS DATASET


def check_errors(start, end):
    with open("edoh_data.jsonl", "r") as file:
        specific_lines = list(islice(file, start, end + 1))
        for i in range(len(specific_lines)):
            output = json.loads(specific_lines[i])["output"]
            try:
                compile(output, "<string>", "exec")
            except:
                print(f"Line {i + start}: {output}")

check_errors(0, 100)