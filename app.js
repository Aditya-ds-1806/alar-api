const express = require('express');
const yaml = require('js-yaml');
const { default: axios } = require('axios');
const fs = require('fs');

const app = express();
const { PORT, IP } = process.env;
const baseURL = "https://alar.ink/tl/kn";
const dictionary = yaml.load(fs.readFileSync('./alar.yml', { encoding: 'utf-8' }));

app.get('/', async (req, res) => {
    const query = req.query.q;
    const url = new URL(`${baseURL}/${query}`);
    const { data } = await axios.get(url.toString());
    const words = data.result;
    const response = [];
    words.forEach(word => {
        response.push(...dictionary.filter(item => item.entry === word));
    });
    res.send(JSON.stringify(response));
});

app.listen(PORT || 3000, IP, () => {
    console.log(`Server listening on port: ${PORT || 3000}`);
});
