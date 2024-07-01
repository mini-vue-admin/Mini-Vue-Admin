import axios, {AxiosError} from 'axios'
import {ElLoading, ElMessage} from 'element-plus'
import qs from "qs";
import {getToken} from "@/api/token.js";
import {saveAs} from 'file-saver'
import {logout} from "@/api/login.js";
import {auth_enabled, base_url} from "@/config.js";

class AxiosCanceler {
    pending = new Map()
    getKey = (config) =>
        [config.method, config.url, qs.stringify(config.params)].join("&");

    addPending = (config) => {
        let key = this.getKey(config)
        if (this.pending.has(key)) {
            return false
        }
        this.pending.set(key, config)
        return true
    }

    rmPending = config => {
        let key = this.getKey(config)
        this.pending.delete(key)
    }

}

const axiosCanceler = new AxiosCanceler();

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: base_url,
    // 超时, millis
    timeout: 30000,
    loading: null,
    loadingCount: 0,
})
service.startLoading = () => {
    if (service.defaults.loadingCount === 0) {
        service.defaults.loading = ElLoading.service({
            fullscreen: true,
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
    }
    service.defaults.loadingCount += 1
}
service.endLoading = () => {
    if (service.defaults.loadingCount === 1 && service.defaults.loading) {
        service.defaults.loading.close()
    }
    service.defaults.loadingCount -= 1
}


// request拦截器
service.interceptors.request.use(async (config) => {
    // 是否需要设置 token
    if (auth_enabled && getToken()) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    // 是否需要防止数据重复提交
    config.repeatAllowed ?? (config.repeatAllowed = false)
    if (!config.repeatAllowed) {
        if (!axiosCanceler.addPending(config)) {
            return Promise.reject(new AxiosError(
                "禁止重复请求",
                "ERR_BAD_REQUEST",
                config,
            ))
        }
    }

    // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
    config.loading ?? (config.loading = true);
    config.loading && service.startLoading();

    // 设置请求头
    if (config.method === 'put' || config.method === 'post') {
        if (config.headers && config.headers['Content-Type']) {
            // ignore
        } else {
            config.headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return config;
}, error => {
    console.log("axios request error: " + error)
    return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    !res.config.repeatAllowed && axiosCanceler.rmPending(res.config)
    res.config.loading && service.endLoading();

    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    let msg = res.data.msg || '请求失败'
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res
    }

    if (res.status === 200 && res.data.code === 0) {
        return res.data
    } else {
        ElMessage({message: msg, type: 'error', duration: 5 * 1000})
        return Promise.reject(msg)
    }
}, error => {


    let {message, config, response} = error;
    !config.repeatAllowed && axiosCanceler.rmPending(config)
    config.loading && service.endLoading();

    if (message === "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else {
        message = response.data.msg
    }
    if (response && response.status === 401) {
        message = "认证失败"
    } else if (response && response.status === 403) {
        message = "权限不足"
    }

    ElMessage({message: message, type: 'error', duration: 5 * 1000})
    if (response && response.status === 401) {
        logout()
    }
    return Promise.reject(error)
})

// 通用下载方法
export function download(config) {
    return service.request({
        responseType: 'blob',
        ...config
    }).then(async (response) => {
        const contentDisposition = response.headers['Content-Disposition'];
        let fileName = 'unknown';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }
        const data = response.data
        const blob = new Blob([data])
        saveAs(blob, fileName)
    }).catch((error) => {
        console.error("下载文件出现错误: " + error)
        ElMessage.error('下载文件出现错误，请联系管理员！')
    })
}

export default service
