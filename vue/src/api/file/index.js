import request from "../request.js";


export function upload(data) {
    return request({
        url: "/api/upload/img",
        method: "post",
        data: data
    })
}