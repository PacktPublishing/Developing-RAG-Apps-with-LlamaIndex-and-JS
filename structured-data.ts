/** @format */

import { OpenAI } from 'llamaindex';

import dotenv from 'dotenv';

/**
 * Install the following dependencies:
 *  npm install dotenv
    npm install @types/node --save-dev
  for openai api key
 */

// Load environment variables from .env file
dotenv.config();

const transcript = `[Phone rings]

Support Rep: Hello, this is Mike from ABC Support. How can I help you today?

Customer: Hi Mike, I'm having trouble with my ABC Widget. It keeps crashing when I try to use it.

Support Rep: I'm sorry to hear that. Can you tell me more about the issue? When does it crash and are there any error messages?

Customer: It usually crashes after I use it for about 10 minutes, and I get an error message saying "Unexpected error occurred."

Support Rep: Thank you for the details. It sounds like it could be a memory issue. Have you tried restarting the widget or reinstalling the app?

Customer: Yes, I've tried both but the issue persists.

Support Rep: I understand. Let me check our system for any similar issues and see if there's a known solution. Can you hold on for a moment, please?

Customer: Sure, no problem.

Support Rep: Thank you for waiting. It appears this is a known issue, and we have a patch that should fix the problem. I'll send you the instructions to apply the patch. Additionally, I'll escalate this to our technical team to ensure it gets resolved quickly.

Customer: That would be great. Thank you for your help, Mike.

Support Rep: You're welcome. Is there anything else I can assist you with today?

Customer: No, that's all. Thanks again.

Support Rep: My pleasure. Have a great day!

Customer: You too, bye.`;

async function main() {
  const llm = new OpenAI({
    model: 'gpt-3.5-turbo',
    additionalChatOptions: { response_format: { type: 'json_object' } },
  });

  const example = {
    summary:
      'High-level summary of the call transcript. Should not exceed 3 sentences.',
    issues_reported: ['issue 1', 'issue 2'],
    rep_name: 'Name of the support representative',
    customer_name: 'Name of the customer, if not provided, use "Customer"',
    sentiment: 'overall sentiment of the customer',
    suggested_improvements: ['suggestion 1', 'suggestion 2'],
    follow_up_actions: ['action item 1', 'action item 2'],
  };

  const response = await llm.chat({
    messages: [
      {
        role: 'system',
        content: `You are an expert assistant for analyzing and extracting insights from customer support call transcripts.\n\nGenerate a valid JSON in the following format:\n\n${JSON.stringify(
          example
        )}`,
      },
      {
        role: 'user',
        content: `Here is the transcript: \n------\n${transcript}\n------`,
      },
    ],
  });

  console.log(response.message.content);
}
main().catch(console.error);
