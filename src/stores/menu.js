import {defineStore} from 'pinia'
import {ref, defineAsyncComponent} from 'vue'
import {getTree} from "@/api/system/menu.js";
import router, {dynamic} from '@/router/index.js'
import {pathToBreadcrumb} from "@/api/utils.js";

export const useMenuStore = defineStore('menuStore', () => {
    const menus = ref([])
    const breadcrumb = ref([])
    const tags = ref([])
    let loaded = ref(false)


    const initRouter = async () => {
        if (loaded.value) {
            return
        }
        const res = await getTree()
        menus.value = res.data
        const menuItems = flatMenus(menus.value).filter(it => it.menuType === 'C')
        for (let menu of menuItems) {
            router.addRoute('index', toRoute(menu))
        }
        for (let route of dynamic) {
            router.addRoute('index', route)
        }
        loaded.value = true
    }

    const initBreadcrumb = () => {
        const route = router.currentRoute.value
        const activePath = route.meta && route.meta.activePath ? route.meta.activePath : route.path
        let breadcrumbMap = pathToBreadcrumb(menus.value);
        breadcrumb.value = breadcrumbMap.get(activePath)
    }

    const initTags = () => {
        const route = router.currentRoute.value
        const path = route.path
        let cur = tags.value.find(it => it.path === path)
        if (!cur) {
            cur = route
            tags.value.push(cur)
        }
        tags.value.forEach(it => it.meta.active = false)
        cur.meta.active = true
    }

    const removeTag = (route, op) => {

        const curRoute = tags.value.find(it => it.path === router.currentRoute.value.path)

        if (op === 'right') {
            const curIndex = tags.value.indexOf(curRoute)
            const i = tags.value.indexOf(route)
            tags.value = tags.value.slice(0, i + 1)
            if (curIndex > i) {
                router.push(route.path)
            }
        } else if (op === 'others') {
            tags.value = [route];
            if (curRoute.path !== route.path) {
                router.push(route.path)
            }
        } else if (op === 'all') {
            tags.value = []
            router.push('/')
        } else {
            let target = '/'
            if (route.meta.active ) {
                if(tags.value.length > 1) {
                    const i = tags.value.indexOf(route)
                    if (i < 0) {
                        return
                    }
                    if (i === tags.value.length -1) {
                        target = tags.value[i-1].path
                    } else {
                        target = tags.value[i+1].path
                    }
                } else {
                    target = '/'
                }
                router.push(target)
            }

            tags.value = tags.value.filter(it => it !== route)
        }

    }

    const flatMenus = (menus) => {
        const arr = []
        for (let menu of menus) {
            arr.push(menu)
            if (menu.children) {
                arr.push(...flatMenus(menu.children))
            }
        }
        return arr
    }

    /**
     * Menu to route
     * @param menu
     * @returns {{path, component: (function(): Promise<*>), name: (null|[{trigger: string, message: string, required: boolean},{pattern: RegExp, trigger: string, message: string},{min: number, max: number, trigger: string, message: string}]|string|*)}}
     */
    const toRoute = (menu) => {
        return {
            name: menu.menuName,
            path: menu.path,
            component: () => import("../views/" + menu.component + ".vue"),
            meta: {
                keepAlive: menu.cache,
                title: menu.menuTitle,
            }
        }
    }

    return {menus, loaded, breadcrumb, tags, initRouter, initBreadcrumb, initTags, removeTag}
})