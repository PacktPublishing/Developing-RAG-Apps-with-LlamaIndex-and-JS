/** @format */

import express from 'express';
import { PORT } from './config';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
