# Extract Honor 9 Lite notes export files to CSV

## Method 

I am following the method described here:
https://gist.github.com/spersico/19b92f2c37f01118c19f2ef9c113f0d7
see file `index.mjs`.

Notes are exported as a ZIP file of subdirectories, one per note,
each containing a nested JSON file named `json.js`, example file
included in this repository.

Creating a tab delimited output file with two columns "Created" and "Content".

In the Content column original line breaks are replaced with the placeholder
"@CRLF".
