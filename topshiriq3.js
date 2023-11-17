const fs = require("fs");
const http = require("http");

const server = http.createServer((req,res) => {
    fs.readFile("books.json", "utf8", (err, data) => {
        
        if (err) throw err;

        const parsedFileData = JSON.parse(data);

        if (req.url === "/") {
            res.end(
                `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Kitob qo'shish</title>
                    </head>
                    <body>
                        <form action="/books" method="POST">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title">
                            <label for="author">Author</label>
                            <input type="text" id="author" name="author">
                            <input type="submit" value="Saqlash">
                        </form>
                    </body>
                    </html>
                `
            );
            return;
        }
        if (req.url === "/books" && req.method === "POST") {

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
    
                const findedBook = parsedFileData.find(kitob => {
                    return kitob.title === dataObj.title;
                });

                switch(findedBook) {
                    case undefined: 
                                    parsedFileData.push({ id: parsedFileData.length + 1, title: dataObj.title, author: dataObj.author })
                                    fs.writeFile("books.json", JSON.stringify(parsedFileData), (err) => {
                                        if (err) {
                                            throw err;
                                        }
                                        res.end(`${dataObj.title} nomli kitob qo\'shildi!`);
                                        return;
                                    });
                    default: 
                                    res.end(`${dataObj.title} nomli kitob, kitoblar ro\'yhatida mavjud!`);
                                    return;
                }
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});