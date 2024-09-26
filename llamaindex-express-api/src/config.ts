/** @format */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
