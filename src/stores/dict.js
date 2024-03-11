import {defineStore} from 'pinia'
import {getList as getDictTypeList} from "@/api/system/dictType.js";
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

    const getDictValue = (dictType, dictLabel) => {
        return dicts.get(dictType).find(it => it.dictLabel === dictLabel)
    }

    const getDictLabel = (dictType, dictValue) => {
        return dicts.get(dictType).find(it => it.dictValue === dictValue)
    }

    const getDictsByType = (dictType) => dicts.get(dictType)

    return {initStore, getDictValue, getDictLabel, getDictsByType}
})