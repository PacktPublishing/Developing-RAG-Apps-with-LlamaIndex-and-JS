/** @format */

import fs from 'node:fs/promises';
import dotenv from 'dotenv';

import {
  Document,
  MetadataMode,
  NodeWithScore,
  VectorStoreIndex,
} from 'llamaindex';

// Load environment variables from .env file
dotenv.config();

async function main() {
  // Load essay from abramov.txt in Node
  const path = 'node_modules/llamaindex/examples/abramov.txt';

  const essay = await fs.readFile(path, 'utf-8');

  // Create Document object with essay
  const document = new Document({ text: essay, id_: path });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const { message, sourceNodes } = await queryEngine.query({
    query: 'When did he come to the US?',
  });

  // Output response with sources
  console.log(message.content);

  if (sourceNodes) {
    sourceNodes.forEach((source: NodeWithScore, index: number) => {
      console.log(
        `\n${index}: Score: ${source.score} - ${source.node
          .getContent(MetadataMode.NONE)
          .substring(0, 50)}...\n`
      );
    });
  }
}

main().catch(console.error);
