/** @format */

import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
// import { Document, VectorStoreIndex, ChatEngine } from 'llamaindex';

import { PDFReader, VectorStoreIndex } from 'llamaindex';

const router = Router();

// Endpoint to query the index
router.post('/', async (req, res) => {
  const pdfPath = path.join(__dirname, '../../data/berkshire.pdf');

  const reader = new PDFReader();
  const documents = await reader.loadData(pdfPath);

  // Create an index from the documents
  const index = await VectorStoreIndex.fromDocuments(documents);
  console.log('Index created.', index);
  if (!index) {
    return res.status(400).json({ error: 'Index not created' });
  }

  const { query } = req.body;
  console.log('Query:', query);

  // Query the index with a question
  const queryEngine = index.asQueryEngine();

  try {
    console.log('Querying the index...');
    const queryResult = await queryEngine.query({
      query:
        query ||
        'please give me the main points of the entire report.  Give me the main numbers and the main advice?',
    });

    res.status(200).json({ response: queryResult }); // get the whole object
    // res.status(200).json({ response: queryResult.response }); // get actual response
  } catch (error) {
    res.status(500).json({ error: 'Error querying the index' });
  }
});

export default router;
