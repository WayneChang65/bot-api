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
        message: 'Handling GET requests to /tosmm'
    });
});

router.get('/status', (req, res, next) => {
    res.status(200).json(m_status);
});

router.get('/statistics', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tosmm/statistics'
    });
});

router.get('/statistics/groups', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /tosmm/statistics/groups'
    });
});

router.get('/statistics/users', (req, res, next) => {
    res.status(200).json(m_statistics.users);
});

/****************************************************/
//                    P O S T                       //
/****************************************************/

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

router.post('/statistics/users', (req, res, next) => {
    const users = {
        conuts: req.body.counts
    };

    m_statistics.users = users;

    res.status(201).json({
        message: 'Handling POST requests to /tosmm/statistics/users',
        createdStatus: users
    });
});

module.exports = router;