const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Read the routes folder
fs.readdirSync('./routes').forEach((file) => {
  // Ignore non-JS files
  if (!file.endsWith('.js')) return;

  // Get the route name from the filename
  const routeName = file.replace('.js', '');

  // Require the route file
  const route = require(path.join(__dirname, 'routes', file));

  // Mount the route on the app
  app.use(`/${routeName}`, route);
});
// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
