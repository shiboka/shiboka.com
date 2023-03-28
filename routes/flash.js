const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsp = require('fs/promises');
const { exec } = require('child_process');

router.get('/', async (req, res, next) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const path = 'public/flash/';

	if(url.search == '') {
		let files = await fsp.readdir(path);
		files = files.filter(file => /\.swf$/.test(file));
		res.render('flash', { files: files });
		return;
	}

	const file = url.searchParams.get('f');

	if(!file) {
		res.end('error\n200\n200');
		return;
	}

	fs.access(path+file, err => {
		if(err || !/.+\.swf$/.test(file)) {
			res.end('error\n200\n200');
			return;
		}

		fs.rename(path+file, path+'a.swf', err => {
			exec(`swfdump -XY ${path}a.swf`, (err, stdout, stderr) => {
				const match = stdout.match(/-X ([0-9]+) -Y ([0-9]+)/);
				fs.rename(path+'a.swf', path+file, err => {
						res.end(`${file}\n${match[1]}\n${match[2]}`);
				});
			});
		});
	});
});

module.exports = router;

