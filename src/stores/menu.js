import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getTree} from "@/api/system/menu.js";

export const useMenuStore = defineStore('menuStore', () => {
    const menus = ref([])
    let loaded = false

    const initRouter = async (router) => {
        if (loaded) {
            return Promise.resolve()
        }
        const res = await getTree()
        menus.value = res.data
        const menuItems = flatMenus(menus.value).filter(it => it.menuType === 'C')
        for (let menu of menuItems) {
            const indexRoute = router.getRoutes().find(it => it.name === "index")
            indexRoute.children.push(toRoute(menu))
        }
        console.log(router.getRoutes())

        loaded = true
        return Promise.resolve()
    }

    const flatMenus = (menus) => {
        const arr = new Array()
        for (let menu of menus) {
            arr.push(menu)
            if(menu.children) {
                arr.push(...flatMenus(menu.children))
            }
        }
        return arr
    }

    const toRoute = (menu) => {
        return {
            name: menu.menuName,
            path: menu.path,
            component: () => import( /* @vite-ignore */ `@/views/${menu.component}.vue`)
        }
    }

    return {menus, initRouter}
})