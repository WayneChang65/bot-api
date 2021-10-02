'use strict';
const puppeteer = require('puppeteer');
const os = require('os');

const this_os = os.platform();
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';
let browser, page;

async function _init(options) {
    browser = (this_os === 'linux') ?
        await puppeteer.launch(Object.assign({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, options)) :
        await puppeteer.launch(Object.assign({
            headless: false
        }, options));
    page = await createPage(browser);
    return { browser: browser, page: page };
}

async function createPage(_browser) {
    const page = await _browser.newPage();
    await page.setDefaultNavigationTimeout(3 * 60 * 1000); // 3 mins
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image') request.abort();
        else request.continue();
    });
    page.setUserAgent(userAgent);
    return page;
}

async function _IMC_scraping(_page) {
    const pttUrl = 'https://portal.imacloud.com.tw/#/';

    try {
        const jq = await _page.evaluate(() => window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
            .then(res => res.text()));
        await _page.goto(pttUrl, { waitUntil: 'networkidle0' });
        await _page.evaluate(jq);

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

async function _IDB_scraping(_page) {
    const pttUrl = 'https://www.moeaidb.gov.tw/ctlr?PRO=news.rwdNewsList&page=1';

    try {
        const jq = await _page.evaluate(() => window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
            .then(res => res.text()));
        await _page.goto(pttUrl, { waitUntil: 'networkidle0' });
        await _page.evaluate(jq);

        return await _page.evaluate(() => {
            let result = [];
            $('li.idbDataItem').each((i, el) => {
                const title = $(el).find('a').text();
                const content = $(el).find('a').attr('title');
                const href = 'https://www.moeaidb.gov.tw/' + $(el).find('a').attr('href');
                if (title !== '') {
                    result.push({ num: i + 1, title: title, content: content, href: href });
                }
            });
            return result;
        });
    } catch (e) {
        console.log(e);
        await browser.close();
    }
}

async function _close(_browser) {
    if (_browser) await _browser.close();
}

//////////////  Module Exports //////////////////
module.exports = {
    init: _init,
    IMC_scraping: _IMC_scraping,
    IDB_scraping: _IDB_scraping,
    close: _close,
    browser: browser,
    page: page
};