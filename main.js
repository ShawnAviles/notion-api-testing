// Notion API function testing
// Note: testing functions to incorporate into personal project
const { Client } = require("@notionhq/client");
require('dotenv').config();

// only needed for making API requests using Axios
const axios = require('axios');

// only needed when using javascript sdk tools 
const notion = new Client({ auth: process.env.NOTION_TOKEN });

/* ADD PAGE TO (TABLE) DATABASE */
// Using javascript SDK tools to create POST Request
const pageCreateSDK = async (text, date) => {
  const response = await notion.pages.create({
    parent: {
      database_id: process.env.DATABASE_ID_BOARD,
    },
    properties: {
      'Name': {
        title: [
          {
            type: 'text',
            text: {
              content: `${date}`,
            },
          },
        ],
      },
      Status: {
        select : {
          name : "Live"
          //name : "Archived"
        }
      },
    },
    children : [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${text}`
              },
            },
          ],
        },
      },
    ],
  });
  return response.id;
};

// Using Axios to create POST Request
const pageCreateAxios = async (header, text, date) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'POST',
    url: 'https://api.notion.com/v1/pages', // prepended with https://cors-anywhere.herokuapp.com/ as a proxy in dev env
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      'Content-Type': 'application/json'
    },
    data: {
      parent: {
        database_id: process.env.DATABASE_ID_BOARD,
      },
      properties: {
        'Name': {
          title: [
            {
              type: 'text',
              text: {
                content: `${header}`,
              },
            },
          ],
        },
        'Status': {
          select : {
            name : "Live"
          }
        },
        'Created': {
          date: {
            start: `${date}`,
            //time_zone: 'America/New_York'
          }
        }
      },
      children : [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${text}`
                },
              },
            ],
          },
        },
      ],
    }
  };
  const response = await axios.request(options);
  return response.data.id;
}

/** Testing Method 1
 *  Date String has to be ISO 8601 format
 *  Saves as a UTC Time zone
 *  Todo - Fix the time zone the date is saved in
 */
// const date = new Date();
// pageCreateAxios('Test Axios Header', 'I hope the date saves', date.toISOString()).catch(err => console.log(err))

/* UPDATE PAGE TO (TABLE) DATABASE */
// Using built-in fetch to make PATCH request
const updatePageFetch = async (id) => {
  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      archived: true, 
    })
  };
  const response = fetch(`https://api.notion.com/v1/pages/${id}`, options) // prepended with https://cors-anywhere.herokuapp.com/ as a proxy in dev env
  console.log(response);
}

/* 
API ISSUE USING JS SDK #1 - 
  This was an attempted use of Javascript SDK for Updating a Page (PATCH)
  Problem - API Request would be too large when sent on a localhost development server when updating a select property.
    However, it was successful when being sent from this test file. Hopefully, by the end of this project I'll understand this better.
    400 error
  Solution - Above, I used the Fetch API library to make the PATCH request instead
    The request was signicantly smaller in size from 2.4KB (using the sdk) to 460B (using fetch) allowing it to be sent
*/
const updatePageSDK = async (id) => {
  const pageID = id;
  const updateResponse = await notion.pages.update({
    page_id: pageID,
    properties: {
      Status: {
        select: {
          name: "Archived"
        }
      }
    }
  });
  console.log(updateResponse);
};

// update page using axios
const updatePageAxios = async (id) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'PATCH',
    url: `https://api.notion.com/v1/pages/${id}`,
    headers: { 
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
    },
    data: {archived: true}
  };
  await axios.request(options)
}


/* QUERYING DATA FROM (TABLE) DATABASE */
// Using javascript sdk 
const retrieveDatabaseIDSDK = async () => {
  let arrayID = [];
  const dataID = process.env.DATABASE_ID_BOARD;
  const response = await notion.databases.query({ 
    database_id: dataID 
  });
  response.results.forEach(element => arrayID.push(element.id));
  return arrayID;
};

//retrieveDatabaseID().then(arr => arr.forEach((id) => console.log(id)));

// Using axios
const retrieveDatabaseIDAxios = async (id) => {
  const token = process.env.NOTION_TOKEN;
  let arrayID = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`
    },
    data: {page_size: 100}
  };
  const response = await axios.request(options)
  response.data.results.forEach(element => arrayID.push(element.id));
  return arrayID;
}
//retrieveDatabaseIDAxios(process.env.DATABASE_ID_BOARD).then(array => array.forEach((element => console.log(element))))

const retrieveTitlesAxios = async (id) => {
  const token = process.env.NOTION_TOKEN;
  let arrayTitles = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`
    },
    data: {page_size: 100}
  };
  const response = await axios.request(options)
  response.data.results.forEach(element => arrayTitles.push(element.properties.Name.title[0].plain_text));
  return arrayTitles;
}
//retrieveTitlesAxios(process.env.DATABASE_ID_BOARD).then(arr => arr.forEach(el => console.log(el)))

const retrieveDatesAxios = async (id) => {
  const token = process.env.NOTION_TOKEN;
  let arrayDates = [];
  const options = {
    method: 'POST',
    url: `https://api.notion.com/v1/databases/${id}/query`,
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`
    },
  };
  const response = await axios.request(options)
  response.data.results.forEach(element => arrayDates.push(element.properties.Created.date.start));
  return arrayDates;
}
//retrieveDatesAxios(process.env.DATABASE_ID_BOARD).then((arr) => arr.forEach(el => console.log(el))).catch(err => console.log(err))

/* QUERYING DATA FROM BLOCK */
// A page is a block and I need to retrieve the text inside which are the children
const retrieveBlockAxios = async (id) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'GET',
    url: `https://api.notion.com/v1/blocks/${id}/children`,
    params: {page_size: '100'},
    headers: {
      Accept: 'application/json',
      'Notion-Version': '2022-02-22',
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.request(options)
  return response.data.results[0].paragraph.rich_text[0].plain_text
}
//retrieveBlockAxios('0d93ec11-f916-4fd6-95f4-c0efd77ebce1')

const createNoteListObject = async (databaseID) => {
  let listObjects = []
  const arrayID = await retrieveDatabaseIDAxios(databaseID)
  const arrayTitles = await retrieveTitlesAxios(databaseID)
  const arrayDates = await retrieveDatesAxios(databaseID)
  for (let i = 0; i < arrayID.length; i++) {
    let note = {
      id: '',
      header: '',
      text: '',
      date: '',
    }
    note.id = arrayID[i]
    const blockText = await retrieveBlockAxios(arrayID[i])
    note.header = arrayTitles[i]
    note.text = blockText
    const localDate = new Date(arrayDates[i])
    note.date = localDate.toLocaleString()
    listObjects.push(note)
  }
  return listObjects
}

createNoteListObject(process.env.DATABASE_ID_BOARD).then(res => console.log(res))


