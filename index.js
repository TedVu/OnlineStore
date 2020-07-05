const fs = require('fs');
const http = require('http');
const url=require('url');
const replaceTemplate=require('./modules/replaceTemplate')



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //inJSON format
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url,true);
  
  
    //Overview page 
    if (pathname === '/' || pathname === '/overview') {

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

        res.writeHead(200, { 'Content-type': 'text/html' });

        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);

        //Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const product = dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        // Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found</h1>")
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening for request on Port 8000")
})
