'use strict';
const express = require('express');
const router = express.Router();

let m_status = {
    isalive: false,
    online: 'OFFLINE'
};

let m_statistics = {
    users: {
        counts: 0
    }
};

let m_retainTimer;

/****************************************************/
//                    G E T                         //
/****************************************************/

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /pokedc'
    });
});

/**
 * @swagger
 *
 * /pokedc/status:
 *   get:
 *     tags:
 *       - PokeDC
 *     description: 取得伺服器狀態
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/status', (req, res, next) => {
    res.status(200).json(m_status);
});

/**
 * @swagger
 *
 * /pokedc/statistics/users:
 *   get:
 *     tags:
 *       - PokeDC
 *     description: 取得波可小妹ロボ所在群組的使用總人數
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/statistics/users', (req, res, next) => {
    res.status(200).json(m_statistics.users);
});

/****************************************************/
//                    P O S T                       //
/****************************************************/

/**
 * @swagger
 *
 * /pokedc/status:
 *   post:
 *     tags:
 *       - PokeDC
 *     description: 設定伺服器狀態
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isalive
 *         description: 設定伺服器是否活著
 *         in: formData
 *         required: true
 *         type: string
 *       - name: online
 *         description: 依照伺服器狀態，顯示字串設定
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: OK
 */
router.post('/status', (req, res, next) => {
    const status = {
        isalive: req.body.isalive,
        online: req.body.online
    };

    m_status = status;

    res.status(201).json({
        message: 'Handling POST requests to /pokedc/status',
        createdStatus: status
    });

    if (m_retainTimer) clearTimeout(m_retainTimer);
    m_retainTimer = setTimeout(() => {
        m_status.isalive = false;
        m_status.online = 'OFFLINE';
        //console.log('[pokedc] setTimeout()...reload-alive');
        process.stdout.write('ó');
    }, 3 * 60 * 1000, 'reload-alive'); // 3 mins
});

/**
 * @swagger
 *
 * /pokedc/statistics/users:
 *   post:
 *     tags:
 *       - PokeDC
 *     description: 設定波可妹妹ロボ所使用群組的總人數
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: counts
 *         description: 總人數
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       201:
 *         description: OK
 */
router.post('/statistics/users', (req, res, next) => {
    const users = {
        counts: req.body.counts
    };

    m_statistics.users = users;

    res.status(201).json({
        message: 'Handling POST requests to /pokedc/statistics/users',
        createdStatus: users
    });
});

module.exports = router;