/** @format */

import fs from 'node:fs/promises';
import dotenv from 'dotenv';
import * as llamaIndex from 'llamaindex';

// Load environment variables from .env file
dotenv.config();

async function manualRag() {
  const documents = await new llamaIndex.SimpleDirectoryReader().loadData({
    directoryPath: './data',
  });
  const index = await llamaIndex.VectorStoreIndex.fromDocuments(documents);

  let customLLM = new llamaIndex.OpenAI();
  let customEmbeddings = new llamaIndex.OpenAIEmbedding();

  let customServiceContext = llamaIndex.serviceContextFromDefaults({
    llm: customLLM,
    embedModel: customEmbeddings,
  });

  let customQaPrompt = function ({ context = '', query = '' }) {
    return `Context information is below.
            ---------------------
            ${context}
            ---------------------
            Given the context information, answer the query.
            Include a random fact about lions and elephants in Africa in your answer.\
            The lions and elephants can come from your training data.
            Query: ${query}
            Answer:`;
  };

  let customResponseBuilder = new llamaIndex.SimpleResponseBuilder(
    customServiceContext,
    customQaPrompt
  );

  let customSynthesizer = new llamaIndex.ResponseSynthesizer({
    responseBuilder: customResponseBuilder,
    serviceContext: customServiceContext,
  });

  let customRetriever = new llamaIndex.VectorIndexRetriever({
    index,
  });

  let customQueryEngine = new llamaIndex.RetrieverQueryEngine(
    customRetriever,
    customSynthesizer
  );

  let response = await customQueryEngine.query({
    query: 'what is the article about?',
  });
  console.log('\n\n === Custom Query Engine Response === \n\n');

  console.log(response.toString());
}
manualRag().catch(console.error);
