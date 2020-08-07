const express = require('express');
const router = express.Router();

let m_status = {
    isalive: false
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
        isalive: req.body.isalive
    };

    m_status = status;

    res.status(201).json({
        message: 'Handling POST requests to /tosmm/status',
        createdStatus: status
    });

    if (m_retainTimer) clearTimeout(m_retainTimer);
    m_retainTimer = setTimeout(() => {
        m_status.isalive = false;
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
/*
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});
*/
/*
router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});
*/
/*
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});
*/

/*
setInterval(() => {
    m_status.isalive = false;
    //console.log('[tosmm] setTimeout()...reload-alive');
    process.stdout.write('ò');
}, 20 * 1000, 'reload-alive');
*/

module.exports = router;