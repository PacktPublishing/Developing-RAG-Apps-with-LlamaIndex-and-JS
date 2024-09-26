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
  OpenAIAgent,
  QueryEngineTool,
  FunctionTool,
} from 'llamaindex';

async function main() {
  const documents1 = await new SimpleDirectoryReader().loadData({
    directoryPath: './data',
  });
  const index1 = await VectorStoreIndex.fromDocuments(documents1);

  const queryEngine1 = index1.asQueryEngine();

  let response1 = await queryEngine1.query({
    query: 'give me the main points of the document in bullet points',
  });

  // console.log(response1.message.content);

  /// Document 2
  const documents2 = await new SimpleDirectoryReader().loadData({
    directoryPath: './data2',
  });
  const index2 = await VectorStoreIndex.fromDocuments(documents2);
  const queryEngine2 = index2.asQueryEngine();

  let response2 = await queryEngine2.query({
    query: 'What are the main points of the article in 2 sentences?',
  });
  // console.log('Article Response: \n');

  // console.log(response2.toString());

  // === create a router query engine to handle multiple query engines ===
  // Create a router query engine
  const queryEngineRouter = RouterQueryEngine.fromDefaults({
    queryEngineTools: [
      {
        queryEngine: queryEngine1,
        description: 'Useful for questions about Berkshires Hathaway',
      },
      {
        queryEngine: queryEngine2,
        description: 'Useful for questions about the article on writers strike',
      },
    ],
  });

  // Query the router query engine -- ask questions about the two documents

  let response3 = await queryEngineRouter.query({
    query: 'tell me about when did Munger die?',
  });
  // console.log(response3.toString());

  let response4 = await queryEngineRouter.query({
    query: 'what started the writers strike about AI?',
  });
  // console.log(response4.toString());

  // === NEXT: Define tools -- a simple one to get started ===
  function sum({ a, b }: { a: number; b: number }): number {
    return a + b;
  }
  function getWeather({ city }: { city: string }) {
    return `The weather in ${city} is 72 degrees Fahrenheit`;
  }

  // make the function into a tool
  let sumFunctionTool = new FunctionTool(sum, {
    name: 'sum',
    description: 'Use this function to sum two numbers',
    parameters: {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: 'The first number',
        },
        b: {
          type: 'number',
          description: 'The second number',
        },
      },
      required: ['a', 'b'],
    },
  });

  let weatherFunctionTool = new FunctionTool(getWeather, {
    name: 'getWeather',
    description: 'Use this tool to get the weather in a city',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The city to get the weather for',
        },
      },
      required: ['city'],
    },
  });

  // Make the router query engine into a tool
  const queryEngineTool = new QueryEngineTool({
    queryEngine: queryEngineRouter,
    metadata: {
      name: 'berkshire_and_math_and_weather',
      description:
        'A tool that can answer questions about Berkshire Hathaway and math and weather',
    },
  });

  // Create a new OpenAIAgent
  const agent = new OpenAIAgent({
    tools: [queryEngineTool, sumFunctionTool, weatherFunctionTool], // Add the tools to the agent
    verbose: true, // Set verbose to true to see the agent's responses
  });

  let response5 = await agent.chat({
    message:
      'Tell me about how Buffet felt about the death of Munger and when did he die? Use a tool.',
  });
  console.log(response5.toString());

  let response6 = await agent.chat({ message: 'What is 501 + 5?' });
  console.log(response6.toString());

  let response7 = await agent.chat({
    message: 'what is the weather in Spokane? use a tool',
  }); // make sure to use a tool otherwise the llm will try and use its own knowledge base!
  console.log(response7.toString());
}

main().catch(console.error);
