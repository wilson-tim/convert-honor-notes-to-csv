import csv
import os
import json
import datetime

def write_to_csv(csvfile, list_input):

	try:
		with open(csvfile, "a", newline='') as fopen:
			csv_writer = csv.writer(fopen, quoting=csv.QUOTE_ALL)
			csv_writer.writerow(list_input)

	except:
		return False

def extract(sourcefile, csvfile):

	try:
		for dirpath, dirnames, filenames in os.walk(rootdir):
			for filename in filenames:
				if filename == "json.js":
					f = open(os.path.join(dirpath, filename), "r")
					data1 = f.read().rstrip().replace("var data = ", "")
					data2 = json.loads(data1)
					data3 = data2['content']
					epoch_time = data3['created']
					date_conv = datetime.datetime.fromtimestamp(epoch_time / 1000.0).strftime('%Y-%m-%d %H:%M:%S')
					note = [date_conv, " | ".join(data3['title'].splitlines())]
					write_to_csv(csvfile, note)
            
		return True

	except Exception as e:
		return e

if __name__ == "__main__":
	rootdir = './notes'
	csvfile = "notes.csv"
	file_to_delete = open(csvfile, "w")
	file_to_delete.close()
	header = ["created", "content"]
	write_to_csv(csvfile, header)
	result = extract(rootdir, csvfile)
	if result == True:
		print("All done")
	else:
		print(f"Something went wrong - {result}")
