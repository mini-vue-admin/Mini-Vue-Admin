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