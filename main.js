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
const pageCreateAxios = async (text, date) => {
  const token = process.env.NOTION_TOKEN;
  const options = {
    method: 'POST',
    url: 'https://cors-anywhere.herokuapp.com/https://api.notion.com/v1/pages',
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
                content: `${date}`,
              },
            },
          ],
        },
        Status: {
          select : {
            name : "Live"
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
    }
  };
  const res = await axios.request(options);
  return res.data.id
}


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
      archived: false, 
      properties: {
        Status:{
          select:{
            name: "Archived"
          }
        }
      }
    })
  };
  const response = fetch(`https://api.notion.com/v1/pages/${id}`, options)
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


/* RETRIEVE DATA FROM (TABLE) DATABASE */
// Using javascript sdk 
const retrieveDatabaseID = async () => {
  arrayID = [];
  const dataID = process.env.DATABASE_ID_BOARD;
  const response = await notion.databases.query({ 
    database_id: dataID 
  });
  response.results.forEach(element => arrayID.push(element.id));
  return arrayID;
};

//retrieveDatabaseID().then(arr => arr.forEach((id) => console.log(id)));