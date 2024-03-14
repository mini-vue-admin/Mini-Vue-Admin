import request from "@/api/http.js"

export function getTree(params) {
    return request.get('/system/dept/tree', {params: params})
}


export function getById(id) {
    return request.get("/system/dept/" + id)
}

export function create(data) {
    return request.post("/system/dept", data)
}

export function update(data) {
    return request.put("/system/dept", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/dept", {
        params: {id: param}
    })
}

export function addMember(deptId, userId) {
    return request.post("/system/dept/member", {deptId: deptId, memberId: userId})
}

export function delMember(deptId, userId) {
    let param = Array.isArray(userId) ? userId.join(",") : userId
    return request.delete("/system/dept/member", {
        params: {memberId: param, deptId: deptId}
    })
}