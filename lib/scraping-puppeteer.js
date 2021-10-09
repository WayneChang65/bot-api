'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const puppeteer = require('puppeteer');
const os = require('os');

const this_os = os.platform();
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';
let puppeteerObj = {};

async function _init(options) {
    const browser = (this_os === 'linux') ?
        await puppeteer.launch(Object.assign({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, options)) :
        await puppeteer.launch(Object.assign({
            headless: false
        }, options));
    const page = await createPage(browser);
    fmlog('sys_msg', ['BOT-API', 'Puppeteer has initialized.']);
    return { browser: browser, page: page };
}

async function createPage(browser) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(3 * 60 * 1000); // 3 mins
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image') request.abort();
        else request.continue();
    });
    page.setUserAgent(userAgent);
    return page;
}

async function _recreatePuppeteerObj(options) {
    await puppeteerObj.browser.close();
    puppeteerObj = await _init(options);
}

async function _IMC_scraping(options) {
    const pttUrl = 'https://portal.imacloud.com.tw/#/';
    if (!puppeteerObj.browser || !puppeteerObj.page) puppeteerObj = await _init(options);
    const page = puppeteerObj.page;
    try {
        const jq = await page.evaluate(() => window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
            .then(res => res.text()));
        await page.goto(pttUrl, { waitUntil: 'networkidle0' });
        await page.evaluate(jq);

        return await page.evaluate(() => {
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
        fmlog('error_msg', ['BOT-API', 'IMC - Exception catched','The browser is closed.']);
        console.log(e);
        await _recreatePuppeteerObj(options);
    }
}

async function _IDB_scraping(options) {
    const pttUrl = 'https://www.moeaidb.gov.tw/ctlr?PRO=news.rwdNewsList&page=1';
    if (!puppeteerObj.browser || !puppeteerObj.page) puppeteerObj = await _init(options);
    const page = puppeteerObj.page;
    try {
        const jq = await page.evaluate(() => window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
            .then(res => res.text()));
        await page.goto(pttUrl, { waitUntil: 'networkidle0' });
        await page.evaluate(jq);

        return await page.evaluate(() => {
            let result = [];
            $('li.idbDataItem').each((i, el) => {
                const title = $(el).find('a').text();
                const content = $(el).find('a').attr('title');
                const relHref = $(el).find('a').attr('href');
                const href = (relHref.indexOf('http') === -1) ? 
                    'https://www.moeaidb.gov.tw/' + relHref : relHref;
                if (title !== '') {
                    result.push({ num: i + 1, title: title, content: content, href: href });
                }
            });
            return result;
        });
    } catch (e) {
        fmlog('error_msg', ['BOT-API', 'IDB - Exception catched','The browser is closed.']);
        console.log(e);
        await _recreatePuppeteerObj(options);
    }
}

async function _SMF_scraping(options) {
    const pttUrl = 'https://www.vmx.com.tw/itriut/';
    const loginData = {
        id: process.env.BOT_API_SMF_ID,
        pw: process.env.BOT_API_SMF_PW
	}
    if (!puppeteerObj.browser || !puppeteerObj.page) puppeteerObj = await _init(options);
    const page = puppeteerObj.page;
    try {
        const jq = await page.evaluate(() => window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
            .then(res => res.text()));
        await page.goto(pttUrl, { waitUntil: 'networkidle0' });
        await page.evaluate(jq);
        let em = await page.$('#inpEm');
        let pw = await page.$('#inpPw');
        let btn = await page.$('#btnLogin');
        if (em !== null && pw !== null && btn !== null) {
		    await page.type('#inpEm', loginData.id);
		    await page.type('#inpPw', loginData.pw);
		    await page.click('#btnLogin');
		    await page.waitForNavigation();
        }
		
		return await page.evaluate(async () => {
			let result = [];
			await new Promise(function(resolve) { 
				setTimeout(resolve, 3000);
		 	});
			$('#utTableRoot').find('table > tbody > tr').each((i, el) => {
				let aMachineData = $(el).text().split('09111315171921230103050709');
				let title = aMachineData[0];
				let ut = aMachineData[1].split(' ')[0];
				let finishRate = aMachineData[1].split(' ')[2];
				let finishPiece = aMachineData[1].split(' ')[5];
				let prog = aMachineData[1].split(' ')[7];
				result.push({
					title: title,
					ut: ut,
					finishRate: finishRate,
					finishPiece: finishPiece,
					prog: prog
				});
			});
			return result;
		});
    } catch (e) {
        fmlog('error_msg', ['BOT-API', 'IMC - Exception catched','The browser is closed.']);
        console.log(e);
        await _recreatePuppeteerObj(options);
    }
}

async function _AIR_scraping(options) {
	const pttUrl = 'https://airtw.epa.gov.tw/CHT/Query/StationData.aspx';
    if (!puppeteerObj.browser || !puppeteerObj.page) puppeteerObj = await _init(options);
    const page = puppeteerObj.page;
	try {
		const jq = await page.evaluate(() => 
			window.fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js')
			.then(res => res.text()));
		await page.goto(pttUrl, {
			waitUntil: 'networkidle0'
		});
		await page.evaluate(jq);
		await page.click('#area1');
        await page.click('#area2');
        await page.click('#area3');
        await page.click('#area4');
        await page.click('#area5');
        await page.click('#area6');
        await page.click('#area7');
        await page.click('#area8');
        await page.click('#CPH_Content_btnQuery');
        
		return await page.evaluate(async () => {
			let result = [];
			await new Promise(function(resolve) { 
				setTimeout(resolve, 500);
		 	});
            $('#CPH_Content_div_table > table > tbody > tr').each((i, el_tr) => {
                let anArea = [];
                $(el_tr).find('td').each((i, el_td) => {
                    anArea.push($(el_td).text());
                });
                result.push({
                    name:   anArea[0],
                    type:   anArea[1],
                    aqi:    anArea[2],
                    pm25:   anArea[3],
                    pm10:   anArea[4],
                    o3:     anArea[5],
                    co:     anArea[6],
                    so2:    anArea[7],
                    no2:    anArea[8]
                });
            });
			return result;
		});
	} catch (e) {
        fmlog('error_msg', ['BOT-API', 'AIR - Exception catched','The browser is closed.']);
        console.log(e);
        await _recreatePuppeteerObj(options);
	}
}

//////////////  Module Exports //////////////////
module.exports = {
    IMC_scraping: _IMC_scraping,
    IDB_scraping: _IDB_scraping,
    SMF_scraping: _SMF_scraping,
    AIR_scraping: _AIR_scraping,
    puppeteerObj: puppeteerObj
};