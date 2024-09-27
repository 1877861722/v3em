let express = require('express')
const UserRouter = express.Router()

let db = require('../../db/index') // 数据库

// 获取用户数据
/**
 * @api {get} /api/user/inforList 获取用户
 * @apiName 用户信息
 * @apiGroup 用户
 * @apiParamExample  {type} 请求示例:
 * {
 *    pageNumber:1,
 *    pageSize:10,
 * }
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 查询成功
 * @apiSuccess {Array} list 查询的用户信息
 * @apiSuccess {Object} total 查询信息 
 * @apiSuccessExample {type} 响应示例:
 * {
 *  code: 200,
 *  msg: '查询成功',
 *  list: [{
 *    id: Number,
 *    name: String,
 *    userName: String,
 *    passWord: String,
 *    introduction: String,
 *  },
 *  {
 *     ...
 *  }
 * }],
 *  total: {
 *      pageNumber:String,
 *      pageSize: String ,
 *      pages:Number
 * }
 */
UserRouter.get('/api/users/inforList', (req, res, next) => {
    let pages = {
        pageNumber: null,
        pageSize: null,
        total: null
    }
    const { pageNumber, pageSize } = req.query
    // 先获取总数
    // 查询users表中有多少条数据
    const querySql1 = `SELECT COUNT(*) FROM users`
    db.query(querySql1, (err, results, fields) => {
        if (err) {
            pages = {
                pageNumber: Number(pageNumber),
                pageSize: Number(pageSize),
                total: null
            }
        } else {
            pages = {
                pageNumber: Number(pageNumber),
                pageSize: Number(pageSize),
                total: results[0]['COUNT(*)']
            }
        }
    })

    // 根据页码和每页数量查询对应数据的 SQL 语句
    const querySql2 = `SELECT * FROM users LIMIT ${(pageNumber - 1) * pageSize}, ${pageSize}`;
    db.query(querySql2, (err, results, fields) => {
        if (err) {
            res.send({
                code: 101,
                msg: '查询失败,请传入查询分页数据',
                list: [],
                total: pages
            })
        } else {
            res.send({
                code: 200,
                msg: '查询成功',
                list: results,
                total: pages
            })
        }

    })
})

// 添加用户数据
/**
 * @api {post} /api/users/addUser 添加用户
 * @apiGroup 用户
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccess {String} userName 账号
 * @apiSuccess {String} passWord 密码
 * @apiSuccess {String} name 名称
 * @apiSuccess {String} introduction 简介
 * @apiParamExample  {type} 请求示例
 * {
 *     name:"名称",
 *     userName: "***",
 *     passWord: "****",
 *     introduction:"简介"
 * }
 * 
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200,
 *     msg: "添加成功",
 *     data: {
 *              name: '**',
 *              userName: '**',
 *              passWord: '**',
 *              introduction: '**',
 *              ...
 *            }
 * }
 */
UserRouter.post('/api/users/addUser', (req, res, next) => {
    let result
    const { name, userName, passWord, introduction } = req.body
    // INSERT INTO <表名>(<字段1,字段2,...>) VALUES (值1,);
    // 准备 SQL 查询语句，使用参数化查询，? 表示参数占位符
    const querySql = 'INSERT INTO `users`(`name`, `userName`,`passWord`,`introduction`) VALUES (?,?,?,?)';
    db.query(querySql, [name, userName, passWord, introduction], function (err, results, fields) {
        if (err) {
            result = {
                code: 101,
                msg: '添加用户失败',
                data: {
                    info: err
                }
            }
        };
        result = {
            code: 200,
            msg: '添加成功',
            data: {
                name: name,
                userName: userName,
                passWord: passWord,
                introduction: introduction,
            }
        }

        res.send(result)
    })
})

// 修改用户信息
/**
 * @api {post} /api/users/updataUser 修改用户
 * @apiGroup 用户
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccess {Number} id ID
 * @apiSuccess {String} name 名称
 * @apiSuccess {String} userName 账号
 * @apiSuccess {String} introduction 简介
 * @apiParamExample  {type} 请求示例
 * {
 *     id:1,
 *     name:"名称",
 *     userName: "***",
 *     introduction:"简介"
 * }
 * 
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200,
 *     msg: "修改成功",
 * }
 * 
 */
UserRouter.put('/api/users/updataUser', (req, res, next) => {
    let resData
    const { name, userName, introduction, id } = req.body
    // 修改需要用到的语句格式大致为UPDATE < 表名 > SET 字段1 = 值1, 字段2 = 值2 WHERE < 条件 >
    const querySql = 'UPDATE `users` SET `name` = ?,`userName`=? , `introduction`=? WHERE `id` = ?';
    db.query(querySql, [name, userName, introduction, id], (err, results, fields) => {
        if (err) {
            resData = {
                code: 101,
                msg: "修改失败",
                data: err
            }
        }
        resData = {
            code: 200,
            msg: '修改成功'
        }
        res.send(resData)
    })
})

// 删除用户信息
/**
 * @api {delete} /api/users/deleteUser 删除用户
 * @apiGroup 用户
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccess {Number} id ID
 * @apiParamExample  {type} 请求示例
 * {
 *     id:1,
 * }
 * 
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200,
 *     msg: "删除成功",
 * }
 * 
 */
UserRouter.delete('/api/users/deleteUser', (req, res, next) => {
    let resData
    const { id } = req.body
    // 删除需要用到的语句格式大致为DELETE FROM <表名> WHERE <条件>;
    const querySql = 'DELETE FROM `users` WHERE `id`=?'
    db.query(querySql, [id], (err, results, fields) => {
        if (err) {
            resData = {
                code: 101,
                msg: "删除失败",
                data: err
            }
        }
        resData = {
            code: 200,
            msg: "删除成功",
        }
        res.send(resData)
    })
})

// 设置用户默认密码
/**
 * @api {post} /api/users/setWord 设置用户默认密码
 * @apiGroup 用户
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccess {Number} id ID
 * @apiParamExample  {type} 请求示例
 * {
 *     id:1,
 * }
 * 
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200,
 *     msg: "恢复密码成功！",
 * }
 * 
 */
UserRouter.post('/api/users/setWord', (req, res, next) => {
    const { id } = req.body
    // 修改需要用到的语句格式大致为UPDATE < 表名 > SET 字段1 = 值1, 字段2 = 值2 WHERE < 条件 >
    const querySql = 'UPDATE `users` SET `passWord` = 123456 WHERE `id` = ?';
    db.query(querySql, [id], (err, results, fields) => {
        if (err) {
            res.send({
                code: 101,
                msg: "修改密码失败！",
            })
        }

        res.send({
            code: 200,
            msg: "恢复密码成功！"
        })
    })
})

module.exports = UserRouter