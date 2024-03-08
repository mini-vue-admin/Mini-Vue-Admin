import request from "@/api/http.js"

export function getPage(query) {
    return request.get("/system/dictType/page", {
        params: query
    })
}

export function getList(query) {
    return request.get("/system/dictType/list", {
        params: query
    })
}

export function getById(id) {
    return request.get("/system/dictType/" + id)
}

export function create(data) {
    return request.post("/system/dictType", data)
}

export function update(data) {
    return request.put("/system/dictType", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/dictType", {
        params: {id: param}
    })
}