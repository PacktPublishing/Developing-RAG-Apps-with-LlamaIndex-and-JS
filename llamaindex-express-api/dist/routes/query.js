"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
// import { Document, VectorStoreIndex, ChatEngine } from 'llamaindex';
const llamaindex_1 = require("llamaindex");
const router = (0, express_1.Router)();
// Endpoint to query the index
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfPath = path_1.default.join(__dirname, '../../data/berkshire.pdf');
    const reader = new llamaindex_1.PDFReader();
    const documents = yield reader.loadData(pdfPath);
    // Create an index from the documents
    const index = yield llamaindex_1.VectorStoreIndex.fromDocuments(documents);
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
        const queryResult = yield queryEngine.query({
            query: query ||
                'please give me the main points of the entire report.  Give me the main numbers and the main advice?',
        });
        res.status(200).json({ response: queryResult }); // get the whole object
        // res.status(200).json({ response: queryResult.response }); // get actual response
    }
    catch (error) {
        res.status(500).json({ error: 'Error querying the index' });
    }
}));
exports.default = router;
