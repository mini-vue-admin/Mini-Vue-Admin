import request from "@/api/http.js"
export function getTree(params) {
  return   request.get('/system/menu/list', {params: params})
}


export function getById(id) {
  return request.get("/system/menu/" + id)
}

export function create(data) {
  return request.post("/system/menu", data)
}

export function update(data) {
  return request.put("/system/menu", data)
}

export function del(id) {
  let param = Array.isArray(id) ? id.join(",") : id
  return request.delete("/system/menu", {
    params: {id: param}
  })
}