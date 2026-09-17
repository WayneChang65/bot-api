'use strict';
const fetch = require('cross-fetch');
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

// 環境部空氣品質監測網:全站測站即時數據(AQI/氣溫/濕度)
//
// 資料來源(皆為站端公開端點,純 HTTP 即可):
// 1) ajax.aspx Target=system_time      -> 監測網自身的資料發布時間(tw_post_time)
//    (全站資料每小時第 7 分才發布,直接以本地時鐘推整點會查到尚未發布的小時)
// 2) gis_ajax.aspx GetAQInfo            -> 全站 AQI(依發布時間整點)
// 3) ajax.aspx Target=GetCounty/GetSite -> 全站測站清單(站名/id/縣市)
// 4) Query/InsValue.aspx                -> 查頁表單預設日期(站端今日)
// 5) Query/InsValue.aspx/btnQueryClick  -> 批次小時值(AMB_TEMP 氣溫、RH 濕度)
//    需帶 x-requested-with / referer / origin 標頭,站端才認得是站內 ajax 查詢。
//
// 站名對應:小時值表以站名回傳,測站清單與 AQI 以測站 id,故以站名合併。
const AIR_BASE = 'https://airtw.moenv.gov.tw';
const airHeaders = Object.assign({}, options.headers, {
    'x-requested-with': 'XMLHttpRequest',
    'referer': AIR_BASE + '/cht/Query/InsValue.aspx',
    'origin': AIR_BASE
});

// 站端 ajax.aspx 表單端點(POST Target=xxx)
async function _air_post(target) {
    const response = await fetch(AIR_BASE + '/ajax.aspx', {
        method: 'POST',
        headers: Object.assign({ 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }, options.headers),
        body: 'Target=' + target
    });
    return JSON.parse((await response.text()).replace(/^\uFEFF/, ''));
}

async function _AIR_scraping() {
    // 1) 資料發布時間(全站資料每小時第 7 分才發布,須以站端時間為準)
    const sys = await _air_post('system_time');
    // 2) 全站 AQI
    const gisUrl = AIR_BASE + '/gis_ajax.aspx?Type=GetAQInfo&Layer=EPA&QueryTime=' +
        encodeURIComponent(sys.tw_post_time) + '&Language=';
    const gis = JSON.parse((await (await fetch(gisUrl, { headers: airHeaders })).text()).replace(/^\uFEFF/, ''));
    const aqiById = {};
    for (const g of gis) aqiById[g.SiteID] = g.AQI;
    // 3) 全站測站清單
    const counties = await _air_post('GetCounty&AreaID=&SiteID=');
    let sites = [];
    for (const c of counties) {
        const list = await _air_post('GetSite&County=' + c.Value);
        sites.push(...list.map(s => ({ siteid: s.Value, name: s.Name, county: c.Name })));
    }
    // 4) 查頁表單預設日期(站端今日)
    const pageHtml = await (await fetch(AIR_BASE + '/cht/Query/InsValue.aspx', { headers: airHeaders })).text();
    const st = pageHtml.match(/name="[^"]*txt_Stime"[^>]*value="([^"]+)"/)[1];
    const et = pageHtml.match(/name="[^"]*txt_Etime"[^>]*value="([^"]+)"/)[1];
    // 5) 批次小時值:氣溫(AMB_TEMP) + 濕度(RH)
    const qText = await (await fetch(AIR_BASE + '/cht/Query/InsValue.aspx/btnQueryClick', {
        method: 'POST',
        headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' }, airHeaders),
        body: JSON.stringify({
            siteList: sites.map(s => s.siteid).join(','),
            itemList: 'AMB_TEMP,RH',
            startTime: st, endTime: et,
            pageIndex: 0, pageSize: 1000
        })
    })).text();
    const query = JSON.parse(JSON.parse(qText.replace(/^\uFEFF/, '')).d);
    // 站名 -> { AMB_TEMP, RH }:取當日 23->00 時最近一筆有效值
    // (站端以 NA、#(儀器停機)、ｘ(人工)、Ａ(异常)、＊(無效) 標記不可靠值)
    const byName = {};
    if (query.Success) {
        const pad = n => (n < 10 ? '0' : '') + n;
        const INVALID = /[#ｘＡ＊]/;
        for (const row of query.Data) {
            let value = null;
            for (let h = 23; h >= 0; h--) {
                const cell = row[pad(h)];
                if (cell != null && cell !== '' && cell !== 'NA' && !INVALID.test(String(cell))) {
                    value = parseFloat(cell);
                    break;
                }
            }
            byName[row['測站']] = byName[row['測站']] || {};
            byName[row['測站']][row['測項']] = value;
        }
    }
    return sites.map(s => ({
        name: s.name,
        county: s.county,
        aqi: aqiById[s.siteid] || '',
        temperature: (byName[s.name] || {}).AMB_TEMP,
        humidity: (byName[s.name] || {}).RH
    }));
}
//////////////  Module Exports //////////////////
module.exports = {
	SM_scraping: _SM_scraping,
    IDB_scraping: _IDB_scraping,
    PMC_scraping: _PMC_scraping,
    TMBA_scraping: _TMBA_scraping,
    TIIP_scraping: _TIIP_scraping,
    AIR_scraping: _AIR_scraping
};