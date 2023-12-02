const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsp = require('fs/promises');
const zlib = require('zlib');

let bitIdx = 0;
let byteIdx = 0;

function getBit(data) {
    let value = (data[byteIdx] >> (7 - bitIdx)) & 0x01;

    if(++bitIdx == 8) {
        bitIdx = 0;
        ++byteIdx;
    }

    return value;
}

function uBits(data, bitCount)
{
    let value = 0;

    while (--bitCount >= 0)
        value = value << 1 | getBit(data, byteIdx);
    return value;
}

function sBits(data, bitCount)
{
    let value = getBit(data, byteIdx) == 0 ? 0 : -1;
    --bitCount;

    while (--bitCount >= 0)
        value = value << 1 | getBit(data, byteIdx);
    return value;
}

function getDimensions(data) {
    let nBits = uBits(data, 5);

    sBits(data, nBits);
    let w = sBits(data, nBits) / 20;

    sBits(data, nBits);
    let h = sBits(data, nBits) / 20;

	bitIdx = 0;
	byteIdx = 0;

    return [w, h];
}

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

		fs.readFile(path+file, (err, data) => {
			if(err) res.end('error\n200\n200');
		
			if(data.subarray(0,3).toString() == 'FWS') {
				let dims = getDimensions(data.subarray(8));
				res.end(`${file}\n${dims[0]}\n${dims[1]}`);
			} else if(data.subarray(0,3).toString() == 'CWS') {
				zlib.inflate(data.subarray(8), (err, data) => {
					if(err) res.end('error\n200\n200');
		
					let dims = getDimensions(data);
					res.end(`${file}\n${dims[0]}\n${dims[1]}`);
				});
			} else {
				res.end('error\n200\n200');
			}
		});
	});
});

module.exports = router;

