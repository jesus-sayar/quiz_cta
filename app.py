#!flask/bin/python
import re
import json
import traceback
import random
import os

from flask import Flask
from flask import jsonify
from flask_cors import CORS

NUM_QUERIES = 10
CHARACTERS_LONG_QUERY=550

app = Flask(__name__)
CORS(app)

def make_json():
  json_quiz = {"quiz":[]}
  all_queries = []
  files = os.listdir("./data")
  files = [f for f in files if f.endswith(".txt")]
  for file_name in files:
    file = open("./data/"+file_name, "r")
    file_data = file.read()
    list = file_data.split("\n\n")
    for query_raw in list:
      query = make_query(query_raw)
      all_queries.append(query)

  
  json_quiz["quiz"] = select_random(all_queries)
  
  return json_quiz

def make_query(query_raw):
  query = {}

  try:
    # PREGUNTA
    question = re.search("^\d+-.*", query_raw)
    if question:
      question = question.group(0)
    else:
      question = re.search("^.*", query_raw).group(0)
    
    query["question"] = question

    # RESPUESTAS
    answers = {}
    pattern = re.compile(r"[A-D]-.*")
    for answer_raw in re.findall(pattern, query_raw):
      letter = re.search("^[A-D]", answer_raw).group(0)
      answer = re.split("^[A-D]-", answer_raw)[1]
      answers[letter] = answer
    query["answers"] = answers

    # SOLUCION
    solution_raw = re.search("R->.*", query_raw).group(0)
    solution = re.search("[A-D]", solution_raw).group(0)
    query["solution"] = solution

    # EXPLICACION
    reason_raw = re.search("E->.*", query_raw)
    if reason_raw:
      reason=reason_raw.group(0)
      query["reason"] = reason[4:]
    
    # DURACION
    if len(question+json.dumps(answers))>=CHARACTERS_LONG_QUERY:
      query["duration"] = 60 #segs
    else:
      query["duration"] = 30 #segs
  except Exception:
    print("Error in question: \n" + query_raw)
    print(traceback.format_exc())

  return query      

def select_random(queries):
  random_queries = []
  for x in range(NUM_QUERIES):
    query = random.choice(queries)
    random_queries.append(query);
  return random_queries;

@app.route('/')
def index():
  json = make_json()
  return jsonify(json)

if __name__ == '__main__':
  app.run(debug=True)