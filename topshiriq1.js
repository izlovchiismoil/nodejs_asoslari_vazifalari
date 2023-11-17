const fs = require("fs");
const http = require("http");

const server = http.createServer((req,res) => {
    if (req.url === "/books") {
        fs.readFile("books.json", "utf8", (err,data) => {
            if (err) {
                throw err;
            }
            else {
                res.end(data);
            }
        });
    }
    else {
        res.end("Ma'lumot topilmadi");
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});