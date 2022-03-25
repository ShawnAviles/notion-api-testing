// Shawn Aviles
// Notion API function testing
// Note: testing functions to incorporate into personal project
const { Client } = require("@notionhq/client");
const fetch = require('node-fetch');
//require('dotenv').config();

// Initializing CLient
const notion = new Client({ auth: process.env.NOTION_TOKEN });

/* ADD PAGE TO TABLE DATABASE */
// ;(async () => {
//     const response = await notion.pages.create({
//       parent: {
//         database_id: process.env.DATABASE_ID,
//       },
//       properties: {
//         'Grocery item': {
//           type: 'title',
//           title: [
//             {
//               type: 'text',
//               text: {
//                 content: 'Milk',
//               },
//             },
//           ],
//         },
//         Ran: {
//           number: 6.99,
//         },
//         status : {
//           select : {
//             name : "Current"
//           }
//         },
//         Price: {
//           number: 4.99,
//         },
//         'Last ordered': {
//           date: {
//             start: '2022-03-12',
//           },
//         },
//       },
//     });
//     console.log(response);
//   })();

/* JAVASCIPRT NOTION SDK TOOLS */
const pageCreate = async () => {
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
              content: 'Creating Page Test Title',
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
                content: 'this is a test for a New Card. Hopefully this works'
              },
            },
          ],
        },
      },
    ],
  });
  return response.id;
};

const updatePage = async (id) => {
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


/* JAVASCRIPT FETCH LIBRARY */
const uppatePageFetch = async (id) => {
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

wait()
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));