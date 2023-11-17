const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer((req,res) => {

    const parsedUrlPath = url.parse(req.url, true).path;
    const parsedUrlPathArray = parsedUrlPath.split("/");
    if (parsedUrlPathArray[0] === "" && parsedUrlPathArray[1] === "books" && !isNaN(parseInt(parsedUrlPathArray[2]))) {
       fs.readFile("books.json", "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        const parsedFileData = JSON.parse(data);
        const findedBookById = parsedFileData.find(book => {
            return parseInt(book.id) === parseInt(parsedUrlPathArray[2]);
        });
        
        if (findedBookById !== undefined) {
            const findedBookIndex = parsedFileData.indexOf(findedBookById);
            parsedFileData.splice(findedBookIndex,1);
            fs.writeFile("books.json", JSON.stringify(parsedFileData), (err) => {
                if (err) {
                    throw err;
                }
                res.end("Kitob o\'chirildi!");
            });
        }
       }); 
    }
    else {
        res.end("Noto\'g\'ri manzil!");
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});