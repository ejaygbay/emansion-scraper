const express = require('express');
const PORT = process.env.PORT || 3002
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom')
const URL = "https://www.emansion.gov.lr/2content_a.php?sub=82&related=30&third=82&pg=sp";
// const URL = 'https://online-election.herokuapp.com/'
const scrapePage = async() => await axios(URL);

const makeRequest = async() => {
    let response = await scrapePage;

    response().then(data => {
            const $ = cheerio.load(data.data);
            let jobs = $("#doclist > li");
            let emansion_domain = "https://www.emansion.gov.lr/";

            for (let i = 0; i < jobs.length; i++) {
                let job_title = jobs[i].children[1].children[0].data;
                let job_link = emansion_domain + jobs[i].children[1].attribs.href;
                let closing_date = jobs[i].children[3].children[0].data;

                console.log(i + 1, "========================================");
                console.log(job_title);
                console.log(job_link);
                console.log(closing_date);
                console.log();
            }


            // newsdate

            // console.log(jobs)
            // jobs.children.forEach(ele => {
            //     console.log(ele)
            // });
            // console.log($("#content-container"));
            // console.log($.text());
            // console.log(jobs)
        })
        .catch(err => {
            console.log(err)
        })
        // let html = response.data;
        // console.log(response())
        // 

    // let list = $("#content-container");
    // $('#doclist')
    // console.log(html);
    // console.log(list.text())
    // const links = extractLinks($);

    // console.log($('#doclist').html());
    // console.log(list());
    // console.log(document.getElementById("content-container"));
}
makeRequest();
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))