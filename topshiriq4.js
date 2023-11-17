const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer((req,res) => {

    const parsedUrlPath = url.parse(req.url, true).path;
    const parsedUrlPathArray = parsedUrlPath.split("/");

    if (parsedUrlPathArray[0] === "" && parsedUrlPathArray[parsedUrlPathArray.length - 2] === "books" && !isNaN(parsedUrlPathArray[parsedUrlPathArray.length - 1])) {
        fs.readFile("books.json", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            const parsedFileData = JSON.parse(data);
            const findedBookById = parsedFileData.find(book => {
                return book.id === parseInt(parsedUrlPathArray[parsedUrlPathArray.length - 1]);
            });
            if (findedBookById !== undefined) {
                res.end(
                    `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Kitobni yangilash</title>
                        </head>
                        <body>
                            <form action="/books" method="POST">
                                <label for="book_id">Book ID</label>
                                <input type="number" id="book_id" value="${findedBookById.id}" name="book_id">
                                <label for="title">Title</label>
                                <input type="text" id="title" value="${findedBookById.title}" name="title">
                                <label for="author">Author</label>
                                <input type="text" id="author" value="${findedBookById.author}" name="author">
                                <input type="submit" value="Tahrirlashni saqlash">
                            </form>
                        </body>
                        </html>
                    `
                );
                return;
            }
            else {
                res.end("Bunday kitob mavjud emas!");
                return;
            }
        });
    }
    else {
        const body = [];
    
            req.on('data', (chunk) => {
                body.push(chunk);
            });
    
            req.on('end', () => {

                const stringData = Buffer.concat(body).toString();
                const parsedRequestData = new URLSearchParams(stringData);
                const dataObj = {};
                for (let pair of parsedRequestData.entries()) {
                    dataObj[pair[0]] = pair[1];
                }
                fs.readFile("books.json", "utf8", (err, data) => {
                    if (err) {
                        throw err;
                    }
                    const parsedFileData = JSON.parse(data);
                    const findedBook = parsedFileData.find(book => {
                        return parseInt(book.id) === parseInt(dataObj.book_id);
                    });
                    if (findedBook !== undefined) {
                        console.log(dataObj);
                        const findedBookIndex = parsedFileData.indexOf(findedBook);
                        parsedFileData[findedBookIndex].title = dataObj.title;
                        parsedFileData[findedBookIndex].author = dataObj.author;
                        console.log(parsedFileData);

                        fs.writeFile("books.json", JSON.stringify(parsedFileData), (err) => {
                            if (err) {
                                throw err;
                            }
                            res.end("Kitob yangilandi!");
                        });
                    }
                    else {
                        res.end("Kitob topilmadi!");
                    }
                });
                
            });
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});