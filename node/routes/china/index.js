/**
 * 无用文件  可删除
 */
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
let express = require('express')
let ChinaRouter = express.Router()
let db = require('../../db/index')

ChinaRouter.get('/china', function (req, res, next) {
    let result = {}
    db.query('SELECT * FROM `users`', function (error, results, fields) {
        result = {
            data: {
                code: 200,
                msg: '查询成功',
                list: results
            }
        }
        res.send(result)
    })
})

ChinaRouter.post('/china/datalist', jsonParser, (req, res) => {
    console.log('进入来了', req);
    const { name, age } = req.body
    console.log('req', name);
    console.log('req', age);
    //console.log('res', res);
    res.send('拿到了数据' + name + ":" + age)
})

module.exports = ChinaRouter