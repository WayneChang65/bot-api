'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const options = {
    'headers': {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
    }
};

// 智機辦
async function _SM_scraping() {
    const url = 'http://www.smartmachinery.tw/page/news/index.aspx';
    const response = await fetch(url, options);
    const $ = cheerio.load(await response.text());
    let result = [];
    $('#ctl00_content > div.list-box > ul li a').each((i, el) => {
        const relHref = String($(el).attr('href'));
        if (relHref !== 'undefined') {
            const title = String($(el).html()).split('<span>')[0];
            const href = (relHref.slice(0, 4) !== 'http') ?
                'http://www.smartmachinery.tw/page/news/' + relHref : relHref;
            const content = '';
            result.push({ num: i, title: title, content: content ,href: href });
        }
    });
    return result;
}

// 工業局
async function _IDB_scraping() {
    const url = 'https://www.moeaidb.gov.tw/ctlr?PRO=news.rwdNewsList&page=1';
    const response = await fetch(url, options);
    const $ = cheerio.load(await response.text());
    let result = [];
    $('li.idbDataItem').each((i, el) => {
        const title = $(el).find('a').text();
        const content = $(el).find('a').attr('title');
        const relHref = $(el).find('a').attr('href');
        const href = (relHref.indexOf('http') === -1) ? 
            'https://www.moeaidb.gov.tw/' + relHref : relHref;
        result.push({ num: i + 1, title: title, content: content, href: href });
    });
    return result;
}

// 精機中心
async function _PMC_scraping() {
    const url = 'https://www.pmc.org.tw/tw/news/index.aspx?kind=15';
    const response = await fetch(url, options);
    const $ = cheerio.load(await response.text());
    let result = [];
    $('#ctl00_content > div.list-box > ul > li > div.col-md-8.col-sm-8').each((i, el) => {
        const title = $(el).find('a > span.title').text();
        const content = $(el).find('span.word').text();
        const relHref = $(el).find('a').attr('href');
        const href = (relHref.indexOf('http') === -1) ? 
            'https://www.pmc.org.tw/tw/news/' + relHref : relHref;

        if (title !== '') {
            result.push({ num: i + 1, title: title, content: content, href: href });
        }
    });
    return result;
}

// 零組件工會
async function _TMBA_scraping() {
    const url = 'https://www.tmba.org.tw/message_list.php?mode=catList&cid=1448860074';
    const response = await fetch(url, options);
    const $ = cheerio.load(await response.text());
    let result = [];
    $('#main > div.list_wrap > ul > li').each((i, el) => {
        const title = String($(el).find('a').html()).split('<span')[0];
        const content = '';
        const relHref = $(el).find('a').attr('href');
        const href = (relHref.indexOf('http') === -1) ? 
            'https://www.tmba.org.tw/' + relHref : relHref;
        if (title !== '') {
            result.push({ num: i + 1, title: title, content: content, href: href });
        }
    });
    return result;
}

// TIIP
async function _TIIP_scraping() {
    const url = 'https://tiip.itnet.org.tw/newsList.php?pp_id1=&kw=';
    const selector = 'body > div.container-fluid > div > div.col-xl-8.content_area.bg_white > div.table-responsive.table_01 > table > tbody > tr';
    const response = await fetch(url, options);
    const $ = cheerio.load(await response.text());
    let result = [];
    $(selector).each((i, el) => {
        const title = $(el).find('td > a').attr('title');
        const content = '';
        const relHref = $(el).find('td > a').attr('href');
        const href = (relHref.indexOf('http') === -1) ? 
            'https://tiip.itnet.org.tw/' + relHref : relHref;
        if (title !== '') {
            result.push({ num: i + 1, title: title, content: content, href: href });
        }
    });
    return result;
}
//////////////  Module Exports //////////////////
module.exports = {
	SM_scraping: _SM_scraping,
    IDB_scraping: _IDB_scraping,
    PMC_scraping: _PMC_scraping,
    TMBA_scraping: _TMBA_scraping,
    TIIP_scraping: _TIIP_scraping
};