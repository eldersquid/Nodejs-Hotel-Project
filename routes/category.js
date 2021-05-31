const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
    const title = 'Product Category';

    res.render('admin/productcat/view', {
        layout: "admin",
        title: title
    });

});

router.get('/create', (req, res) => {
    const title = 'Product Category';

    res.render('admin/productcat/create', {
        layout: "admin",
        title: title
    });
});

module.exports = router;