const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const router = require('./router');
const { sequelize } = require('./db/index');
const http = require('http');

const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Adjust '10mb' as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
const port = process.env.PORT || 5000;
app.use(router);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ success: false, message: error.message || 'An unknown error occurred!' });
});

const server = http.createServer(app);

require('./socket')(server);


// Sync the database (uncomment if needed)
// sequelize.sync({ force: true }) // Warning: use only in development
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch(err => {
//     console.error('Database synchronization failed:', err);
//   });

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

