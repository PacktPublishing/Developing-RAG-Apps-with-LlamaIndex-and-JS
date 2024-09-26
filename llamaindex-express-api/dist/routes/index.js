"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const query_1 = __importDefault(require("./query"));
const router = (0, express_1.Router)();
router.use('/query', query_1.default);
exports.default = router;
// to run the server, run the following command:
// npx tsc
// node dist/index.js
