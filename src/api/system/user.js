import request from "@/api/http.js"

export function getPage(query) {
    return request.get("/system/user/page", {
        params: query
    })
}

export function getById(id) {
    return request.get("/system/user/" + id)
}

export function create(data) {
    return request.post("/system/user", data)
}

export function update(data) {
    return request.put("/system/user", data)
}

export function del(id) {
    let param = Array.isArray(id) ? id.join(",") : id
    return request.delete("/system/user", {
        params: {id: param}
    })
}

export function resetPwd(id) {
    return request.post(`/system/user/${id}/resetPassword`)
}

export function getSelf() {
    return request.get("/system/user/own")
}
