# Notion API Testing
I decided to play around with the **Notion API** and created some functions that I could use in a React project later. I am regularly updating this repo as I continue implementing the API in my other project. This is my first time using an API for a personal project so feel free to let me know if I can do something better.

## Functions
- create a page
- update properties of a page (delete a page)
- retrieve all page IDs from a database
- retrieve titles from all pages in a datebase
- retrieve simple rich text from a page
- create a list of javascript objects from the retrieved information

## Libraries Used
- Official Notion Javascript SDK
- Fetch
- Axios

Axios was the library I decided to mainly use for API requests my project.

### Issues found:
I experienced an issue using the Offical Notion Javascript Client when making make a PATCH request. The API Request would be too large when sent on a localhost development server. However, it was successful when being sent from this test environment. Using Axios or Fetch allows the request to be sent. For information is commented in _main.js_ under _**API ISSUE USING JS SDK #1**_.
