import subprocess

subprocess.run(["dir", "-1"])

'''OLD CODE------------------------------------------------------------------------------------------
from gerrit import GerritClient
from collections import defaultdict
from datetime import datetime
import pandas as pd
import re
import sys

# Gerrit server details
GERRIT = GerritClient(base_url="https://gerrit.ericsson.se", username='elaneek', password='jV89zql4d3y1t6LgCyiMy8fVM/kR83d0L6OFxzm+dw')
QUERY = f"message:{sys.argv[1]}"
CHANGES = GERRIT.changes.search(query=QUERY)
print(CHANGES)
DELIMITER = ']'
SUBJECTS = defaultdict(list)  # To insert commits into list based on subject (key)

def extract_num_of_days(str):
      # Days since first commit logic
        updated_date_str = str
        if '.' in updated_date_str:
            updated_date_str = updated_date_str[:updated_date_str.index('.') + 7]  # Up to 6 digits after '.'

        updated_date = datetime.strptime(updated_date_str, "%Y-%m-%d %H:%M:%S.%f")

        current_date = datetime.now()
        number_of_days = (current_date - updated_date).days
        return number_of_days

def save_into_xlsx():
     # Save each dict entry of lists to xlsx files
    for idx, (key, value) in enumerate(SUBJECTS.items()):
        df = pd.DataFrame(value)

        # Clean and truncate subject to make a valid filename
        clean_title = re.sub(r'[\\/*?:|<>"]', '', key)  # Remove invalid characters
        clean_title = re.sub(r'[\[\]]', '', clean_title)  # Remove square brackets

        # Ensure unique filenames by appending an index
        file_name = f"{clean_title}_{idx}.xlsx"
        df.to_excel(file_name, index=False)
        print(f"Data has been saved to {file_name}")


'''
'''
def findCodeDifference(change_id):
    change = GERRIT.changes.get(change_id)
    files = change.list_files()

    for file_path, file_info in files.items():
        lines_inserted = file_info.get('lines_inserted', 0)
        lines_deleted = file_info.get('lines_deleted', 0)
        
        print(f"File: {file_path}")
        print(f"  Lines added: {lines_inserted}")
        print(f"  Lines removed: {lines_deleted}")
'''
'''
#Main
for change in CHANGES:
    subject = change.get("subject", "")
    if subject and subject.find(DELIMITER) != -1:
        result = subject[:subject.find(DELIMITER)+1]  # String slicing based on ']'

        SUBJECTS[result].append({
            "Subject": change.get("subject"),
            "Status": change.get("status"),
            "Owner": change.get("owner"),
            "Branch": change.get("branch"),
            "Project": change.get("project"),
            "Updated": change.get("updated"),
            "Days from 1st commit": extract_num_of_days(change.get("updated")), #Func for extracting # of days
            "x": "", 
            "1/x": "",
            #"Lines Inserted": findCodeDifference(change.get("change_id"))
        })

save_into_xlsx()
'''