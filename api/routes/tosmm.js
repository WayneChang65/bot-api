const express = require('express');
const router = express.Router();
const fs = require('fs');
const basic_f = require('../../lib/basic_f.js');

const picPath = '/usr/share/httpd/noindex/images/lb_images/';

let m_status = {
    isalive: false,
    online: 'OFFLINE'
};

let m_statistics = {
    users: {
        counts: 0,
        active: 0
    },
    groups: {
        counts: 0,
        active: 0
    }
};

let m_retainTimer;

function getImageFolderFileName(_folder_with_abs_path, _callbackfun) {
    let filesInFolderCount = 0;
    fs.readdir(_folder_with_abs_path,
        function (err, files) { //讀取目錄檔案列表
            if (err) throw err;
            filesInFolderCount = files.length;
            if (filesInFolderCount != 0) {
                let minNum = 1;
                let maxNum = filesInFolderCount;
                let randN = basic_f.getRandom(minNum, maxNum);
                let pic_name = basic_f.numAddString0(randN, 4).toString() + '.jpg';
                _callbackfun(pic_name);
            } else {
                console.log('ERROR: No files here.');
                _callbackfun(undefined);
            }
        }
    );
}
/****************************************************/
//                    G E T                         //
/****************************************************/

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tosmm'
    });
});

/**
 * @swagger
 *
 * /tosmm/status:
 *   get:
 *     tags:
 *       - TosMM
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
 * /tosmm/statistics:
 *   get:
 *     tags:
 *       - TosMM
 *     description: 取得土司小妹ロボ統計訊息
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/statistics', (req, res, next) => {
    res.status(200).json(m_statistics);
});

/**
 * @swagger
 *
 * /tosmm/statistics/groups:
 *   get:
 *     tags:
 *       - TosMM
 *     description: 取得土司小妹ロボ被使用的總群組數
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/statistics/groups', (req, res, next) => {
    res.status(200).json(m_statistics.groups);
});

/**
 * @swagger
 *
 * /tosmm/statistics/users:
 *   get:
 *     tags:
 *       - TosMM
 *     description: 取得土司小妹ロボ被使用的總人數
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/statistics/users', (req, res, next) => {
    res.status(200).json(m_statistics.users);
});

/**
 * @swagger
 *
 * /tosmm/toro/tg:
 *   get:
 *     tags:
 *       - TosMM
 *     description: 抽美女
 *     produces:
 *       - images/gif
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/toro/tg', (req, res, next) => {
    let picFolderAbsPath = picPath + 'tg1_img';
    getImageFolderFileName(picFolderAbsPath,
        (pic_name) => {
            let options = {
                root: picFolderAbsPath,
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            }
            res.status(200).sendFile(pic_name, options, (err) => {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent:', pic_name);
                }
            });
        }
    );
});


/****************************************************/
//                    P O S T                       //
/****************************************************/

/**
 * @swagger
 *
 * /tosmm/status:
 *   post:
 *     tags:
 *       - TosMM
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
        message: 'Handling POST requests to /tosmm/status',
        createdStatus: status
    });

    if (m_retainTimer) clearTimeout(m_retainTimer);
    m_retainTimer = setTimeout(() => {
        m_status.isalive = false;
        m_status.online = 'OFFLINE';
        //console.log('[pokedc] setTimeout()...reload-alive');
        process.stdout.write('ò');
    }, 3 * 60 * 1000, 'reload-alive'); // 3 mins
});

router.post('/statistics', (req, res, next) => {
    let statistics;
    res.status(201).json({
        message: 'Handling POST requests to /tosmm/statistics',
        createdStatus: statistics
    });
});

/**
 * @swagger
 *
 * /tosmm/statistics/users:
 *   post:
 *     tags:
 *       - TosMM
 *     description: 設定土司小妹ロボ使用者統計訊息
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: counts
 *         description: 設定土司小妹ロボ被使用的總人數
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: active
 *         description: 設定土司小妹ロボ被使用的有效人數
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       201:
 *         description: OK
 */
router.post('/statistics/users', (req, res, next) => {
    const users = {
        counts: req.body.counts,
        active: req.body.active
    };

    m_statistics.users = users;

    res.status(201).json({
        message: 'Handling POST requests to /tosmm/statistics/users',
        createdStatus: users
    });
});

/**
 * @swagger
 *
 * /tosmm/statistics/groups:
 *   post:
 *     tags:
 *       - TosMM
 *     description: 設定土司小妹ロボ群組統計訊息
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: counts
 *         description: 設定土司小妹ロボ被使用的總群組數
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: active
 *         description: 設定土司小妹ロボ被使用的有效總群組數
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       201:
 *         description: OK
 */
router.post('/statistics/groups', (req, res, next) => {
    const groups = {
        counts: req.body.counts,
        active: req.body.active
    };

    m_statistics.groups = groups;

    res.status(201).json({
        message: 'Handling POST requests to /tosmm/statistics/groups',
        createdStatus: groups
    });
});

module.exports = router;