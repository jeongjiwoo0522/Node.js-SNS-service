const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const session = require("express-session");
const passport = require("passport");
const fs = require("fs");

dotenv.config();

const  { sequelize } = require("./models");
const indexRouter = require('./routes/index');
const authRouter = require("./routes/auth");
const passportConfig = require("./passport");

const app = express();

passportConfig();

try {
    fs.readdirSync("uploads");
} catch(err) {
    console.log("uploads 폴더 생성");
    fs.mkdirSync("uploads");
}

app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => console.log("데이터 베이스 연결 성공"))
    .catch(console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
