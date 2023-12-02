const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const homeRouter = require('./routes/home');
const flashRouter = require('./routes/flash');
const rrrRouter = require('./routes/rrr');

const app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

// misc setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

/* ==================================================== */

// routes
app.use('/', homeRouter);
app.use('/flash', flashRouter);
app.use('/rrr', rrrRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	res.locals.status = err.status || 404;
	res.status(err.status || 404);
	res.render('err/404');
});

/* ==================================================== */


const credentials = {
	key: fs.readFileSync('/etc/letsencrypt/live/shiboka.com/privkey.pem', 'utf-8'),
	cert: fs.readFileSync('/etc/letsencrypt/live/shiboka.com/cert.pem', 'utf-8'),
	ca: fs.readFileSync('/etc/letsencrypt/live/shiboka.com/chain.pem', 'utf-8')
};


const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
