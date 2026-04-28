const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = 3001;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf"
};

http
  .createServer((req, res) => {
    let requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (requestPath === "/") {
      requestPath = "/index.html";
    }

    const filePath = path.normalize(path.join(root, requestPath));
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(error.code === "ENOENT" ? 404 : 500, {
          "Content-Type": "text/plain; charset=utf-8"
        });
        res.end(error.code === "ENOENT" ? "Not found" : "Server error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
      });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
  });
