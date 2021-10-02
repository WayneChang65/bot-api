'use strict';
const express = require('express');
const router = express.Router();
const scraping = require('../../lib/scraping.js');
const scraping2 = require('../../lib/scraping2.js');

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
    let sm_data = await scraping.SM_scraping();
    res.status(200).json(sm_data);
});

/**
 * @swagger
 *
 * /crawler/idb:
 *   get:
 *     tags:
 *       - Crawler
 *     description: 取得工業局網頁最新消息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/idb', async (req, res, next) => {
    let idb_data = await scraping.IDB_scraping();
    res.status(200).json(idb_data);
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
    let pmc_data = await scraping.PMC_scraping();
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
    let tmba_data = await scraping.TMBA_scraping();
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
    let imc_data = await scraping2.IMC_scraping();
    res.status(200).json(imc_data);
});

module.exports = router;