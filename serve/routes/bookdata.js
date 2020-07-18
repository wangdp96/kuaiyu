//引入express模块
const express=require('express');
//引入数据库连接池模块
const pool=require('../pool.js');
//创建路由，命名为bookdata
const bookdata=express.Router();

//-----------------数据接口----------------
//查询一级分类的种类与数量

bookdata.get('/book_classification1',(req,res)=>{
	let book_classification = [];
	pool.query('select DISTINCT book_classification1 from bookmall_booksdata',(err,result)=>{
		if(err) throw err;
		for(let i=0;i<result.length;i++) {
			let title = {
				title: result[i].book_classification1
			};
			book_classification.push(title);
			pool.query('select DISTINCT book_classification2 from bookmall_booksdata where book_classification1= ?',[book_classification[i].title],(err,result2)=>{
				if(err) throw err;
				book_classification[i].content = [];
				for(let n=0;n<result2.length;n++) {
					book_classification[i].content.push(result2[n].book_classification2);
				}
				// console.log(book_classification);
				// console.log(i,result.length-1);
				for(var m=0,x=0;m<result.length;m++) {
					if(book_classification[m].content) {
						x++;
					}
				}
				if(x == result.length) {
					res.send(book_classification);
				}
			});
		}
	});
});

//查询首页新书推荐的相关数据
bookdata.get('/book_index_newbooks',(req,res)=>{
	let sql = 'select bid,book_name,book_cover from bookmall_booksdata where bid in (select new_bid from bookmall_index_newbooks) order by rand()';
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
//查询首页热门推荐的相关数据
bookdata.get('/bookmall_index_recommendation',(req,res)=>{
	let sql = 'select bid,book_name,book_cover from bookmall_booksdata where bid in (select rec_bid from bookmall_index_recommendation) order by rand()';
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
//查询首页独家推送的相关数据
bookdata.get('/bookmall_index_exclusive',(req,res)=>{
	let sql = 'select bid,book_name,book_author,book_cover,book_details from bookmall_booksdata where bid in (select exc_bid from bookmall_index_exclusive) order by rand()';
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
//首页banner3查询接口
bookdata.get('/banner3_results',(req,res)=>{
	let obj = req.query;
	let $banner3_classification1 = obj.banner3_classification1;
	let $banner3_classification2 = obj.banner3_classification2 ? obj.banner3_classification2: '%';
	let sql = `select bid,book_name,book_author,book_price,book_date,book_press,book_cover from bookmall_booksdata where book_classification1 = ? AND book_classification2 like ? order by rand() LIMIT 15`;
	pool.query(sql,[$banner3_classification1,('%'+$banner3_classification2+'%')],(err,result)=>{
		if(err) throw err;
		res.send(result);
	})
});
//查询页查询所有接口
bookdata.get('/search_all',(req,res)=>{
	let obj = req.query;
	let $book_classification1 = obj.book_classification1;
	let $book_classification2 = obj.book_classification2;
	let $price_start = obj.price_start;
	let $price_end = obj.price_end;
	let $book_author = obj.book_author;
	let $book_press = obj.book_press;
	let $result_page = obj.result_page;
	let sql = `select bid,book_name,book_author,book_price,book_date,book_press,book_cover,book_details from bookmall_booksdata where book_classification1 like ? AND book_classification2 like ? AND book_author like ? AND book_press like ? AND (book_price BETWEEN ? AND ?) LIMIT ${($result_page-1)*5},5`;
	pool.query(sql,[('%'+$book_classification1+'%'),('%'+$book_classification2+'%'),('%'+$book_author+'%'),('%'+$book_press+'%'),$price_start,$price_end],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
//查询页查询所有的结果的长度的接口
bookdata.get('/search_all_length',(req,res)=>{
	let obj = req.query;
	let $book_classification1 = obj.book_classification1;
	let $book_classification2 = obj.book_classification2;
	let $price_start = obj.price_start;
	let $price_end = obj.price_end;
	let $book_author = obj.book_author;
	let $book_press = obj.book_press;
	let sql = `select bid from bookmall_booksdata where book_classification1 like ? AND book_classification2 like ? AND book_author like ? AND book_press like ? AND (book_price BETWEEN ? AND ?) order by rand()`;
	pool.query(sql,[('%'+$book_classification1+'%'),('%'+$book_classification2+'%'),('%'+$book_author+'%'),('%'+$book_press+'%'),$price_start,$price_end],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
//查询页执行根据一级、二级分类以及价格查询作者
bookdata.get('/search_author',(req,res)=>{
	let obj = req.query;
	let $book_classification1 = obj.book_classification1;
	let $book_classification2 = obj.book_classification2;
	let $price_start = obj.price_start;
	let $price_end = obj.price_end;
	let sql = `select DISTINCT  book_author from bookmall_booksdata where book_classification1 like ? AND book_classification2 like ? AND (book_price BETWEEN ? AND ?) order by rand() LIMIT 4`;
	pool.query(sql,[('%'+$book_classification1+'%'),('%'+$book_classification2+'%'),$price_start,$price_end],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
//查询页执行根据一级、二级分类以及价格查询作者
bookdata.get('/search_press',(req,res)=>{
	let obj = req.query;
	let $book_classification1 = obj.book_classification1;
	let $book_classification2 = obj.book_classification2;
	let $price_start = obj.price_start;
	let $price_end = obj.price_end;
	let sql = `select DISTINCT  book_press from bookmall_booksdata where book_classification1 like ? AND book_classification2 like ? AND (book_price BETWEEN ? AND ?) order by rand() LIMIT 5`;
	pool.query(sql,[('%'+$book_classification1+'%'),('%'+$book_classification2+'%'),$price_start,$price_end],(err,result)=>{
		if(err) throw err;
		res.send(result);
	});
});
//----------------------------------------

//导出路由模块
module.exports=bookdata;