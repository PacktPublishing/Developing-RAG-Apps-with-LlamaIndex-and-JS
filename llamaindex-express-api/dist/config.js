"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_API_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
