import 'dotenv/config';

import http from 'http';
import app from './app.js';

const port = process.env.PORT || 3000; // Set port to 0 to automatically pick a free port

const server = http.createServer(app);

server.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});
