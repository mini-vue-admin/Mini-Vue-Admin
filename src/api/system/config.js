import request from "@/api/http.js"

export function getPage(query) {
    return request.get("/system/config/page", {
        params: query
    })
}

export function getList(query) {
    return request.get("/system/config/list", {
        params: query
    })
}

export function getById(id) {
    return request.get("/system/config/" + id)
}

export function create(data) {
    return request.post("/system/config", data)
}

export function update(data) {
    return request.put("/system/config", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/config", {
        params: {id: param}
    })
}