import qs from "qs";

export function pathToBreadcrumb(menus) {
    const map = new Map()
    for (const m of menus) {
        if (m.path) {
            if (!map.has(m.path)) {
                map.set(m.path, [])
            }
            map.get(m.path).push(m.menuTitle)
        }
        if (m.children) {
            const curBreadcrumb = map.get(m.path) ?? []
            const childBreadcrumb = pathToBreadcrumb(m.children)
            for (const [k, v] of childBreadcrumb) {
                map.set(k, [...curBreadcrumb, ...v])
            }
        }
    }
    return map
}

/**
 * 将包含children数组的对象扁平化到一个数组中
 * @param tree
 * @returns {*[]}
 */
export function flat(tree) {
    const arr = []
    for (const item of tree) {
        arr.push(item)
        if (item.children) {
            arr.push(...flat(item.children))
        }
    }
    return arr
}

/**
 * 将嵌套对象扁平成用.分隔的一个对象
 * 例如：{a: {b: 'xxx'}} 转成成 {'a.b': 'xxx'}
 * @param obj
 */
export const flatQuery = (obj) => qs.parse(qs.stringify(obj, {allowDots: true}))