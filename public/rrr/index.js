// variables for the image and canvas
let img;
let img_ref_ctx;
let cnv_ctx;
const width = 600;
let height;

// variables for the render loop
let interval;
const delay = 10;
const max_size = 80;
const min_size = 4;
const amp = 20;
let step;
let amount;
let size;

// the result of a lot of tinkering to see what looks/feels right
function renderPixels() {
	// weird little formula that makes the size decrease at a nice rate
	// don't decrease past the min_size
	if(!(step % (~~(max_size/size)*amp)) && size > min_size)
		size--;

	// increase amount of rects per 200 iterations
	if(!(step % 200))
		amount++;

	// this is as high as we need to count to
	// it would be max_size / 1 * amp
	if(step == max_size * amp)
		step = 0;

	// finally, draw the rects onto the canvas.
	for(let i = 0; i < amount; i++) {
		let x = ~~(Math.random() * width);
		let y = ~~(Math.random() * height);
		let pxl = img_ref_ctx.getImageData(x, y, 1, 1).data;
		cnv_ctx.fillStyle = `rgb(${pxl[0]}, ${pxl[1]}, ${pxl[2]})`;
		cnv_ctx.fillRect(x - size/2, y - size/2, size, size);
	}

	step++;
}

function load_img(file) {
	img = new Image();
	img.src = file;

	img.addEventListener('load', () => {
		// set up the canvas and draw the image
		height = ~~(img.height / (img.width / width));
		img_ref.width = width;
		img_ref.height = height;
		cnv.width = width;
		cnv.height = height;
		img_ref_ctx.drawImage(img, 0, 0, width, height);

		// construct array of pixel data from the image
		/*
		let pxls = new Array(height);
		for(let y = 0; y < height; y++) {
			pxls[y] = new Array(width);
			for(let x = 0; x < width; x++) {
				let pxl = ctx.getImageData(x, y, 1, 1).data;
				pxls[y][x] = { r: pxl[0], g: pxl[1], b: pxl[2] };
			}
		}
		*/

		// reset values for the render loop
		step = 0;
		amount = 1;
		size = max_size;

		// clear canvas and start render loop
		cnv_ctx.fillStyle = 'black';
		cnv_ctx.fillRect(0, 0, width, height);
		interval = window.setInterval(renderPixels, delay);
	});
}

window.addEventListener('hashchange', () => {
	clearInterval(interval);
	load_img(decodeURIComponent(location.hash.slice(1)));
});

window.addEventListener('DOMContentLoaded', () => {
	const img_ref = document.getElementById('img_ref');
	img_ref_ctx = img_ref.getContext('2d');

	const cnv = document.getElementById('cnv');
	cnv_ctx = cnv.getContext('2d');

	if(location.hash) {
		window.dispatchEvent(new Event('hashchange'));
		return;
	}

	const images = document.getElementsByClassName('img');
	const rand = ~~(Math.random() * images.length);
	load_img(images[rand].textContent);
});

