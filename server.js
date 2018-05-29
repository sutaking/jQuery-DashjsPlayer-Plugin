var express = require('express');
var app = express();

app.use(express.static('./'));
app.get('/', (req, res) => {
    res.sendfile('index.html');
});

app.listen(3000, () => {
    console.log('Start server on port 3000!');
})