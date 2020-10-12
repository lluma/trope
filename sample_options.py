import json
import numpy as np
import pandas as pd

doc = pd.read_csv('src/Data/tropes3.csv')
tropes = doc.trope.unique()

with open('src/Data/tropes4amt.json', 'r') as f:
    data = json.loads(f.read())
    f.close()

sample_result = {}

def checkDuplicate(list):
    return len(list) == len(set(list))

for corpus in data:

    max_num_sampled_pos = min(len(data[corpus]), 5)
    positives = np.random.choice(data[corpus], max_num_sampled_pos, replace=False)
    remains = list(set(tropes.tolist()) - set(positives.tolist()))
    max_num_sampled_neg = 10 - max_num_sampled_pos
    negatives = np.random.choice(remains, max_num_sampled_neg, replace=False)

    if not checkDuplicate(positives) or not checkDuplicate(negatives):
        print ('Wrong sampling ...')
        exit(0)
    sample_result[corpus] = np.concatenate((positives, negatives), axis=0).tolist()

print (sample_result)
with open('src/Data/tropes4amt_sampled.json', 'w') as f:
    f.write(json.dumps(sample_result))
    f.close()