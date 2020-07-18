//加载Express模块
const express = require( 'express' );

//加载cors模块
const cors = require( 'cors' );

//加载MySQL模块
const mysql = require( 'mysql' );

//加载body-parser模块
const bodyParser = require( 'body-parser' );

//加载md5模块
const md5 = require('md5');



//----------------引入路由器模块----------------------------
//用户注册模块
const user_reg=require('./routes/user_reg.js');
//用户登录模块
const user_login=require('./routes/user_login.js');
//书籍信息模块
const bookdata=require('./routes/bookdata.js');
//---------------------------------------------------------

//创建Express应用
const server = express();

//设置web服务器端口号为8080
server.listen(8000);

//使用cors模块
server.use(cors({
    origin:['http://127.0.0.1:8080','http://localhost:8080']
}));

//使用body-parser模块
server.use(bodyParser.urlencoded({
    extended:false
}));

//--------------------挂载路由器-----------------------------
//用户注册
server.use('/user_reg',user_reg);
//用户登录
server.use('/user_login',user_login);
//书籍信息
server.use('/bookdata',bookdata);