export const getToken = () => {
    return localStorage.getItem("token")
}

export const setToken = (token) => {
    localStorage.setItem("token", token)
}

export const removeToken = () => {
    localStorage.removeItem("token")
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"))
}

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const removeUser = () => {
    localStorage.removeItem("user")
}

export const ANONYMOUS_USER = {
    username: "ANONYMOUS",
    nickname: "匿名",
    roles: ["ANONYMOUS"],
    permissions: ["ANONYMOUS"],
}
