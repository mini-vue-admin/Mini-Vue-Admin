import request from "@/api/http.js"
export function getTree(params) {
  return   request.get('/system/dept/tree', {params: params})
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