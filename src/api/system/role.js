import request from "@/api/http.js"

export function getPage(query) {
    return request.get("/system/role/page", {
        params: query
    })
}

export function getList(query) {
    return request.get("/system/role/list", {
        params: query
    })
}

export function getById(id) {
    return request.get("/system/role/" + id)
}

export function create(data) {
    return request.post("/system/role", data)
}

export function update(data) {
    return request.put("/system/role", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/role", {
        params: {id: param}
    })
}