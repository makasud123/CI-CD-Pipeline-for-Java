const http = require("http");

const PORT = process.env.PORT || 3000;

function requestHandler(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("this is my pipeline");
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { requestHandler };
