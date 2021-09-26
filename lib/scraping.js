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
        const link = String($(el).attr('href'));
        if (link !== 'undefined') {
            const title = String($(el).html()).split('<span>')[0];
            let href = (link.slice(0, 4) !== 'http') ?
                'http://www.smartmachinery.tw/page/news/' + link : link;
            result.push({ num: i, title: title, href: href });
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
        const href = 'https://www.moeaidb.gov.tw/' + $(el).find('a').attr('href');
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
        let title = $(el).find('a > span.title').text();
        let content = $(el).find('span.word').text();
        let href = 'https://www.pmc.org.tw/tw/news/' + $(el).find('a').attr('href');
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
        let title = $(el).find('a').html();
        title = String($(el).find('a').html()).split('<span')[0];
        let content = '';
        let href = 'https://www.tmba.org.tw/' + $(el).find('a').attr('href');
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
    TMBA_scraping: _TMBA_scraping
};