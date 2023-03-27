const express = require('express');
const router = express.Router();
const fsp = require('fs/promises');

router.get('/', async (req, res, next) => {
	let files = await fsp.readdir('public/rrr/');
	files = files.filter(file => /\.(png|jpg)$/.test(file));
	res.render('rrr', { files: files });
});

module.exports = router;
