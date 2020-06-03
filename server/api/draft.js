const express = require('express');


const router = express.Router();

router.post('/p1/:param1', (req, res) => {
    p1 = req.params.param1;
    
    res.send(`Received p1 as ${p1}`);
});

router.post('/p2/:param2', (req, res) => {
    p2 = req.params.param2;
    
    res.send(`Received p2 as ${p2}`);
});

module.exports = router;



