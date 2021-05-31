const express = require('express');
const router = express.Router();

router.get('/track', (req, res) => {
    const title = 'Order';

    res.render('admin/order/view', {
        layout: "admin",
        title: title
    });

});

router.get('/create', (req, res) => {
    const title = 'Order';

    res.render('admin/order/create', {
        layout: "admin",
        title: title
    });
});

module.exports = router;