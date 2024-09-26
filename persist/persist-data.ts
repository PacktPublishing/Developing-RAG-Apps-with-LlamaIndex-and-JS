/** @format */

import fs from 'fs/promises'; // Importing the file system module for reading files
import dotenv from 'dotenv'; // Importing dotenv for loading environment variables

// Load environment variables from .env file
dotenv.config();

// Import necessary classes and functions from LlamaIndex
import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
  RouterQueryEngine,
  storageContextFromDefaults,
  ContextChatEngine,
} from 'llamaindex';

async function main() {
  //   // setup storage context
  //   const storageContext = await storageContextFromDefaults({
  //     persistDir: './storage',
  //   });
  //   //   // Load the data and create an index
  //   const documents = await new SimpleDirectoryReader().loadData({
  //     directoryPath: './data', //berkshire hathaway
  //   });

  //   let index = await VectorStoreIndex.fromDocuments(documents, {
  //     storageContext,
  //   });

  //   //   // Create a query engine
  //   let queryEngine = index.asQueryEngine();
  //   let response = await queryEngine.query({
  //     query: 'What are the main points of the document in 2 sentences?',
  //   });
  //   // the first time we the storage context is created, it will be empty
  //   console.log(response.toString());

  // Next, we will create a new storage context and load the index without parsing the documents again
  //Get an index without parsing the documents again
  let storageContext2 = await storageContextFromDefaults({
    persistDir: './storage',
  });

  // Load the index without parsing the documents again
  let index2 = await VectorStoreIndex.init({
    storageContext: storageContext2,
  });

  let engine2 = index2.asQueryEngine();
  let response2 = await engine2.query({
    query: 'When did Munger passed away, and how did Buffet feel about it?',
  });
  //   console.log(response2.toString());

  // Next we will chat with our data and allowing the user to ask questions and follow up questions
  // Create a retriever
  const retriever = index2.asRetriever();

  let chatEngine = new ContextChatEngine({
    retriever,
  });

  let newMessage = 'What was that last thing you mentioned?';
  let response3 = await chatEngine.chat({
    message: newMessage,
    chatHistory: [
      {
        role: 'user',
        content: 'what is Berkshire Hathaway?',
      },
      {
        role: 'assistant',
        content:
          'Berkshire Hathaway is an American multinational conglomerate holding company headquartered in Omaha, Nebraska, United States. The company wholly owns GEICO, Duracell, Dairy Queen, BNSF, Lubrizol, Fruit of the Loom, Helzberg Diamonds, Long & Foster, FlightSafety International, Pampered Chef, Forest River, and NetJets, and also owns 38.6% of Pilot Flying J; and significant minority holdings in public companies Kraft Heinz Company, American Express, Wells Fargo, The Coca-Cola Company, Bank of America, and Apple.',
      },
    ],
    stream: true,
  });
  console.log(response3.toString());

  for await (const data of response3) {
    console.log(data.message.content); // Print the data
  }
}

main().catch(console.error);
