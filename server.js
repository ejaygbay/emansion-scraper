const express = require('express');
const PORT = process.env.PORT || 3002
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const EMANSION_DOMAIN = "https://www.emansion.gov.lr/";
const URL = EMANSION_DOMAIN + "2content_a.php?sub=82&related=30&third=82&pg=sp";
const scrapePage = async() => await axios(URL);
const MILLISECOND_IN_DAY = 86400000;
// const MILLISECOND_IN_DAY = 1000;


const makeRequest = async() => {
    let response = await scrapePage;

    response()
        .then(data => {
            const $ = cheerio.load(data.data);
            let jobs = $("#doclist > li");

            for (let i = 0; i < jobs.length; i++) {
                let job_title = jobs[i].children[1].children[0].data;
                let job_link = EMANSION_DOMAIN + jobs[i].children[1].attribs.href;
                let closing_date = jobs[i].children[3].children[0].data;

                console.log(i + 1, "========================================");
                console.log(job_title.trim());
                console.log(job_link);
                console.log(closing_date.trim());
                console.log();
            }
        })
        .catch(err => {
            console.log(err)
        })

    let daily_check = setInterval(makeRequest, MILLISECOND_IN_DAY);
    clearInterval(daily_check);
    daily_check = setInterval(makeRequest, MILLISECOND_IN_DAY);
}

// makeRequest();

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))