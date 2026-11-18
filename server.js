const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.url === "/books" && req.method === "GET") {
        let books = JSON.parse(fs.readFileSync("books.json"));
        res.end(JSON.stringify(books));
    }
    else if (req.url === "/books" && req.method === "POST") {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => {
            let books = JSON.parse(fs.readFileSync("books.json"));
            let book = JSON.parse(data);
            books.push(book);
            fs.writeFileSync("books.json", JSON.stringify(books));
            res.end("Book Added Successfully");
        });
    }
    else if (req.url.startsWith("/books/") && req.method === "DELETE") {
        let id = decodeURIComponent(req.url.split("/")[2]);
        let books = JSON.parse(fs.readFileSync("books.json"));
        books = books.filter(book => book.id !== id);
        fs.writeFileSync("books.json", JSON.stringify(books));
        res.end("Book Deleted Successfully");
    }
    else if (req.url === "/") {
        fs.readFile("index.html", (err, data) => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        });
    }
    else if (req.url === "/style.css") {
        fs.readFile("style.css", (err, data) => {
            res.writeHead(200, {"Content-Type": "text/css"});
            res.end(data);
        });
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
