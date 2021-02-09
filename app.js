const express = require('express');
const yaml = require('js-yaml');
const { default: axios } = require('axios');
const fs = require('fs');

const app = express();
const { PORT, IP } = process.env;
const baseURL = "https://alar.ink/tl/kn";
const dictionary = yaml.load(fs.readFileSync('./alar.yml', { encoding: 'utf-8' }));

app.get('/', (req, res) => {
    res.json({
        "Hello World!": "This is an unofficial REST API for Alar.ink",
        endPoints: [
            {
                searchByWord: "/search?q=",
                examples: ["/search?q=alar", "/search?q=ಅಲರ್"],

            }
        ],
        author: {
            name: "Aditya D.S.",
            emailID: "esd18i001@iiitdm.ac.in"
        }
    });
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const url = new URL(`${baseURL}/${query}`);
    const { data } = await axios.get(url.toString());
    const words = data.result;
    const response = [];
    words.forEach(word => {
        response.push(...dictionary.filter(item => item.entry === word));
    });
    res.json({
        input: query,
        results: response,
        success: response.length !== 0,
        at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });
});

app.listen(PORT || 3000, IP, () => {
    console.log(`Server listening on port: ${PORT || 3000}`);
});
