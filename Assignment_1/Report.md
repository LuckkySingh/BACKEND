## Report for Web Storage Notes App

## Experiment :
Design a Notes & Todo webpage using HTML, CSS, and JavaScript that saves, edits, and deletes notes using browser localStorage so that data persists across page refreshes. Created one file for webpage as index file.

## Challenges:
Understanding how to use localStorage and JSON.stringify / JSON.parse to store note objects
Updating existing notes and keeping timestamps preserved
Persisting and loading data automatically when the page opens

## Solution:
Used the lecture guide to understand localStorage methods (setItem, getItem, removeItem)
Used JSON methods to convert note objects to string before storing

## Today Outcome:
Created the Notes App HTML webpage successfully that saves notes in localStorage
Added features to add, edit, delete, and mark notes as completed
Tested the webpage and checked that the notes persist after refreshing the browser

## Verification and Testing:
Adding Notes: Entered note text and verified it appears immediately in the list.
Persistence Check: Refreshed the page (F5) and confirmed all notes were still present.
Edit & Delete: Successfully edited note text and deleted notes, verifying updates stayed saved in localStorage.
DevTools Check: Opened DevTools (F12) 
→ Application 
→ Local Storage and verified the "notes" key with JSON data.
