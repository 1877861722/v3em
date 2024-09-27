import { defineStore } from 'pinia'

export const galleryStore = defineStore('gallery', {
    state: (() => ({
        // 图库数据
        galleryDataList: [],
    })),
    actions: {
        // 设置数据
        setGallery(data) {
            this.galleryDataList = data
        },
    }
})