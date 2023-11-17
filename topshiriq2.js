const fs = require("fs");
const http = require("http");

const server = http.createServer((req,res) => {
    fs.readFile("books.json", "utf8", (err, data) => {
        
        if (err) throw err;

        const parsedData = JSON.parse(data);
        const splittedURL = req.url.split("/");

        const findedBook = parsedData.find(book => {
            return book.id === parseInt(splittedURL[2]);
        });

        if (findedBook !== undefined) {
            res.end(JSON.stringify(findedBook));
        }
        else {
            res.end("Kitob topilmadi");
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});