import {removeToken, removeUser} from "@/api/token.js";
import request from "@/api/http.js"
import router from "@/router/index.js";

export function logout() {
    removeToken()
    removeUser()

    router.push("/login")
}

export function login(data) {
    return request.post("/login", data)
}
