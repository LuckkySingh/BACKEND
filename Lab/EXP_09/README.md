## Report for Exp9

# Experiment 9:

Programs using AJAX with HTML, XML and JSON data
Created a page that loads HTML, XML and JSON data without reloading the page
Used XMLHttpRequest and the fetch API
Parsed XML using responseXML and JSON using JSON.parse and response.json
Displayed the data in a table
Used ChatGPT to understand AJAX and solve problems

### Challenges:
AJAX requests do not work when the file is opened directly (file://)
Reading values from XML elements
Handling errors and the readyState / status values

### Solution:
Ran the page through a local server (VS Code Live Server / npx http-server) and used ChatGPT to understand the errors

### Today Outcome
Created the AJAX page successfully
HTML, XML and JSON data load correctly using buttons
Successfully linked the report file with the main README file
Tested all four buttons using a local server

### Files
- index.html (AJAX code)
- info.html (HTML data)
- data.xml (XML data)
- data.json (JSON data)

### How to run
Run a local server in this folder (npx http-server  or VS Code Live Server) and open index.html through it.
