const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.all('/', (req, res) => {
    res.send('/를 이용해 join, list, get, update, delete');
});

app.listen(80,()=>{console.log('http://localhost')});