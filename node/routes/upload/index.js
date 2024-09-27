const fs = require("fs")
let express = require('express')
const uploadRouter = express.Router()
let db = require('../../db/index') // 数据库
// 1. 引入依赖
const multer = require('multer')
// 图片名称
let iamgeName = ""

// 设置存储引擎
const storage = multer.diskStorage({
    // 设置储存位置
    destination: function (req, file, cb) {
        cb(null, 'public/gallery/');
    },
    // 设置图片名称
    filename: function (req, file, cb) {
        console.log('filefile', file);
        // 图片名称
        iamgeName = file.fieldname + '_' + Date.now() + '.png'
        cb(null, iamgeName);
    }
});

// 配置Multer
const upload = multer({ storage: storage });

// 上传图库
/**
 * @api {post} /api/upload/img 上传图片
 * @apiGroup 图片
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccess {Object} file 文件
 * @apiParamExample  {type} 请求示例
 * {
 *     file:{},
 * }
 * 
 * @apiSuccessExample  {type} 响应示例
 * {
 *     code: 200,
 *     msg: "图片上传成功",
 * }
 */
uploadRouter.post('/api/upload/img', upload.single('file'), (req, res, next) => {
    // 获取上传的文件信息
    const file = req.file;
    // 如果没有文件
    if (!file) {
        return res.status(400).send('No file uploaded.');
    } else {
        let img_url = `http://localhost:3000/` + 'public/gallery/' + req.file.filename
        let img_name = req.file.filename
        // const querySql = 'INSERT INTO `gallery`(`img_url`) VALUES (?)';
        const querySql = 'INSERT INTO `gallery`(`img_url` , `img_name`) VALUES (?,?)';
        db.query(querySql, [img_url, img_name], (err, results, fields) => {
            if (err) {
                res.send({
                    code: 101,
                    msg: "图片上传失败"
                })
            } else {
                res.send({
                    code: 200,
                    msg: "图片上传成功"
                })
            }
        })
    }
})

// 查询图库
/**
 * @api {get} /api/upload/getImg 查询图片
 * @apiGroup 图片
 * @apiParamExample  {type} 请求示例:
 * {
 *    pageNumber:1,
 *    pageSize:10,
 * }
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 查询成功
 * @apiSuccess {Number} pageNumber 页
 * @apiSuccess {Number} pageSize 每页的数量
 * @apiSuccess {Object} list 查询信息 
 * @apiSuccess {Object} total 查询信息 
 * @apiSuccessExample {type} 响应示例:
 * {
 *  code: 200,
 *  msg: '查询成功',
 *  list: [{
 *    id: Number,
 *    img_name: String,
 *    img_url: String,
 *  },
 *  {
 *     ...
 *  }
 * }],
 *  total: {
 *      pageNumber:String,
 *      pageSize: String ,
 *      total:Number
 * }
 */
// 定义路由，当接收到 GET 请求到 /api/upload/getImg 路径时执行以下回调函数
uploadRouter.get('/api/upload/getImg', (req, res, next) => {
    // 从请求的查询参数中获取页码和每页数量
    const { pageNumber, pageSize } = req.query;
    // 查询 gallery 表中数据的总数的 SQL 语句
    const countQuerySql = 'SELECT COUNT(*) AS totalCount FROM `gallery`';
    // 根据页码和每页数量查询对应数据的 SQL 语句
    const querySql = `SELECT * FROM gallery LIMIT ${(pageNumber - 1) * pageSize}, ${pageSize}`;

    // 执行查询总数的 SQL 语句
    db.query(countQuerySql, (countErr, countResults) => {
        // 如果查询总数出错
        if (countErr) {
            // 返回错误信息，状态码为 101，表示获取总记录数失败
            return res.send({ code: 101, msg: "获取总记录数失败", list: countErr });
        }
        // 获取总数
        const totalCount = countResults[0].totalCount;

        // 执行查询数据的 SQL 语句
        db.query(querySql, (err, results, fields) => {
            // 如果查询数据出错
            if (err) {
                // 返回错误信息，状态码为 101，表示获取数据失败
                return res.send({ code: 101, msg: "获取数据失败", list: err });
            }
            // 返回查询结果，状态码为 200，表示查询数据成功
            // 包含查询到的数据列表，以及分页相关信息（总页数、当前页码、每页数量）
            res.send({
                code: 200,
                msg: "查询数据成功",
                list: results,
                total: {
                    pageNumber: Number(pageNumber),
                    pageSize: Number(pageSize),
                    total: totalCount
                }
            });
        });
    });
});


// 删除图片
/**
 * @api {delete} /api/upload/delimg 删除图片
 * @apiGroup 图片
 * @apiParamExample  {type} 请求示例:
 * {
 *    id:Number,
 *    img_name:String,
 * }
 * 
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 查询成功
 * @apiSuccess {Number} id 删除的图片ID
 * @apiSuccess {String} img_name 删除的图片名称
 * @apiSuccessExample {type} 响应示例:
 * {
 *  code: 200,
 *  msg: '删除图片成功',
 * }
 */
uploadRouter.delete('/api/upload/delimg', (req, res, next) => {
    const { id, img_name } = req.body
    // 删除文件数据
    let fl_url = `./public/gallery/${img_name}`
    fs.unlinkSync(fl_url, (err) => {
        if (err) {
            console.log('删除失败', err);
        } else {
            console.log('删除成功');
        }
    })
    // 删除数据库的数据
    // 删除需要用到的语句格式大致为DELETE FROM <表名> WHERE <条件>;
    const querySql = 'DELETE FROM `gallery` WHERE `id`=?'
    db.query(querySql, [id], (err, results, fields) => {
        if (err) {
            res.send({
                code: 101,
                msg: '删除图片失败'
            })
        } else {
            res.send({
                code: 200,
                msg: '删除图片成功'
            })
        }
    })

})

module.exports = uploadRouter