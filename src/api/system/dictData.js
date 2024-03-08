import request from "@/api/http.js"

export function getPage(query) {
    return request.get("/system/dictData/page", {
        params: query
    })
}

export function getList(query) {
    return request.get("/system/dictData/list", {
        params: query
    })
}

export function getById(id) {
    return request.get("/system/dictData/" + id)
}

export function create(data) {
    return request.post("/system/dictData", data)
}

export function update(data) {
    return request.put("/system/dictData", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/dictData", {
        params: {id: param}
    })
}