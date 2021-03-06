const express = require('express');
const PORT = process.env.PORT || 3002
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const { end } = require('cheerio/lib/api/traversing');
require('dotenv').config();
const EMANSION_DOMAIN = "https://www.emansion.gov.lr/";
let REMOTE_API_URL = "https://job-seeking-api.herokuapp.com";
let LOCAL_API_URL = `http://localhost:3001`;
const URL = EMANSION_DOMAIN + "2content_a.php?sub=82&related=30&third=82&pg=sp";
const MILLISECOND_IN_DAY = 86400000;
// const MILLISECOND_IN_DAY = 30000;
let count = 0;
let job_length = 0;
let api_key = process.env.api_key;

app.get('/', (req, res) => {
    getDataFromScrappedPage();
    res.send("E-Mansion Scraper");
})

// app.get('/store/data', (req, res) => {
//     getDataFromScrappedPage();
//     res.send("Data is being stored");
// })

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
const handleDocument = async(jobs) => {
    if (count < job_length) {
        let job_title = jobs[count].children[1].children[0].data;
        let job_link = EMANSION_DOMAIN + jobs[count].children[1].attribs.href;
        let closing_date = jobs[count].children[3].children[0].data.split(":")[1].trim();
        let new_date = await extractDate(closing_date);
        let data_to_send = {
            title: job_title.trim(),
            job_link: job_link,
            end_date: new_date.trim()
        }

        saveJobs(data_to_send, (result) => {
            console.log(count, "========================================");
            console.log(result);
            count += 1;
            handleDocument(jobs);
        });
    }
}

/**
 * Extract date from string and set new format
 * Date Format: 2021-11-02
 */
const extractDate = (date_str) => {
    let months = {
        january: '01',
        february: '02',
        march: '03',
        april: '04',
        may: '05',
        june: '06',
        july: '07',
        august: '08',
        september: '09',
        october: '10',
        november: '11',
        december: '12'
    }
    let splited_date = date_str.split(" ");
    let year = splited_date[2];
    let month = months[splited_date[1].toLowerCase()];
    let day = splited_date[0];
    let days_ending = ['st', 'nd', 'rd', 'th'];

    for (abbrev of days_ending) {
        day = day.replace(abbrev, '');
    }

    let new_date = `${year}-${month}-${day}`;
    return new_date;
}

/**
 * Make API request to save information scrapped
 */
const saveJobs = async(data, callback) => {
    await axios.post(`${LOCAL_API_URL}/v1/jobs?api_key=${api_key}`, {
            title: data.title,
            job_link: data.job_link,
            end_date: data.end_date
        })
        .then(suc => callback(suc.data))
        .catch(err => callback(err.data))
}

getDataFromScrappedPage();

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))