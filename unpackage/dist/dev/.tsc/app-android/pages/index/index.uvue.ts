import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_i_line_progress from '@/uni_modules/i-ui-x/components/i-line-progress/i-line-progress.uvue'
import _easycom_i_picker from '@/uni_modules/i-ui-x/components/i-picker/i-picker.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import _imports_0 from '../../static/exit.png'
import _imports_1 from '../../static/banner.png'
import _imports_2 from '../../static/pos.png'
import _imports_3 from '../../static/car.png'
import _imports_4 from '../../static/dzwl.png'
import _imports_5 from '../../static/msg.png'
import _imports_6 from '../../static/pay.png'
import _imports_7 from '../../static/online.png'
import _imports_8 from '../../static/del.png'
import { showAppToast } from '../../utils/toast.uts'
import { ref, reactive, computed, nextTick } from 'vue';
import { getCustomDeviceList, getUserDeviceList, getDeviceDetail, getDevicePos,getTrackPos,delDevice,logout } from '../../api/request.uts'
import CoordTransform from '../../utils/coordTransform.uts'
import { getTodayZeroTime, type TodayTimeRange } from '../../utils/gettime.uts'
import { formatTimes } from '../../utils/formateTime.uts'
import { getDeviceIcon } from '../../utils/cars'
type Device = { __$originalPosition?: UTSSourceMapPosition<"Device", "pages/index/index.uvue", 205, 6>;
    name: string,
    deviceName: string,
    value: string,
    imei: string,
    deptId: string,
    deviceId: string,
    iccid: string,
    simMerchant: string,
    connectionStatus: string,
    carType: string,
    plateNo: string,
    latitude: number,
    longitude: number
}

//// 响应式数据
type MapCenter = { __$originalPosition?: UTSSourceMapPosition<"MapCenter", "pages/index/index.uvue", 222, 6>;
    latitude: number
    longitude: number
}

type UserDeviceListData = { __$originalPosition?: UTSSourceMapPosition<"UserDeviceListData", "pages/index/index.uvue", 232, 6>;
    list: Array<UTSJSONObject>
}

type DeviceStatus = { __$originalPosition?: UTSSourceMapPosition<"DeviceStatus", "pages/index/index.uvue", 257, 6>;
    batteryPercent: number
    voltage: number
    signalStrength: number
}

type DeviceDetailState = { __$originalPosition?: UTSSourceMapPosition<"DeviceDetailState", "pages/index/index.uvue", 263, 6>;
    deviceStatus: DeviceStatus
    connectionStatus: string
    lastUpdateTime: string
}

type SavedDevice = { __$originalPosition?: UTSSourceMapPosition<"SavedDevice", "pages/index/index.uvue", 356, 6>;
    name: string
    deviceName: string
    imei: string
    deptId: string
    deviceId: string
    iccid: string
    simMerchant: string
    connectionStatus: string
    carType: string
    plateNo: string
    latitude: number
    longitude: number
}


const __sfc__ = defineComponent({
  __name: 'index',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const timeRange: TodayTimeRange = getTodayZeroTime()
const nowTime: number = timeRange.nowTime
const todayZero: number = timeRange.todayZero

const center = reactive<MapCenter>({
    latitude: 39.90469,
    longitude: 116.40717
})

const userDeviceList = ref<Array<UTSJSONObject>>([])
const isMapReady = ref(false)
const mapScale = ref(12)
const statusBarHeight = ref(20)
const menuButtonInfo = ref(null)
const navBarHeight = ref(44)
const deviceList = ref<Array<Device>>([])
// picker 相关变量
const showPicker = ref(false)
const pickerDefaultIndex = ref<number[]>([0])
const pickerKey = ref(0)
const currentCarImei = ref('')
const currentCarDeptId = ref('')
const currentCarDeviceId = ref('')
const currentCarIccId = ref('')
const currentCarName = ref('')
const currentCarSimMerchant = ref('')
const currentCarConnectionStatus = ref('')
const currentCarCarType = ref('')
const currentCarPlateNo = ref('')

const deviceDetail = ref<DeviceDetailState>({
    deviceStatus: {
        batteryPercent: 0,
        voltage: 0,
        signalStrength: 0
    },
    connectionStatus: 'offline',
    lastUpdateTime: ''
})
const markers = ref([] as Marker[])
const lastUpdateTime = ref('--:--:--')

// 本地存储key
const SELECTED_DEVICE_STORAGE_KEY: string = 'selected_device_info'
const SELECTED_DEVICE_INDEX_STORAGE_KEY: string = 'selected_device_index'

// 计算属性
const safeDeviceDetail = computed<DeviceDetailState>(() => {
    const detail = deviceDetail.value
    return {
        deviceStatus: {
            batteryPercent: detail.deviceStatus.batteryPercent,
            voltage: detail.deviceStatus.voltage,
            signalStrength: detail.deviceStatus.signalStrength
        },
        connectionStatus: detail.connectionStatus,
        lastUpdateTime: detail.lastUpdateTime
    }
})

// 处理车辆列表显示 - 返回 picker 选项
const pickerColumns = computed(() => {
    return [deviceList.value.map((device): UTSJSONObject => {
        const displayName = device.deviceName || device.name || device.imei || '未命名设备'
        const statusText = device.connectionStatus == 'online' ? '在线' : '离线'
        return {
            text: `${displayName} (${statusText})`,
            value: device.imei || device.deviceId,
            disabled: false
        } as UTSJSONObject
    })]
})

// 关闭 picker
const closePicker = () => {
    showPicker.value = false
}

// 初始化尺寸数据
const initDimensions = () => {
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight != null ? systemInfo.statusBarHeight : 20;
}

// 延迟函数
const delay = (ms: number): Promise<void> => {
    return new Promise<void>((resolve: (value: void) => void) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

// 保存选中的设备信息
const saveSelectedDevice = (device: Device) => {
    try {
        const deviceInfo = {__$originalPosition: new UTSSourceMapPosition("deviceInfo", "pages/index/index.uvue", 335, 15),
            name: device.deviceName || device.name || device.imei,
            deviceName: device.deviceName || device.name || device.imei,
            imei: device.imei || device.value,
            deptId: device.deptId,
            deviceId: device.deviceId,
            iccid: device.iccid,
            simMerchant: device.simMerchant,
            connectionStatus: device.connectionStatus,
            carType: device.carType,
            plateNo: device.plateNo,
            latitude: device.latitude,
            longitude: device.longitude
        }
        uni.setStorageSync(SELECTED_DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo))
        console.log('保存选中设备成功:', deviceInfo, " at pages/index/index.uvue:350")
    } catch (error) {
        console.error('保存选中设备失败:', error, " at pages/index/index.uvue:352")
    }
}

const decodeSavedDevice = (raw: any): SavedDevice | null => {
    if (raw == null || raw == '') return null
    let data: UTSJSONObject | null = null
    if (typeof raw == 'string') {
        try {
            data = UTSAndroid.consoleDebugError(JSON.parse(raw), " at pages/index/index.uvue:376") as UTSJSONObject
        } catch (error) {
            return null
        }
    } else {
        data = raw as UTSJSONObject
    }
    if (data == null) return null
    const imei = data.getString('imei', '')
    if (imei == '') return null
    const device: SavedDevice = {
        name: data.getString('name', imei),
        deviceName: data.getString('deviceName', data.getString('name', imei)),
        imei: imei,
        deptId: data.getString('deptId', ''),
        deviceId: data.getString('deviceId', ''),
        iccid: data.getString('iccid', ''),
        simMerchant: data.getString('simMerchant', ''),
        connectionStatus: data.getString('connectionStatus', ''),
        carType: data.getString('carType', ''),
        plateNo: data.getString('plateNo', ''),
        latitude: data.getNumber('latitude', 0),
        longitude: data.getNumber('longitude', 0)
    }
    return device
}

// 获取保存的选中设备
const getSavedSelectedDevice = (): SavedDevice | null => {
    try {
        const rawDevice = uni.getStorageSync(SELECTED_DEVICE_STORAGE_KEY)
        if (rawDevice == null) return null
        return decodeSavedDevice(rawDevice)
    } catch (error) {
        console.error('获取保存设备失败:', error, " at pages/index/index.uvue:410")
    }
    return null
}

// 清除保存的选中设备
const clearSavedSelectedDevice = () => {
    try {
        uni.removeStorageSync(SELECTED_DEVICE_STORAGE_KEY)
        console.log('清除保存设备成功', " at pages/index/index.uvue:419")
    } catch (error) {
        console.error('清除保存设备失败:', error, " at pages/index/index.uvue:421")
    }
}

// 保存选中的设备索引
const saveSelectedDeviceIndex = (index: number) => {
    try {
        uni.setStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY, index)
    } catch (error) {
        console.error('保存选中设备索引失败:', error, " at pages/index/index.uvue:430")
    }
}

// 获取保存的选中设备索引
const getSavedSelectedDeviceIndex = (): number | null => {
    try {
        const savedIndex = uni.getStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY)
        if (savedIndex != null && savedIndex.toString() != '') {
            const index = parseInt(savedIndex.toString())
            return isNaN(index) || index < 0 ? null : index
        }
    } catch (error) {
        console.error('获取保存设备索引失败:', error, " at pages/index/index.uvue:443")
    }
    return null
}

// 清除保存的选中设备索引
const clearSavedSelectedDeviceIndex = () => {
    try {
        uni.removeStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY)
    } catch (error) {
        console.error('清除保存设备索引失败:', error, " at pages/index/index.uvue:453")
    }
}

// 根据保存的设备信息设置当前车辆
const setCurrentCarFromSavedDevice = (savedDevice: any) => {
    const deviceName = savedDevice.deviceName || savedDevice.name || '未命名设备'
    currentCarName.value = deviceName
    currentCarImei.value = savedDevice.imei || savedDevice.value
    currentCarDeptId.value = savedDevice.deptId
    currentCarDeviceId.value = savedDevice.deviceId
    currentCarIccId.value = savedDevice.iccid
    currentCarSimMerchant.value = savedDevice.simMerchant
    currentCarConnectionStatus.value = savedDevice.connectionStatus
    currentCarCarType.value = savedDevice.carType
    currentCarPlateNo.value = savedDevice.plateNo
    center.latitude = savedDevice.latitude
    center.longitude = savedDevice.longitude
}

// 处理选择车辆 - 打开 picker
const handlePicker = () => {
    if (deviceList.value.length == 0) {
        showAppToast({
            title: '暂无车辆数据',
            icon: 'none'
        })
        return
    }

    // 更新 picker 的 key 强制刷新
    pickerKey.value++

    // 设置默认选中索引
    const savedIndex = getSavedSelectedDeviceIndex()
    if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
        pickerDefaultIndex.value = [savedIndex]
    } else {
        // 根据当前选中的设备查找索引
        const currentIndex = deviceList.value.findIndex(
            device => device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value
        )
        if (currentIndex != -1) {
            pickerDefaultIndex.value = [currentIndex]
        } else {
            pickerDefaultIndex.value = [0]
        }
    }

    // 延迟打开 picker，确保数据更新完成
    nextTick(() => {
        showPicker.value = true
    })
}

// 创建标记点
const createMarker = (id: number, lat: number, lng: number, type: string, title?: string): Marker => {
    const isOnline = currentCarConnectionStatus.value == 'online'
    const callout: MapMarkerCallout = {
        content: title || '爱车位置',
        color: isOnline ? '#ffffff' : '#999999',
        borderRadius: 6,
        bgColor: isOnline ? '#07C160' : '#CCCCCC',
        padding: 4,
        fontSize: 12,
        display: 'ALWAYS'
    }
    return {
        id: id,
        latitude: lat,
        longitude: lng,
        iconPath: getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value),
        width: 30,
        height: 30,
        anchor: { x: 0.5, y: 0.5 },
        callout: callout
    }
}

// 加载车辆详情
const loadDeviceDetail = async (deviceId: string) => {
    try {
        const res = await getDeviceDetail(deviceId)
        const detail = res.data
        if (detail != null) {
            const deviceStatus = detail.getJSON('deviceStatus')
            deviceDetail.value = {
                deviceStatus: {
                    batteryPercent: deviceStatus?.getNumber('batteryPercent', 0) ?? 0,
                    voltage: deviceStatus?.getNumber('voltage', 0) ?? 0,
                    signalStrength: deviceStatus?.getNumber('signalStrength', 0) ?? 0
                },
                connectionStatus: detail.getString('connectionStatus', 'offline'),
                lastUpdateTime: detail.getString('lastUpdateTime', '')
            }

            const updateTime = detail.getString('lastUpdateTime', '')
            if (updateTime) {
                const date = new Date(updateTime)
                lastUpdateTime.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            }
        }
    } catch (error) {
        console.error('加载设备详情失败', error, " at pages/index/index.uvue:556")
    }
}

// 加载轨迹轨迹
const trackPosInfo = ref<any>({})
const tripData = ref<Array<UTSJSONObject>>([])
const totalMileage = ref(0)
const averageSpeed = ref(0)

// 处理行程数据
const processTripData = (data : UTSJSONObject) : void => {
    const trips = data.getArray<UTSJSONObject>('trips')
    if (trips != null && trips.length > 0) {
        tripData.value = trips

        let totalDistance = 0
        let totalDuration = 0
        let totalAvgSpeed = 0

        trips.forEach((trip : UTSJSONObject) : void => {
            totalDistance += trip.getNumber('distance', 0)
            totalDuration += trip.getNumber('duration', 0)
            totalAvgSpeed += trip.getNumber('averageSpeed', 0)
        })

        totalMileage.value = totalDistance
        averageSpeed.value = totalAvgSpeed / trips.length
    } else {
        tripData.value = []
        totalMileage.value = 0
        averageSpeed.value = 0
    }
}

const loadTrackPos = async (data: UTSJSONObject) : Promise<void> => {
    try {
        const res = await getTrackPos(data)
        if (res.code == 401) {
            showAppToast({
                title: '登录过期，请重新登录',
                icon: 'none',
                duration: 2000
            })
            uni.removeStorageSync('token')
            uni.reLaunch({
                url: '/pages/index/index'
            })
            return
        }
        const trackData = res.data
        if (trackData != null) {
            processTripData(trackData)
        }
        uni.hideLoading()
    } catch (error) {
        console.error('加载轨迹失败', error, " at pages/index/index.uvue:612")
    }
}

// 加载设备位置
const devicePosInfo = ref<UTSJSONObject | null>(null)
const devicePositionUpdateTime = computed<string>(() => {
    const position = devicePosInfo.value
    return position != null ? position.getString('positionUpdateTime', '暂无位置') : '暂无位置'
})
const loadDevicePos = async (data: UTSJSONObject) : Promise<boolean> => {
    try {
        const res = await getDevicePos(data)
        if (res.code == 0 && res.data && res.data.length > 0) {
            const position = res.data[0]
            devicePosInfo.value = position

            const lat = position.getNumber('latitude', 0);
            const lng = position.getNumber('longitude', 0);

            if (isNaN(lat) || isNaN(lng)) {
                console.error('经纬度格式错误', position.getString('latitude', ''), position.getString('longitude', ''), " at pages/index/index.uvue:633")
                showAppToast({
                    title: '定位数据异常',
                    icon: 'none'
                })
                return false;
            }

            const convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)

            center.latitude = convertedCoord.lat;
            center.longitude = convertedCoord.lng;
            isMapReady.value = true

            await delay(100);

            const nextMarker = createMarker(
                1,
                convertedCoord.lat,
                convertedCoord.lng,
                'device',
                currentCarName.value
            )

            markers.value = [nextMarker]

            console.log('标记点更新完成', " at pages/index/index.uvue:659")
            return true;
        } else {
            console.warn('获取设备位置失败', " at pages/index/index.uvue:662")
            isMapReady.value = false
            showAppToast({
                title: '获取位置失败',
                icon: 'none'
            })
            return false
        }
    } catch (error) {
        console.error('加载设备位置失败', error, " at pages/index/index.uvue:671")
        showAppToast({
            title: '定位失败，请重试',
            icon: 'none'
        })
        return false
    }
}

// 加载设备数据
const loadDeviceData = async (device: Device) => {
    console.log('开始加载设备数据:', device, " at pages/index/index.uvue:682")
    try {
        await loadDeviceDetail(device.deviceId);
        await loadDevicePos({
            deviceId: device.deviceId,
            deviceids: device.imei || device.value
        })
        await loadTrackPos({
            imei: device.imei || device.value,
            startTime: formatTimes(todayZero),
            endTime: formatTimes(nowTime),
            minParkTime: 120,
            withStop: false,
            withPos: false,
            withTrip: true,
        })
        showAppToast({
            title: '切换成功',
            icon: 'none'
        })
    } catch (error) {
        console.error('切换车辆失败', error, " at pages/index/index.uvue:703")
        showAppToast({
            title: '切换失败，请重试',
            icon: 'none'
        })
    } finally {
        uni.hideLoading()
    }
}

// 处理选择车辆确认
const handleConfirm = (e: UTSJSONObject) => {

    // 关闭 picker
    showPicker.value = false

    // i-picker 返回的第一列索引
    const indexs = e.getArray<number>('indexs')
    let selectedIndex = indexs != null && indexs.length > 0 ? indexs[0] : -1

    // 如果索引无效，使用当前设备
    if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
        console.warn('无法解析选中的索引，使用当前设备', " at pages/index/index.uvue:725")
        const currentIndex = deviceList.value.findIndex(
            device => device.imei == currentCarImei.value || device.deviceId == currentCarDeviceId.value
        )
        if (currentIndex != -1) {
            selectedIndex = currentIndex
            console.log('使用当前设备索引:', selectedIndex, " at pages/index/index.uvue:731")
        } else {
            selectedIndex = 0
            console.log('使用默认索引: 0', " at pages/index/index.uvue:734")
        }
    }

    const selectedDevice = deviceList.value[selectedIndex]
    if (!selectedDevice) {
        showAppToast({
            title: '选择设备失败',
            icon: 'none'
        })
        return
    }

    // 检查是否选择了不同的设备
    if (selectedDevice.imei == currentCarImei.value && selectedDevice.deviceId == currentCarDeviceId.value) {
        console.log('选择的设备与当前设备相同，不重复加载', " at pages/index/index.uvue:749")
        return
    }

    // 更新当前选中的设备
    const deviceName = selectedDevice.deviceName || selectedDevice.name || '未命名设备'
    currentCarName.value = deviceName
    currentCarImei.value = selectedDevice.imei || selectedDevice.value
    currentCarDeptId.value = selectedDevice.deptId
    currentCarDeviceId.value = selectedDevice.deviceId
    currentCarIccId.value = selectedDevice.iccid
    currentCarSimMerchant.value = selectedDevice.simMerchant
    currentCarConnectionStatus.value = selectedDevice.connectionStatus
    currentCarCarType.value = selectedDevice.carType
    currentCarPlateNo.value = selectedDevice.plateNo
    center.latitude = selectedDevice.latitude
    center.longitude = selectedDevice.longitude

    // 保存选中索引到缓存
    if (selectedIndex != -1) {
        saveSelectedDeviceIndex(selectedIndex)
        pickerDefaultIndex.value = [selectedIndex]
    }

    // 保存选中的设备信息
    saveSelectedDevice(selectedDevice)

    uni.showLoading({
        title: '加载车辆数据...',
        mask: true
    })

    // 加载新设备数据
    loadDeviceData(selectedDevice)
}

// 加载车辆列表
const loadDeviceList = async () => {
    try {
        const res = await getUserDeviceList({
            pageSize: 1000
        })
        const code = res.code
        const data = res.data
        const list = data.list
        if (code == 0 && list != null && list.length > 0) {
            userDeviceList.value = list
            deviceList.value = list.map((item: UTSJSONObject): Device => {
                const imei = item.getString('imei', '')
                const rawDeviceName = item.getString('deviceName', '')
                const deviceName = rawDeviceName != '' ? rawDeviceName : (imei != '' ? imei : '未命名设备')
                return {
                    name: deviceName,
                    deviceName: deviceName,
                    value: imei,
                    imei: imei,
                    deptId: item.getString('companyId', ''),
                    deviceId: item.getString('deviceId', ''),
                    iccid: item.getString('iccid', ''),
                    simMerchant: item.getString('simMerchant', ''),
                    connectionStatus: item.getString('connectionStatus', ''),
                    carType: item.getString('carType', ''),
                    plateNo: item.getString('plateNo', ''),
                    latitude: item.getNumber('latitude', 0),
                    longitude: item.getNumber('longitude', 0)
                }
            })

            // 获取保存的设备
            const savedDevice = getSavedSelectedDevice()
            const savedIndex = getSavedSelectedDeviceIndex()

            let selectedDevice : Device | null = null
            let selectedIdx : number = -1

            // 优先使用保存的索引
            if (savedIndex != null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
                selectedDevice = deviceList.value[savedIndex]
                selectedIdx = savedIndex
            }

            // 如果索引无效或设备不存在，尝试使用保存的设备信息
            if (selectedDevice == null && savedDevice != null && savedDevice.imei != '') {
                selectedDevice = deviceList.value.find(device =>
                    device.imei == savedDevice.imei ||
                    device.value == savedDevice.imei
                )
                if (selectedDevice) {
                    selectedIdx = deviceList.value.indexOf(selectedDevice)
                } else {
                    // 保存的设备已被删除，清除保存记录
                    clearSavedSelectedDevice()
                    clearSavedSelectedDeviceIndex()
                }
            }

            // 如果没有保存的设备或保存的设备无效，使用第一个设备
            if (!selectedDevice && deviceList.value.length > 0) {
                selectedDevice = deviceList.value[0]
                selectedIdx = 0
                // 保存第一个设备作为默认选中
                saveSelectedDevice(selectedDevice)
                saveSelectedDeviceIndex(0)
                console.log('使用第一个设备作为默认:', selectedDevice?.deviceName, " at pages/index/index.uvue:852")
            }

            if (selectedDevice != null) {
                const device = selectedDevice
                // 设置当前车辆信息
                const deviceName = device.deviceName != '' ? device.deviceName : (device.name != '' ? device.name : '未命名设备')
                currentCarName.value = deviceName
                currentCarImei.value = device.imei != '' ? device.imei : device.value
                currentCarDeptId.value = device.deptId
                currentCarDeviceId.value = device.deviceId
                currentCarIccId.value = device.iccid
                currentCarSimMerchant.value = device.simMerchant
                currentCarConnectionStatus.value = device.connectionStatus
                currentCarCarType.value = device.carType
                currentCarPlateNo.value = device.plateNo
                center.latitude = device.latitude
                center.longitude = device.longitude

                // 设置 picker 默认索引
                if (selectedIdx != -1) {
                    pickerDefaultIndex.value = [selectedIdx]
                }

                await loadDeviceDetail(device.deviceId);
                await loadDevicePos({
                    deviceId: device.deviceId,
                    deviceids: device.imei != '' ? device.imei : device.value
                })
                await loadTrackPos({
                    imei: device.imei != '' ? device.imei : device.value,
                    startTime: formatTimes(todayZero),
                    endTime: formatTimes(nowTime),
                    minParkTime: 120,
                    withStop: false,
                    withPos: false,
                    withTrip: true,
                })
            }
        } else {
            showAppToast({
                title: '暂无车辆数据',
                icon: 'none'
            })
        }
    } catch (error) {
        console.error('加载车辆列表失败', error, " at pages/index/index.uvue:898")
        showAppToast({
            title: '加载失败，请下拉重试',
            icon: 'none'
        })
    }
}

// 计算属性：总行程数
const totalTrips = computed(() => {
    return tripData.value.length
})

// 刷新位置
const refreshLocation = async () => {
    if (!currentCarDeviceId.value) {
        showAppToast({
            title: '请先选择车辆',
            icon: 'none'
        })
        return
    }
    uni.showLoading({
        title: '刷新位置中...',
        mask: true
    })
    try {
        await loadDeviceList()
    } catch (error) {
        console.error('刷新位置失败', error, " at pages/index/index.uvue:927")
        showAppToast({
            title: '刷新失败',
            icon: 'none'
        })
    } finally {
        uni.hideLoading()
    }
}

function checkToken() : boolean {
    const token = uni.getStorageSync('token')
    return token != null && token.toString() != ''
}

function isLogin() : boolean {
    if (!checkToken()) {
        showAppToast({
            title: '请先登录',
            icon: 'none'
        })
        return false
    }
    return true
}

// 跳转轨迹详情
const toRecordDetail = () => {
    if (!isLogin()) return
    uni.navigateTo({
        url: '/pages/playBack/playBack?imei=' + currentCarImei.value + '&connectionStatus=' + currentCarConnectionStatus.value + '&plateNo=' + currentCarPlateNo.value + '&carType=' + currentCarCarType.value + '&lat=' + center.latitude + '&lng=' + center.longitude,
        fail: (err) => {
            if (err.errMsg.indexOf('locked') < 0) console.error('跳转轨迹详情失败:', err, " at pages/index/index.uvue:959")
        }
    })
}

// 跳转全部设备
const toDeviceList = () => {
    console.log('toDeviceList', " at pages/index/index.uvue:966")
    if (!isLogin()) return
    uni.navigateTo({
        url: '/pages/deviceList/deviceList',
    })
}

// 跳转设备详情
const toDeviceDetail = (e: any) => {
    if (!isLogin()) return
    if (!currentCarImei.value || !currentCarDeptId.value || !currentCarDeviceId.value) {
        showAppToast({
            title: '请先选择车辆',
            icon: 'none'
        })
        return
    }
    uni.navigateTo({
        url: `/pages/carInfoDetail/carInfoDetail?imei=${currentCarImei.value}&deptId=${currentCarDeptId.value}&deviceId=${currentCarDeviceId.value}`,
    })
}

// 跳转添加车辆
const toAdd = () => {
    if (!isLogin()) return
    uni.navigateTo({
        url: '/pages/addCar/addCar',
        fail: (err) => {
            if (err.errMsg.indexOf('locked') < 0) console.error('跳转添加设备失败:', err, " at pages/index/index.uvue:994")
        }
    })
}

// 跳转消息中心
const toMsgCenter = () => {
    if (!isLogin()) return
    uni.switchTab({
        url: '/pages/message/message',
    })
}

// 跳转查找车辆
const toFindCar = () => {
    if (!isLogin()) return
    uni.openLocation({
        latitude: center.latitude,
        longitude: center.longitude,
        name: currentCarName.value,
        scale: 18,
        success: () => {
            showAppToast({
                title: '成功调起地图',
                icon: 'none'
            });
        },
        fail: (err) => {
            showAppToast({
                title: '调起地图失败',
                icon: 'none'
            });
            console.error('调起地图失败:', err, " at pages/index/index.uvue:1026");
        }
    });
}

// 跳转围栏
const toFence = () => {
    if (!isLogin()) return
    uni.navigateTo({
        url: '/pages/geofencing/geofencing?imei=' + currentCarImei.value + '&connectionStatus=' + currentCarConnectionStatus.value + '&plateNo=' + currentCarName.value + '&carType=' + currentCarCarType.value + '&deptId=' + currentCarDeptId.value + '&deviceName=' + currentCarName.value
    })
}

// 联系客服












const contactCustomerService = () => {
    showAppToast({
        title: '请在微信小程序中联系客服',
        icon: 'none'
    })
}


// 支付
const needRefresh = ref(false)
const toPay = (iccid : string,simMerchant : string) => {
    if (!isLogin()) return
    if(simMerchant.toLowerCase() == 'zddx'){
        iccid = iccid.substring(0,iccid.length-1)
    }
    needRefresh.value = true





















    console.log('iccid',iccid, " at pages/index/index.uvue:1089")
    needRefresh.value = false
    showAppToast({
        title: '请在微信小程序中完成充值',
        icon: 'none',
        duration: 2000,
        mask: true
    })

}

// 跳转登录页
const gotoLogin = () => {
    uni.navigateTo({
        url: '/pages/login/login',
    })
}

async function unbindCurrentDevice() : Promise<void> {
    const result = await delDevice(currentCarImei.value)
    if (result.code == 0) {
        showAppToast({
            title: '解绑成功',
            icon: 'none'
        })
        clearSavedSelectedDevice()
        clearSavedSelectedDeviceIndex()
    } else {
        showAppToast({
            title: '解绑失败',
            icon: 'error'
        })
    }
    await loadDeviceList()
}

// 解绑设备
const unbindDevice = () : void => {
    if (!isLogin()) return
    uni.showModal({
        title: '解绑车辆',
        content: '确定解绑当前车辆吗？',
        success: (res: ShowModalSuccess) : void => {
            if (res.confirm) {
                void unbindCurrentDevice()
            }
        }
    })
}

// 退出登录
const handleExit = () => {
    if (!isLogin()) return
    uni.showModal({
        title: '退出登录',
        content: '确定退出登录吗？',
        success: async (res) => {
            if (res.confirm) {
                const res = await logout()
                if(res.code == 0){
                    clearSavedSelectedDevice()
                    clearSavedSelectedDeviceIndex()
                    uni.removeStorageSync('token')
                    uni.reLaunch({
                        url:'/pages/login/login'
                    })
                }else{
                    showAppToast({
                        title:'退出账户失败'
                    })
                }
            }
        }
    })
}

onShow(async () => {
    if (checkToken()) {
        const needRefresh = uni.getStorageSync('needRefreshHome')
        if (needRefresh) {
            await loadDeviceList()
            uni.removeStorageSync('needRefreshHome')
        }
    }
})

// 刷新设备列表
const handleReload = () => {
    if (!isLogin()) return
    loadDeviceList()
}

// 页面加载
onLoad(() => {
    uni.hideTabBar()
    initDimensions()

    if (checkToken()) {
        loadDeviceList()
    }
})

return (): any | null => {

const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_i_line_progress = resolveEasyComponent("i-line-progress",_easycom_i_line_progress)
const _component_map = resolveComponent("map")
const _component_i_picker = resolveEasyComponent("i-picker",_easycom_i_picker)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("scroll-view", _uM({
      class: "container",
      "scroll-y": "true",
      "show-scrollbar": false
    }), [
      _cE("view", _uM({ class: "page-bg" }), [
        _cE("view", _uM({
          class: "top",
          style: _nS(_uM({paddingTop: statusBarHeight.value+ 10 + 'px'}))
        }), [
          _cE("view", _uM({ class: "device-car" }), [
            _cE("view", _uM({ class: "current-car" }), [
              isTrue(checkToken())
                ? _cE("view", _uM({ key: 0 }), [
                    isTrue(currentCarName.value)
                      ? _cE("text", _uM({
                          key: 0,
                          class: "car-id",
                          onClick: handlePicker
                        }), _tD(currentCarName.value ?? '加载中…'), 1 /* TEXT */)
                      : _cE("text", _uM({
                          key: 1,
                          class: "car-id"
                        }), "暂无设备")
                  ])
                : _cE("text", _uM({
                    key: 1,
                    class: "login",
                    onClick: gotoLogin
                  }), "点击登录!"),
              _cV(_component_i_icon, _uM({
                name: "/static/right-bottom.png",
                fontSize: "7"
              }))
            ]),
            _cE("view", _uM({ class: "nav-tools" }), [
              false
                ? _cE("view", _uM({
                    key: 0,
                    class: "exit",
                    onClick: handleExit
                  }), [
                    _cE("image", _uM({
                      src: _imports_0,
                      mode: "aspectFit",
                      class: "exit-icon"
                    }))
                  ])
                : _cC("v-if", true),
              _cV(_component_i_icon, _uM({
                name: "/static/reload.png",
                fontSize: "18",
                onClick: handleReload
              })),
              _cV(_component_i_icon, _uM({
                class: "nav-tool-spacing",
                name: "/static/maps.png",
                fontSize: "20",
                onClick: toDeviceList
              })),
              _cV(_component_i_icon, _uM({
                class: "nav-tool-spacing",
                name: "/static/addNew.png",
                fontSize: "18",
                onClick: toAdd
              }))
            ])
          ]),
          isTrue(safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage)
            ? _cE("view", _uM({
                key: 0,
                class: "device-info"
              }), [
                isTrue(safeDeviceDetail.value.deviceStatus.batteryPercent)
                  ? _cV(_component_i_line_progress, _uM({
                      key: 0,
                      percent: safeDeviceDetail.value.deviceStatus.batteryPercent
                    }), null, 8 /* PROPS */, ["percent"])
                  : _cC("v-if", true),
                isTrue(safeDeviceDetail.value.deviceStatus.batteryPercent)
                  ? _cE("view", _uM({
                      key: 1,
                      class: "info"
                    }), "电量: " + _tD(safeDeviceDetail.value.deviceStatus.batteryPercent) + "%", 1 /* TEXT */)
                  : _cC("v-if", true),
                isTrue(safeDeviceDetail.value.deviceStatus.voltage)
                  ? _cE("view", _uM({
                      key: 2,
                      class: "info"
                    }), "电压: " + _tD(safeDeviceDetail.value.deviceStatus.voltage) + "V", 1 /* TEXT */)
                  : _cC("v-if", true)
              ])
            : _cC("v-if", true),
          _cE("view", _uM({ class: "banner" }), [
            _cE("image", _uM({
              src: _imports_1,
              mode: "aspectFit",
              class: "banner-image"
            }))
          ]),
          _cE("view", _uM({ class: "car-state" }), [
            _cE("view", _uM({ class: "state-item" }), [
              _cE("text", _uM({ class: "state-label" }), "设备状态"),
              _cE("text", _uM({
                class: _nC(["state-value", _uM({'online': safeDeviceDetail.value.connectionStatus == 'online'})])
              }), _tD(safeDeviceDetail.value.connectionStatus == 'online' ? '在线' : '离线'), 3 /* TEXT, CLASS */)
            ]),
            _cE("view", _uM({ class: "state-item" }), [
              _cE("text", _uM({ class: "state-label" }), "最后定位"),
              _cE("text", _uM({ class: "state-value" }), _tD(devicePositionUpdateTime.value), 1 /* TEXT */)
            ])
          ])
        ], 4 /* STYLE */),
        _cE("view", _uM({ class: "content" }), [
          _cE("view", _uM({ class: "map-box" }), [
            _cE("view", _uM({ class: "map-header" }), [
              _cE("text", _uM({ class: "map-title" }), "车辆定位"),
              _cE("text", _uM({
                class: "map-refresh",
                onClick: refreshLocation
              }), "刷新位置")
            ]),
            _cE("view", _uM({ class: "map-container" }), [
              isTrue(isMapReady.value)
                ? _cV(_component_map, _uM({
                    key: 0,
                    id: "myMap",
                    latitude: center.latitude,
                    longitude: center.longitude,
                    scale: mapScale.value,
                    style: _nS(_uM({"width":"100%","height":"100%"})),
                    "show-location": true,
                    "enable-traffic": true,
                    "enable-overlooking": true,
                    "enable-building": true,
                    "enable-3D": false,
                    markers: markers.value
                  }), null, 8 /* PROPS */, ["latitude", "longitude", "scale", "style", "markers"])
                : _cC("v-if", true)
            ])
          ]),
          _cE("view", _uM({ class: "mile-record" }), [
            _cE("view", _uM({ class: "record-header" }), [
              _cE("text", _uM({ class: "record-title" }), "轨迹记录"),
              _cE("text", _uM({
                class: "record-desc",
                onClick: toRecordDetail
              }), "更多轨迹")
            ]),
            _cE("view", _uM({ class: "ring-container" }), [
              _cE("view", _uM({ class: "ring-item" }), [
                _cE("view", _uM({ class: "ring-bg green" }), [
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--top-left" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--track" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--top-right" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--bottom-right" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--bottom-left" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ])
                ]),
                _cE("view", _uM({ class: "ring-text" }), [
                  _cE("text", _uM({ class: "unit" }), "条"),
                  _cE("text", _uM({ class: "num" }), _tD(totalTrips.value), 1 /* TEXT */),
                  _cE("text", _uM({ class: "label" }), "今日轨迹")
                ])
              ]),
              _cE("view", _uM({ class: "ring-item" }), [
                _cE("view", _uM({ class: "ring-bg orange" }), [
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--top-left" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--track" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--top-right" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--bottom-right" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ]),
                  _cE("view", _uM({ class: "ring-quarter ring-quarter--bottom-left" }), [
                    _cE("view", _uM({ class: "ring-stroke ring-stroke--active" }))
                  ])
                ]),
                _cE("view", _uM({ class: "ring-text" }), [
                  _cE("text", _uM({ class: "unit" }), "km"),
                  _cE("text", _uM({ class: "num" }), _tD((totalMileage.value/1000).toFixed(2)), 1 /* TEXT */),
                  _cE("text", _uM({ class: "label" }), "今日里程")
                ])
              ])
            ])
          ]),
          _cE("view", _uM({ class: "device-list" }), [
            _cE("view", _uM({
              class: "device-item",
              onClick: toDeviceDetail
            }), [
              _cE("view", _uM({ class: "item-label" }), [
                _cE("view", _uM({ class: "icon icon-device" }), [
                  _cE("image", _uM({
                    src: _imports_2,
                    mode: "aspectFill",
                    class: "icon-image"
                  }))
                ]),
                _cE("view", _uM({ class: "item-info" }), [
                  _cE("text", _uM({ class: "item-title" }), "设备详情"),
                  _cE("text", _uM({ class: "item-desc" }), "查看设备更多详情")
                ])
              ]),
              _cV(_component_i_icon, _uM({
                name: "/static/arrow-right.png",
                fontSize: "15"
              }))
            ]),
            _cE("view", _uM({
              class: "device-item",
              onClick: toFindCar
            }), [
              _cE("view", _uM({ class: "item-label" }), [
                _cE("view", _uM({ class: "icon icon-car" }), [
                  _cE("image", _uM({
                    src: _imports_3,
                    mode: "aspectFill",
                    class: "icon-image"
                  }))
                ]),
                _cE("view", _uM({ class: "item-info" }), [
                  _cE("text", _uM({ class: "item-title" }), "一键寻车"),
                  _cE("text", _uM({ class: "item-desc" }), "点击立即寻找车辆位置")
                ])
              ]),
              _cV(_component_i_icon, _uM({
                name: "/static/arrow-right.png",
                fontSize: "15"
              }))
            ]),
            _cE("view", _uM({
              class: "device-item",
              onClick: toFence
            }), [
              _cE("view", _uM({ class: "item-label" }), [
                _cE("view", _uM({ class: "icon icon-fence" }), [
                  _cE("image", _uM({
                    src: _imports_4,
                    mode: "aspectFill",
                    class: "icon-image"
                  }))
                ]),
                _cE("view", _uM({ class: "item-info" }), [
                  _cE("text", _uM({ class: "item-title" }), "电子围栏"),
                  _cE("text", _uM({ class: "item-desc" }), "点击去设置或者查看电子围栏")
                ])
              ]),
              _cV(_component_i_icon, _uM({
                name: "/static/arrow-right.png",
                fontSize: "15"
              }))
            ])
          ]),
          _cE("view", _uM({ class: "service" }), [
            _cE("text", _uM({ class: "service-header" }), "服务中心"),
            _cE("view", _uM({ class: "service-content" }), [
              _cE("view", _uM({
                class: "service-item",
                onClick: toMsgCenter
              }), [
                _cE("image", _uM({
                  src: _imports_5,
                  mode: "aspectFill",
                  class: "icon-image"
                })),
                _cE("text", _uM({ class: "item-title" }), "警报消息")
              ]),
              _cE("view", _uM({
                class: "service-item",
                onClick: () => {toPay(currentCarIccId.value,currentCarSimMerchant.value)}
              }), [
                _cE("image", _uM({
                  src: _imports_6,
                  mode: "aspectFill",
                  class: "icon-image"
                })),
                _cE("text", _uM({ class: "item-title" }), "一键续费")
              ], 8 /* PROPS */, ["onClick"]),
              _cE("view", _uM({
                class: "service-item",
                onClick: contactCustomerService
              }), [
                _cE("image", _uM({
                  src: _imports_7,
                  mode: "aspectFill",
                  class: "icon-image"
                })),
                _cE("text", _uM({ class: "item-title" }), "在线客服")
              ]),
              _cE("view", _uM({
                class: "service-item",
                onClick: unbindDevice
              }), [
                _cE("image", _uM({
                  src: _imports_8,
                  mode: "aspectFill",
                  class: "icon-image"
                })),
                _cE("text", _uM({
                  class: "item-title",
                  style: _nS(_uM({"color":"#d81e06"}))
                }), "删除设备", 4 /* STYLE */)
              ])
            ])
          ])
        ])
      ]),
      isTrue(showPicker.value)
        ? _cV(_component_i_picker, _uM({
            key: pickerKey.value,
            show: showPicker.value,
            columns: pickerColumns.value,
            defaultIndex: pickerDefaultIndex.value,
            visibleItemCount: 5,
            onConfirm: handleConfirm,
            onCancel: closePicker,
            onClose: closePicker
          }), null, 8 /* PROPS */, ["show", "columns", "defaultIndex"])
        : _cC("v-if", true)
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesIndexIndexStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["backgroundColor", "#E6F9E6"], ["backgroundImage", "linear-gradient(to right, #E6F9E6, #E0F0FF)"]]))], ["page-bg", _uM([[".container ", _uM([["paddingTop", 0], ["paddingRight", "30rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "30rpx"]])]])], ["loading-container", _uM([[".container .page-bg ", _uM([["position", "fixed"], ["top", "50%"], ["left", "50%"], ["transform", "translate(-50%, -50%)"], ["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"], ["zIndex", 999]])]])], ["loading-text", _uM([[".container .page-bg .loading-container ", _uM([["marginTop", "20rpx"], ["fontSize", "28rpx"], ["color", "#666666"]])]])], ["device-car", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["current-car", _uM([[".container .page-bg .top .device-car ", _uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "flex-end"]])]])], ["car-id", _uM([[".container .page-bg .top .device-car .current-car ", _uM([["fontSize", "36rpx"], ["fontWeight", "bold"], ["color", "#000000"], ["textAlign", "center"], ["position", "relative"]])]])], ["login", _uM([[".container .page-bg .top .device-car .current-car ", _uM([["fontSize", "36rpx"], ["fontWeight", "bold"], ["color", "#000000"], ["textAlign", "center"], ["paddingRight", "30rpx"]])]])], ["nav-tools", _uM([[".container .page-bg .top .device-car ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["nav-tool-spacing", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["marginLeft", "30rpx"]])]])], ["exit", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "rgba(0,0,0,0.05)"], ["transitionProperty", "all"], ["transitionDuration", "0.2s"], ["transitionTimingFunction", "ease"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"]])]])], ["exit-icon", _uM([[".container .page-bg .top .device-car .nav-tools .exit ", _uM([["width", "40rpx"], ["height", "40rpx"]])]])], ["device-info", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "column"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "16rpx"], ["borderTopRightRadius", "16rpx"], ["borderBottomRightRadius", "16rpx"], ["borderBottomLeftRadius", "16rpx"], ["width", "50%"]])]])], ["info", _uM([[".container .page-bg .top .device-info .info+", _uM([["marginTop", "16rpx"]])], [".container .page-bg .top .device-info ", _uM([["fontSize", "26rpx"], ["color", "#333333"]])]])], ["banner-image", _uM([[".container .page-bg .top ", _uM([["width", "100%"], ["height", "300rpx"]])]])], ["car-state", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", 0], ["paddingBottom", "20rpx"], ["paddingLeft", 0], ["borderTopLeftRadius", "16rpx"], ["borderTopRightRadius", "16rpx"], ["borderBottomRightRadius", "16rpx"], ["borderBottomLeftRadius", "16rpx"]])]])], ["state-item", _uM([[".container .page-bg .top .car-state .state-item+", _uM([["marginLeft", "20rpx"]])], [".container .page-bg .top .car-state ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"], ["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "30rpx"], ["borderTopRightRadius", "30rpx"], ["borderBottomRightRadius", "30rpx"], ["borderBottomLeftRadius", "30rpx"]])]])], ["state-label", _uM([[".container .page-bg .top .car-state .state-item ", _uM([["fontSize", "24rpx"], ["color", "#999999"]])]])], ["state-value", _uM([[".container .page-bg .top .car-state .state-item ", _uM([["marginTop", "12rpx"], ["fontSize", "25rpx"], ["fontWeight", "bold"], ["color", "#333333"]])], [".container .page-bg .top .car-state .state-item .online", _uM([["color", "#07C160"]])]])], ["map-box", _uM([[".container .page-bg .content ", _uM([["width", "100%"], ["height", "400rpx"], ["marginTop", "10rpx"], ["marginRight", 0], ["marginBottom", "40rpx"], ["marginLeft", 0], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["display", "flex"], ["flexDirection", "column"], ["overflow", "hidden"], ["boxShadow", "0 4rpx 20rpx rgba(0, 0, 0, 0.08)"]])]])], ["map-header", _uM([[".container .page-bg .content .map-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"]])]])], ["map-title", _uM([[".container .page-bg .content .map-box .map-header ", _uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["map-refresh", _uM([[".container .page-bg .content .map-box .map-header ", _uM([["fontSize", "26rpx"], ["color", "#07C160"], ["paddingTop", "8rpx"], ["paddingRight", "16rpx"], ["paddingBottom", "8rpx"], ["paddingLeft", "16rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f9f0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"]])]])], ["map-container", _uM([[".container .page-bg .content .map-box ", _uM([["height", "300rpx"]])]])], ["mile-record", _uM([[".container .page-bg .content ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["display", "flex"], ["flexDirection", "column"], ["overflow", "hidden"], ["boxShadow", "0 4rpx 20rpx rgba(0, 0, 0, 0.08)"]])]])], ["record-header", _uM([[".container .page-bg .content .mile-record ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"]])]])], ["record-title", _uM([[".container .page-bg .content .mile-record .record-header ", _uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["record-desc", _uM([[".container .page-bg .content .mile-record .record-header ", _uM([["fontSize", "26rpx"], ["color", "#07C160"], ["paddingTop", "8rpx"], ["paddingRight", "16rpx"], ["paddingBottom", "8rpx"], ["paddingLeft", "16rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f9f0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"]])]])], ["ring-container", _uM([[".container .page-bg .content .mile-record ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-around"], ["paddingTop", "30rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "20rpx"], ["backgroundColor", "#edf7ff"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"]])]])], ["ring-item", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "relative"], ["width", "250rpx"], ["height", "250rpx"], ["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"]])]])], ["ring-bg", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "250rpx"], ["height", "250rpx"], ["zIndex", 2]])]])], ["ring-quarter", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "125rpx"], ["height", "125rpx"], ["overflow", "hidden"]])]])], ["ring-quarter--top-left", _uM([[".container .page-bg .content .mile-record ", _uM([["top", 0], ["left", 0]])]])], ["ring-quarter--top-right", _uM([[".container .page-bg .content .mile-record ", _uM([["top", 0], ["right", 0]])]])], ["ring-quarter--bottom-right", _uM([[".container .page-bg .content .mile-record ", _uM([["right", 0], ["bottom", 0]])]])], ["ring-quarter--bottom-left", _uM([[".container .page-bg .content .mile-record ", _uM([["bottom", 0], ["left", 0]])]])], ["ring-stroke", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "250rpx"], ["height", "250rpx"], ["boxSizing", "border-box"], ["borderTopWidth", "16rpx"], ["borderRightWidth", "16rpx"], ["borderBottomWidth", "16rpx"], ["borderLeftWidth", "16rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"], ["borderTopLeftRadius", 999], ["borderTopRightRadius", 999], ["borderBottomRightRadius", 999], ["borderBottomLeftRadius", 999]])], [".container .page-bg .content .mile-record .ring-quarter--top-left ", _uM([["top", 0], ["left", 0]])], [".container .page-bg .content .mile-record .ring-quarter--top-right ", _uM([["top", 0], ["right", 0]])], [".container .page-bg .content .mile-record .ring-quarter--bottom-right ", _uM([["right", 0], ["bottom", 0]])], [".container .page-bg .content .mile-record .ring-quarter--bottom-left ", _uM([["bottom", 0], ["left", 0]])]])], ["ring-stroke--track", _uM([[".container .page-bg .content .mile-record ", _uM([["borderTopColor", "#dceaf3"], ["borderRightColor", "#dceaf3"], ["borderBottomColor", "#dceaf3"], ["borderLeftColor", "#dceaf3"], ["borderTopWidth", "5rpx"], ["borderRightWidth", "5rpx"], ["borderBottomWidth", "5rpx"], ["borderLeftWidth", "5rpx"]])]])], ["ring-stroke--active", _uM([[".container .page-bg .content .mile-record ", _uM([["borderTopColor", "#4cd964"], ["borderRightColor", "#4cd964"], ["borderBottomColor", "#4cd964"], ["borderLeftColor", "#4cd964"]])], [".container .page-bg .content .mile-record .ring-bg.orange ", _uM([["borderTopColor", "#ff9500"], ["borderRightColor", "#ff9500"], ["borderBottomColor", "#ff9500"], ["borderLeftColor", "#ff9500"]])]])], ["ring-text", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "relative"], ["zIndex", 10]])]])], ["num", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "45rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["textAlign", "center"]])]])], ["unit", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "20rpx"], ["color", "#666666"], ["textAlign", "right"]])]])], ["label", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "25rpx"], ["color", "#666666"], ["marginTop", "12rpx"], ["textAlign", "center"]])]])], ["device-list", _uM([[".container .page-bg .content ", _uM([["display", "flex"], ["flexDirection", "column"], ["marginTop", "40rpx"], ["marginRight", 0], ["marginBottom", "40rpx"], ["marginLeft", 0]])]])], ["device-item", _uM([[".container .page-bg .content .device-list .device-item+", _uM([["marginTop", "30rpx"]])], [".container .page-bg .content .device-list ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["item-label", _uM([[".container .page-bg .content .device-list .device-item ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]])]])], ["icon", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["width", "80rpx"], ["height", "80rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["paddingTop", "18rpx"], ["paddingRight", "18rpx"], ["paddingBottom", "18rpx"], ["paddingLeft", "18rpx"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-device", _uM([["backgroundColor", "#f0f9f0"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-car", _uM([["backgroundColor", "#f3f8fb"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-fence", _uM([["backgroundColor", "#f1f7f4"]])]])], ["icon-image", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["width", "45rpx"], ["height", "45rpx"]])], [".container .page-bg .content .service .service-content .service-item ", _uM([["width", "60rpx"], ["height", "60rpx"]])]])], ["item-info", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["marginLeft", "20rpx"]])]])], ["item-title", _uM([[".container .page-bg .content .device-list .device-item .item-label .item-info ", _uM([["fontSize", "28rpx"], ["fontWeight", "bold"], ["color", "#333333"]])], [".container .page-bg .content .service .service-content .service-item ", _uM([["marginTop", "10rpx"], ["fontSize", "25rpx"], ["color", "#222222"]])]])], ["item-desc", _uM([[".container .page-bg .content .device-list .device-item .item-label .item-info ", _uM([["color", "#cccccc"], ["fontSize", "24rpx"], ["marginTop", "10rpx"]])]])], ["service", _uM([[".container .page-bg .content ", _uM([["display", "flex"], ["flexDirection", "column"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundColor", "#ffffff"], ["marginBottom", "30rpx"]])]])], ["service-header", _uM([[".container .page-bg .content .service ", _uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"], ["marginBottom", "30rpx"]])]])], ["service-content", _uM([[".container .page-bg .content .service ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"]])]])], ["service-item", _uM([[".container .page-bg .content .service .service-content ", _uM([["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"]])]])], ["@TRANSITION", _uM([["exit", _uM([["property", "all"], ["duration", "0.2s"], ["timingFunction", "ease"]])]])]])]
