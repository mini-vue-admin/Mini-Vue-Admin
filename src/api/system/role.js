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

export function getMemberPage(params) {
    return request.get("/system/role/member", {params: params})
}

export function addMember(roleId, memberId) {
    return request.post("/system/role/member", {roleId: roleId, memberId: memberId})
}

export function delMember(roleId, userId) {
    let param = Array.isArray(userId) ? userId.join(",") : userId
    return request.delete("/system/role/member", {
        params: {memberId: param, roleId: roleId}
    })
}

export function saveRoleMenus(roleId, menuId) {
    return request.post("/system/role/menu", {
        roleId: roleId,
        menuId: menuId
    })
}

export function getRoleMenus(id) {
    return request.get("/system/role/menu", {params: {roleId: id}})
}