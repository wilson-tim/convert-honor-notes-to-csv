import os
import json
import datetime
rootdir = './notes'

notes = ["created\tcontent"]
t = open("notes.csv", "w")

for dirpath, dirnames, filenames in os.walk(rootdir):
    for filename in filenames:
        if filename == "json.js":
            f = open(os.path.join(dirpath, filename), "r")
            data1 = f.read().rstrip().replace("var data = ", "")
            data2 = json.loads(data1)
            data3 = data2['content']
            epoch_time = data3['created']
            date_conv = datetime.datetime.fromtimestamp(epoch_time / 1000.0).strftime('%Y-%m-%d %H:%M:%S')
            note = date_conv + "\t" + "@CRLF@".join(data3['title'].splitlines())
            notes.append(note)
            
notesstr = '\n'.join(notes)
t.write(notesstr)
t.close()
