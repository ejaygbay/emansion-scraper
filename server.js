const express = require('express');
const PORT = process.env.PORT || 3002
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const { end } = require('cheerio/lib/api/traversing');
require('dotenv').config();
const EMANSION_DOMAIN = "https://www.emansion.gov.lr/";
let API_URL = "https://job-seeking-api.herokuapp.com/";
const URL = EMANSION_DOMAIN + "2content_a.php?sub=82&related=30&third=82&pg=sp";
const MILLISECOND_IN_DAY = 86400000;
// const MILLISECOND_IN_DAY = 30000;
let count = 0;
let job_length = 0;
let api_key = process.env.api_key;

app.get('/', (req, res) => {
    res.send("E-Mansion Scraper");
})

app.get('/store/data', (req, res) => {
    getDataFromScrappedPage();
    res.send("Data is being stored");
})

/**
 * Scrape page
 */
const scrapePage = async() => await axios(URL);

/**
 * Get data from the scrapped page
 * Convert it to cheerio object
 * Send it for futher processing
 */
const getDataFromScrappedPage = async() => {
    let response = await scrapePage;

    response()
        .then(data => {
            const $ = cheerio.load(data.data);
            let jobs = $("#doclist > li");
            job_length = jobs.length;
            count = 0;
            handleDocument(jobs);
        })
        .catch(err => {
            console.log(err)
        })

    let daily_check = setInterval(getDataFromScrappedPage, MILLISECOND_IN_DAY);
    clearInterval(daily_check);
    daily_check = setInterval(getDataFromScrappedPage, MILLISECOND_IN_DAY);
}

/**
 * Receive the cheerio object
 * Get sepcific data
 * Make API call(s) to save the data
 */
const handleDocument = (jobs) => {
    if (count < job_length) {
        let job_title = jobs[count].children[1].children[0].data;
        let job_link = EMANSION_DOMAIN + jobs[count].children[1].attribs.href;
        let closing_date = jobs[count].children[3].children[0].data.split(":")[1].trim();

        let data_to_send = {
            title: job_title.trim(),
            job_link: job_link,
            end_date: closing_date.trim()
        }

        saveJobs(data_to_send, (result) => {
            console.log(count, "========================================");
            console.log(result.data);
            count += 1;
            handleDocument(jobs);
        });
    }
}

/**
 * Make API request to save information scrapped
 */
const saveJobs = async(data, callback) => {
    await axios.post(`${API_URL}/v1/jobs?api_key=${api_key}`, {
            title: data.title,
            job_link: data.job_link,
            end_date: data.end_date
        })
        .then(suc => callback(suc))
        .catch(err => callback(err))
}

// getDataFromScrappedPage();

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))