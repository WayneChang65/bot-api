'use strict';
const puppeteer = require('puppeteer');
const os = require('os');

let this_os = os.platform();
let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';

async function init(options) {
    return (this_os === 'linux') ?
        await puppeteer.launch(Object.assign({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, options)) :
        await puppeteer.launch(Object.assign({
            headless: false
        }, options));
}

async function createPage(_browser) {
    const page = await _browser.newPage();
    await page.setDefaultNavigationTimeout(180 * 1000); // 3 mins
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image')
            request.abort();
        else
            request.continue();
    });
    page.setUserAgent(userAgent);
    return page;
}

async function scraping(_page) {
    const pttUrl = 'https://portal.imacloud.com.tw/#/';

    try {
        await _page.goto(pttUrl, {
            waitUntil: 'networkidle0'
        });

        await _page.mainFrame().addScriptTag({
            url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'
        })
        return await _page.evaluate(() => {
            let result = [];
            const contentSelector = '#app > div.v-application--wrap > div.background > div.sc-router-view-padding.sc-router-view-content-height > div > div.flex.xs12 > div > div > div > div > div';

            $(contentSelector).each((i, el) => {
                const title = $(el).find('a > div.v-card__text.text--primary.text-center.body-1 > div').html();
                const cost = $(el).find('a > div.v-list-item.theme--light > div:nth-child(1) > div').html();
                result.push({ title, cost });
            });
            return result;
        });
    } catch (e) {
        console.log(e);
        await browser.close();
    }
}

async function close(_browser) {
    if (_browser) await _browser.close();
}

async function _IMC_scraping() {
    const browser = await init();
    const page1 = await createPage(browser);
    const result = await scraping(page1); 
    await close(browser);
    return result;
}
//////////////  Module Exports //////////////////
module.exports = {
	IMC_scraping: _IMC_scraping
};