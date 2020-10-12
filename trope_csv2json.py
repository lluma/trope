import pandas as pd
import json
import numpy as np

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)


df = pd.read_csv('src/Data/tropes3.csv')
output = {}
for idx, row in df.iterrows():
    print (row)
    index = row['index']
    trope = row.trope
    category_item_id = row.categroy_item_id
    category = row.category
    sub_category = row['sub-category']
    definition = row.definition

    output[trope] = {
        "index": int(index),
        "trope": trope,
        "category_item_id": int(category_item_id),
        "category": category,
        "sub_category": sub_category,
        "definition": definition
    }

ret = json.dumps(output, cls=NpEncoder)

with open('src/Data/tropes3.json', 'w') as fp:
    fp.write(ret)
