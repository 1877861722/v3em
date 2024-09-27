import request from "../request.js";

// 获取图片数据列表
export function getGalleryData(data) {
    return request({
        url: `/api/upload/getImg?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
        method: 'get'
    })
}

// 删除图片
export function deleteImgData(data) {
    return request({
        url: `/api/upload/delimg`,
        method: 'delete',
        data
    })
}