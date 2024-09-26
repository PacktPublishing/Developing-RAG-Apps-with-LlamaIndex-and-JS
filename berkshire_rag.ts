/** @format */

import fs from 'fs/promises'; // Importing the file system module for reading files
import path from 'path';
import dotenv from 'dotenv'; // Importing dotenv for loading environment variables

// Load environment variables from .env file
dotenv.config();

import { PDFReader, VectorStoreIndex } from 'llamaindex';

async function main() {
  // Directory containing the .txt files
  const directory = './data/berkshire.pdf';
  const reader = new PDFReader();
  const documents = await reader.loadData(directory);

  // Create an index from the documents
  const index = await VectorStoreIndex.fromDocuments(documents);
  console.log('Index created.', index);

  // Query the index with a question
  const queryEngine = index.asQueryEngine({ similarityTopK: 2 });
  console.log('Querying the index...');
  const queryResult = await queryEngine.query({
    query:
      'please give me the main points of the entire report.  Give me the main numbers and the main advice?',
  });

  console.log('Response:', queryResult.message.content);
}

main().catch(console.error);
