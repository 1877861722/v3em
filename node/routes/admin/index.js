let jwt = require('jsonwebtoken')
const secretKey = require('../../public/uilt/key') // 密钥
let express = require('express')
const AdminRouter = express.Router()
let db = require('../../db/index')


// 登录接口
/**
 * @api {post} /api/login 登录接口
 * @apiName 登录信息
 * @apiGroup 登录
 * @apiParamExample  {type} 请求示例
 * {
 *     userName: "admin",
 *     passWord: "123456"
 * }
 *
 * @apiSuccess {String} userName 账号
 * @apiSuccess {String} passWord 密码
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 登录成功
 * @apiSuccess {String} token Token
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200, 
 *     mas: "登录成功",
 *     token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.********************.1SBBF9QroNN60yjKvrRodpR4zGPxehik-3IxHS7_O2E"
 * }
 *
 */
AdminRouter.post("/api/login", (req, res, next) => {
    const { userName, passWord } = req.body
    console.log(userName);
    console.log(passWord);
    let result = {}
    let querySql = 'SELECT * FROM admin';
    db.query(querySql, (error, results, fields) => {
        if (error) {
            result = {
                code: 101,
                msg: '登录失败',
                data: {
                    info: err
                }
            }
        }
        if (userName !== results[0].userName || passWord !== results[0].passWord) {
            result = {
                code: 400,
                msg: '账号或密码错误！',
            }
        } else {
            // 登录成功
            // 格式：jwt.sign({用户信息}，密钥，token有效时长)
            let tokenStr = jwt.sign({ userName: userName }, secretKey, { expiresIn: '2h' })
            result = {
                code: 200,
                msg: '登录成功',
                token: tokenStr
            }
        }
        res.send(result)
    })

})

// 获取管理信息
/**
 * @api {get} /api/admin/getAdmin 获取管理信息
 * @apiGroup 登录
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 登录成功
 * @apiSuccess {Object} data 查询信息
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200, 
 *     mas: "获取成功",
 *     data:{
 *          id:1, // ID
 *          avatar:"", // 头像
 *          name:"", // 名称
 *          userName:"",// 登录账号
 *          passWord:"", // 密码
 *          introduction:"", // 简介
 *      }
 * }
 *
 */
AdminRouter.get('/api/admin/getAdmin', (req, res, next) => {
    let result = {}
    let querySql = 'SELECT * FROM admin';
    db.query(querySql, (err, results, fields) => {
        if (err) {
            result = {
                code: 101,
                msg: '获取失败',
                data: err
            }
        }

        result = {
            code: 200,
            msg: '获取成功',
            data: results[0]
        }

        res.send(result)
    })
})

// 修改管理员信息
/**
 * @api {put} /api/admin/putAdmin 修改管理员信息
 * @apiGroup 登录
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} id ID
 * @apiSuccess {String} name 用户名
 * @apiSuccess {String} avatar 头像
 * @apiSuccess {String} introduction 简介
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200, 
 *     mas: "修改成功",
 * }
 *
 */
AdminRouter.put('/api/admin/putAdmin', (req, res, next) => {
    const { name, introduction, avatar, id } = req.body
    const querySql = 'UPDATE `admin` SET `name` = ?,`introduction`=? ,`avatar`=? WHERE `id`= ?';
    db.query(querySql, [name, introduction, avatar, id], (err, results, fields) => {
        if (err) {
            res.send({
                code: 101,
                msg: "修改失败",
                data: err
            })
        }
        res.send({
            code: 200,
            msg: "修改成功",
        })
    })
})

// 修改管理员密码
/**
 * @api {post} /api/admin/changepassword 修改管理员密码
 * @apiGroup 登录
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {Number} id ID
 * @apiSuccess {String} oldPassword 旧密码
 * @apiSuccess {String} newPassword 新密码
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200, 
 *     mas: "密码修改成功",
 * }
 *
 */
AdminRouter.post('/api/admin/changepassword', (req, res, next) => {
    const { oldPassword, newPassword, id } = req.body
    let sendData = {}
    // 查询数据库
    let querySql1 = 'SELECT * FROM admin'
    // 修改密码
    let querySql2 = 'UPDATE `admin` SET `passWord`=? WHERE `id`=?'
    db.query(querySql1, (err1, results1, fields) => {
        if (err1) {
            sendData = {
                code: 101,
                msg: '数据库查询失败'
            }
            res.send(sendData)
        } else {
            // 对比密码
            if (results1[0].passWord == oldPassword) {
                db.query(querySql2, [newPassword, id], (err2, results2, fields) => {
                    if (err2) {
                        sendData = {
                            code: 101,
                            msg: '密码修改失败'
                        }
                        res.send(sendData)
                    } else {
                        sendData = {
                            code: 200,
                            msg: '密码修改成功'
                        }
                        res.send(sendData)
                    }
                })
            } else {
                sendData = {
                    code: 101,
                    msg: '原密码匹配错误'
                }
                res.send(sendData)
            }
        }
    })

})

module.exports = AdminRouter