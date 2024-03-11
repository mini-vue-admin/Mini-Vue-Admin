import {defineStore} from 'pinia'
import {ref, defineAsyncComponent} from 'vue'
import {getTree} from "@/api/system/menu.js";
import router from '@/router/index.js'
export const useMenuStore = defineStore('menuStore', () => {
    const menus = ref([])
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
        loaded.value = true
        console.log(router.getRoutes())
    }

    const flatMenus = (menus) => {
        const arr = new Array()
        for (let menu of menus) {
            arr.push(menu)
            if (menu.children) {
                arr.push(...flatMenus(menu.children))
            }
        }
        return arr
    }

    const toRoute = (menu) => {
        return {
            name: menu.menuName,
            path: menu.path,
            component: () => import("../views/" + menu.component + ".vue")
        }
    }

    return {menus, loaded, initRouter}
})