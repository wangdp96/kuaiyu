//引入express模块
const express=require('express');
//引入数据库连接池模块
const pool=require('../pool.js');
//创建路由，命名为user_reg
const user_reg=express.Router();

//-----------------数据接口----------------

//----------------------------------------

//导出路由模块
module.exports=user_reg;