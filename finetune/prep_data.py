import pandas as pd
import json
from itertools import islice

def download_smail():
    df = pd.read_parquet("hf://datasets/Smail/bespoke-manim-preprocessed/data/train-00000-of-00001.parquet")

    # Keep only the question
    regex_pattern = r"Question:\s+(.*?)\n\nTitle:"
    df['instruction'] = df['instruction'].str.extract(regex_pattern, expand=False)

    df.to_json("smail2_data.jsonl", orient="records", lines=True)

def download_thanhkt():
    df = pd.read_parquet("hf://datasets/thanhkt/manim_code/data/train-00000-of-00001.parquet")
    df.to_json("thanhkt_data.jsonl", orient="records", lines=True)

def check_errors(start, end, jsonl_file):
    found_errors = False

    with open(jsonl_file, "r") as file:
        specific_lines = list(islice(file, start, end + 1))
        for i in range(len(specific_lines)):
            output = json.loads(specific_lines[i])["output"]
            try:
                compile(output, "<string>", "exec")
            except:
                print(f"Line {i + start}: {output}")
                found_errors = True
    
    if not found_errors:
        print("No errors found!")

check_errors(0, 10, "thanhkt_data.jsonl")

download_thanhkt()