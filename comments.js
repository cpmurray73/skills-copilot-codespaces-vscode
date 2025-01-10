// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  if (req.method === 'GET') {
    if (pathname === '/comments') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else {
      fs.readFile(path.join(__dirname, 'public', pathname), (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    if (pathname === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const newComment = JSON.parse(body);
        comments.push(newComment);
        fs.writeFile(
          path.join(__dirname, 'comments.json'),
          JSON.stringify(comments, null, 2),
          (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/html' });
              res.end('<h1>Internal Server Error</h1>');
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newComment));
            }
          }
        );
      });
    }
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});