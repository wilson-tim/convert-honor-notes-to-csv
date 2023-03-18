https://gist.github.com/spersico/19b92f2c37f01118c19f2ef9c113f0d7

import { writeFile, readdir, readFile } from 'node:fs/promises';
import path from 'path';
/*
Steps to get/export your notes from Huawei Notes:

1. Login into a Huawei Account in the phone.
2. Activate in your phone, the Notes Syncing, which is inside of Huawei Account > Cloud
3. Log in into https://cloud.huawei.com
4. Go to https://cloud.huawei.com/home#/account/gdpr, and click on Download Notes
5. This will give you a zip file with a password. Extract the zip file into a folder.
6. Copy this file into the folder as index.mjs
7. You'll need NodeJs installed for this: https://nodejs.org/en/
   I made and tested this on v18+, but v19 and v16 should also work
8. open a console/terminal (see how to do that in your OS), and run in it "node index.mjs"
9. Your notes should be in the notes.txt file inside of the same folder.

Extra:
The script only copies the text content, as simple text,
and it doesn't copy the title or other stuff that your notes might contain.
I left a comment in the portion of code that might be helpful to modify if
you want more information, such as the creation time, or other info.
*/

async function readNotes() {
  console.log(`📝 | Huawei Notes HTML -> TXT`);
  const __dirname = path.resolve(path.dirname(''));
  console.log(`📝 | > Reading Directory`, __dirname);
  const folders = [];

  const files = await readdir(__dirname, {
    withFileTypes: true,
  });
  files.forEach((file) => {
    if (file.isDirectory()) folders.push(file.name);
  });
  console.log(`📝 | > Notes found: `, folders.length);

  const notes = await Promise.all(
    folders.map(async (folder) => {
      const route = `${__dirname}/${folder}/json.js`;
      return readFile(route, 'utf8')
        .then((weirdJs) => {
          const noteData = JSON.parse(
            weirdJs.replace('var data = ', '')
          ).content;
          /*
          noteData has all the notes information, AFAICS.
          If you want to have more info, such as timestamps,
          this is the place to look into to add more info.
          I only needed the text content in my case
          */
          return noteData.content.split('|')[1].trim();
        })
        .catch((reason) => {
          console.error(`🐛 | > Error: `, route, reason);
          return '';
        });
    })
  );
  const cleanedUpNotes = notes.filter(Boolean);
  console.log(
    `📝 | > Total after removing empty or errored: `,
    cleanedUpNotes.length
  );

  await writeFile('notes.txt', cleanedUpNotes.join('\n'), 'utf8');
  console.log(`📝 | Notes succesfully exported into notes.txt file! 🎉`);
}

readNotes();

/* 
MIT License
Copyright © 2022 Santiago Persico

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/