'use strict';
const express = require('express');
const router = express.Router();
const scCheerio = require('../../lib/scraping-cheerio.js');
const scPuppeteer = require('../../lib/scraping-puppeteer.js');
/****************************************************/
//                    G E T                         //
/****************************************************/

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /crawler'
    });
});

/**
 * @swagger
 *
 * /crawler/sm:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得智機辦網頁最新消息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/sm', async (req, res, next) => {
    let sm_data = await scCheerio.SM_scraping();
    res.status(200).json(sm_data);
});

/**
 * @swagger
 *
 * /crawler/idb:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得工業局網頁最新消息(cheerio)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/idb', async (req, res, next) => {
    let idb_data = await scCheerio.IDB_scraping();
    res.status(200).json(idb_data);
});

/**
 * @swagger
 *
 * /crawler/idb2:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得工業局網頁最新消息(puppeteer)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
 router.get('/idb2', async (req, res, next) => {
    try {
        let idb_data = await scPuppeteer.IDB_scraping();
        res.status(200).json(idb_data);
    } catch (error) {
        scPuppeteer.close();
    }
});

/**
 * @swagger
 *
 * /crawler/pmc:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得精機中心網頁最新消息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/pmc', async (req, res, next) => {
    let pmc_data = await scCheerio.PMC_scraping();
    res.status(200).json(pmc_data);
});

/**
 * @swagger
 *
 * /crawler/tmba:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得零組件工會網頁最新消息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
 router.get('/tmba', async (req, res, next) => {
    let tmba_data = await scCheerio.TMBA_scraping();
    res.status(200).json(tmba_data);
});

/**
 * @swagger
 *
 * /crawler/imc/allapps:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得智機雲所有app
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
 router.get('/imc/allapps', async (req, res, next) => {
    try {
        let imc_data = await scPuppeteer.IMC_scraping();
        res.status(200).json(imc_data);
    } catch (error) {
        scPuppeteer.close();
    }
});

module.exports = router;