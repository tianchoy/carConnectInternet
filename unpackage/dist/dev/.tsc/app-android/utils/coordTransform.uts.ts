// utils/coordTransform.uts

/**
 * 坐标转换工具类
 * 提供WGS84与腾讯地图坐标系之间的高精度转换
 */
class CoordTransform {
    
    // 定义常量
    private static readonly a: number = 6378245.0
    private static readonly ee: number = 0.00669342162296594323
    private static readonly pi: number = 3.1415926535897932384626
    
    /**
     * WGS84转腾讯地图坐标系（GCJ02）
     * @param wgLat WGS84纬度
     * @param wgLon WGS84经度
     * @returns 腾讯地图坐标系 { lat: number, lng: number }
     */
    static wgs84ToTencent(wgLat: number, wgLon: number): { lat: number, lng: number } {
        // 如果坐标在国外，直接返回
        if (!this.isInChina(wgLon, wgLat)) {
            return { lat: wgLat, lng: wgLon }
        }
        
        let dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0)
        let dLng = this.transformLng(wgLon - 105.0, wgLat - 35.0)
        let radLat = wgLat / 180.0 * this.pi
        let magic = Math.sin(radLat)
        magic = 1 - this.ee * magic * magic
        let sqrtMagic = Math.sqrt(magic)
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi)
        dLng = (dLng * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi)
        
        const mgLat = wgLat + dLat
        const mgLng = wgLon + dLng
        
        return { 
            lat: Number(mgLat.toFixed(6)), 
            lng: Number(mgLng.toFixed(6))
        }
    }
    
    /**
     * 腾讯地图坐标系转WGS84（使用高精度算法）
     * @param tcLat 腾讯地图纬度
     * @param tcLon 腾讯地图经度
     * @returns WGS84坐标系 { lat: number, lng: number }
     */
    static tencentToWgs84(tcLat: number, tcLon: number): { lat: number, lng: number } {
        // 如果坐标在国外，直接返回
        if (!this.isInChina(tcLon, tcLat)) {
            return { lat: tcLat, lng: tcLon }
        }
        
        // 使用高精度迭代算法
        let wgsLat = tcLat
        let wgsLng = tcLon
        
        for (let i = 0; i < 5; i++) {
            const gcj02 = this.wgs84ToTencent(wgsLat, wgsLng)
            const deltaLat = tcLat - gcj02.lat
            const deltaLng = tcLon - gcj02.lng
            
            wgsLat += deltaLat
            wgsLng += deltaLng
            
            // 如果误差已经很小，提前结束
            if (Math.abs(deltaLat) < 1e-7 && Math.abs(deltaLng) < 1e-7) {
                break
            }
        }
        
        return {
            lat: Number(wgsLat.toFixed(6)),
            lng: Number(wgsLng.toFixed(6))
        }
    }
    
    /**
     * 批量转换坐标（内部使用高精度转换）
     * @param devices 设备数组
     * @param targetSystem 目标坐标系 'tencent' | 'wgs84'
     * @returns 转换后的设备数组
     */
    static batchConvertCoordinates(devices: Array<any>, targetSystem: string = 'tencent'): Array<any> {
        if (!Array.isArray(devices)) return []
        
        return devices.map(device => {
            if (!device) return device
            
            const lat = Number(device.latitude)
            const lng = Number(device.longitude)
            
            if (isNaN(lat) || isNaN(lng)) {
                __f__('warn','at utils/coordTransform.uts:96','设备经纬度无效', device)
                return device
            }
            
            let converted
            if (targetSystem === 'tencent') {
                // WGS84转腾讯地图
                converted = this.wgs84ToTencent(lat, lng)
            } else {
                // 腾讯地图转WGS84（使用高精度算法）
                converted = this.tencentToWgs84(lat, lng)
            }
            
            return {
                ...device,
                latitude: converted.lat,
                longitude: converted.lng,
                originalLatitude: lat, // 保留原始坐标
                originalLongitude: lng
            }
        })
    }
    
    /**
     * 转换单个坐标点（内部使用高精度转换）
     * @param lat 纬度
     * @param lng 经度
     * @param fromSystem 原坐标系 'wgs84' | 'tencent'
     * @param toSystem 目标坐标系 'tencent' | 'wgs84'
     * @returns 转换后的坐标 { lat: number, lng: number }
     */
    static convertCoordinate(lat: number, lng: number, fromSystem: string = 'wgs84', toSystem: string = 'tencent'): { lat: number, lng: number } {
        if (fromSystem === 'wgs84' && toSystem === 'tencent') {
            return this.wgs84ToTencent(lat, lng)
        } else if (fromSystem === 'tencent' && toSystem === 'wgs84') {
            return this.tencentToWgs84(lat, lng)
        } else {
            __f__('warn','at utils/coordTransform.uts:133','不支持的坐标系转换', fromSystem, '->', toSystem)
            return { lat, lng }
        }
    }
    
    /**
     * 检查坐标是否在中国境内
     * @param lat 纬度
     * @param lng 经度
     * @returns 是否在中国境内
     */
    static isInChina(lng: number, lat: number): boolean {
        return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271
    }
    
    // 私有方法：纬度转换
    private static transformLat(x: number, y: number): number {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
        ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
        return ret
    }
    
    // 私有方法：经度转换
    private static transformLng(x: number, y: number): number {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
        ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
        ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
        return ret
    }
}

// 导出工具类
export default CoordTransform