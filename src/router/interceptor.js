import router from './index.js'
import {getToken} from "@/api/token.js";
import NProgress from 'nprogress'

import {useMenuStore} from "@/stores/menu.js";
import {useDictStore} from "@/stores/dict.js";
import {whiteList} from "@/api/constants.js";


router.beforeEach(async (to, from, next) => {
    NProgress.start()

    // 更新路由
    const menuStore = useMenuStore()
    if (!menuStore.loaded) {
        await menuStore.initRouter()
        return next({
            path: to.fullPath
        })
    }

    // 更新字典
    const dictStore = useDictStore()
    dictStore.initStore()

    // 是否启用认证
    const authEnabled = import.meta.env.VITE_APP_AUTH_ENABLED ?? false;

    if (JSON.parse(authEnabled)) {
        // 是否登录
        const hasLogged = getToken();
        if (hasLogged) {
            if (to.path === '/login') {
                next({path: '/'})
            } else {
                next()
            }
        } else {
            if (whiteList.includes(to.path)) {
                next()
            } else {
                next({
                    path: '/login'
                })
            }
        }
    } else {
        if (to.path === '/login') {
            next({path: '/'})
        } else {
            next()
        }
    }

})

router.afterEach(() => {
    // 根据当前路由，重新设置面包屑
    const menuStore = useMenuStore()
    menuStore.initBreadcrumb()

    // 根据当前路由，管理标签
    menuStore.initTags()

    NProgress.done()
})
