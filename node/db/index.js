let mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodejs', // 数据库名
});


// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error(`链接数据库错误: ${err.stack}`);
        return;
    }
    console.log(`链接数据库成功! 连接id: ${connection.threadId}`);

    /*  if (err) {
         console.error('无法连接到数据库:', err);
     } else {
         console.log('成功连接到数据库');
         // 在这里可以进行数据库操作
         // 例如查询数据、插入数据等
     } */
});

// 结束连接（在完成数据库操作后）
/* connection.end((err) => {
    if (err) {
        console.error('无法关闭数据库连接:', err);
    } else {
        console.log('成功关闭数据库连接');
    }
}); */

module.exports = connection;