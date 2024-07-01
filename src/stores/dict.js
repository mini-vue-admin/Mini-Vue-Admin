import {defineStore} from 'pinia'
import {getList as getDictDataList} from "@/api/system/dictData.js";

export const useDictStore = defineStore('dictStore', () => {
    const dicts = new Map()
    let loaded = false
    let p = null

    const initStore = async () => {
        if (loaded) {
            return
        } else {
            if (p === null) {
                p = new Promise(async (resolve, reject) => {
                    const values = await getDictDataList().then(res => res.data)

                    for (const item of values) {
                        if(item.status !== '0') {
                            continue
                        }

                        const {dictType} = item;
                        if (!dicts.has(dictType)) {
                            dicts.set(dictType, []);
                        }
                        dicts.get(dictType).push(item);
                    }
                    loaded = true
                    resolve()
                })
            }
            await p
        }
    }


    const getDictValue = async (dictType, dictLabel) => {
        const dicts = await getDictsByType(dictType)
        return dicts.find(it => it.dictLabel === dictLabel)
    }

    const getDictLabel = async (dictType, dictValue) => {
        const dicts = await getDictsByType(dictType)
        return dicts.find(it => it.dictValue === dictValue)
    }

    const getDictsByType = async (dictType) => {
        await initStore()
        return dicts.get(dictType) ?? []
    }

    return {initStore, getDictValue, getDictLabel, getDictsByType}
})