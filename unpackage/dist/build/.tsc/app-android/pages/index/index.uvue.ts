import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_i_line_progress from '@/uni_modules/i-ui-x/components/i-line-progress/i-line-progress.uvue'
import _easycom_l_picker from '@/uni_modules/lime-picker/components/l-picker/l-picker.uvue'
import _easycom_l_popup from '@/uni_modules/lime-popup/components/l-popup/l-popup.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import _easycom_app_modal from '@/components/app-modal/app-modal.uvue'
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
import { openLocation } from '../../utils/openLocation.uts'
import { showAppModal, type AppModalSuccess } from '../../utils/modal.uts'
import { ref, reactive, computed, nextTick } from 'vue';
import { clearPushSessionState } from '../../services/push.uts'
import { unbindPushDeviceOnLogout } from '../../services/push-binding.uts'
import { getCustomDeviceList, getUserDeviceList, getDeviceDetail, getDevicePos,getTrackPos,delDevice,logout } from '../../api/request.uts'
import CoordTransform from '../../utils/coordTransform.uts'
import { getTodayZeroTime } from '../../utils/gettime.uts'
import { formatLocalTime, formatTimes } from '../../utils/formateTime.uts'
import { getDeviceIcon } from '../../utils/cars'
import type { PickerColumn, PickerColumnItem, PickerConfirmEvent, PickerValue } from '@/uni_modules/lime-picker'


type Device = {
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
type MapCenter = {
    latitude: number
    longitude: number
}

type UserDeviceListData = {
    list: Array<UTSJSONObject>
}

type PositionState = 'loading' | 'available' | 'empty' | 'invalid' | 'failed'
type DeviceStatus = {
    batteryPercent: number
    voltage: number
    signalStrength: number
}

type DeviceDetailState = {
    deviceStatus: DeviceStatus
    connectionStatus: string
    lastUpdateTime: string
}

type SavedDevice = {
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

const center = reactive<MapCenter>({
    latitude: 39.90469,
    longitude: 116.40717
})
const userLocation = reactive<MapCenter>({
    latitude: 0,
    longitude: 0
})
const hasUserLocation = ref(false)
const hasDevice = ref(false)

const userDeviceList = ref<Array<UTSJSONObject>>([])
const positionState = ref<PositionState>('loading')
const positionMessage = computed<string>(() => {
    if (positionState.value == 'loading') return '正在获取车辆位置'
    if (positionState.value == 'empty') return '暂无车辆定位数据'
    if (positionState.value == 'invalid') return '定位数据异常'
    if (positionState.value == 'failed') return '位置获取失败，请检查网络后重试'
    return ''
})
const initialMapScale = 12
const mapScale = ref(initialMapScale)
const isMapReady = ref(false)
const statusBarHeight = ref(20)
const menuButtonInfo = ref(null)
const navBarHeight = ref(44)
const deviceList = ref<Array<Device>>([])
// picker 相关变量
const showPicker = ref(false)
const pickerValues = ref<PickerValue[]>([])
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
const pickerColumns = computed<PickerColumn[]>(() => {
    return [deviceList.value.map((device): PickerColumnItem => {
        const displayName = device.deviceName || device.name || device.imei || '未命名设备'
        const statusText = device.connectionStatus == 'online' ? '在线' : '离线'
        return {
            id: null,
            label: `${displayName} (${statusText})`,
            value: device.imei || device.deviceId,
            disabled: false,
            children: null
        }
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
        const deviceInfo = {
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
        console.log('保存选中设备成功:', deviceInfo)
    } catch (error) {
        console.error('保存选中设备失败:', error)
    }
}

const decodeSavedDevice = (raw: any): SavedDevice | null => {
    if (raw == null || raw == '') return null
    let data: UTSJSONObject | null = null
    if (typeof raw == 'string') {
        try {
            data = JSON.parse(raw) as UTSJSONObject
        } catch (error) {
            return null
        }
    } else {
        data = raw as UTSJSONObject
    }
    if (data == null) return null
    const imei = data.getString('imei', '')
    const deviceId = data.getString('deviceId', '')
    if (imei == '' && deviceId == '') return null
    const identity = imei != '' ? imei : deviceId
    const device: SavedDevice = {
        name: data.getString('name', identity),
        deviceName: data.getString('deviceName', data.getString('name', identity)),
        imei: imei,
        deptId: data.getString('deptId', ''),
        deviceId: deviceId,
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
        console.error('获取保存设备失败:', error)
    }
    return null
}

// 清除保存的选中设备
const clearSavedSelectedDevice = () => {
    try {
        uni.removeStorageSync(SELECTED_DEVICE_STORAGE_KEY)
        console.log('清除保存设备成功')
    } catch (error) {
        console.error('清除保存设备失败:', error)
    }
}

// 保存选中的设备索引
const saveSelectedDeviceIndex = (index: number) => {
    try {
        uni.setStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY, index)
    } catch (error) {
        console.error('保存选中设备索引失败:', error)
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
        console.error('获取保存设备索引失败:', error)
    }
    return null
}

// 清除保存的选中设备索引
const clearSavedSelectedDeviceIndex = () => {
    try {
        uni.removeStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY)
    } catch (error) {
        console.error('清除保存设备索引失败:', error)
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

// 查找设备在当前列表中的索引，IMEI 优先，缺失时使用设备 ID
const findDeviceIndex = (imei: string, deviceId: string): number => {
    if (imei != '') {
        const imeiIndex = deviceList.value.findIndex(device =>
            device.imei == imei || device.value == imei
        )
        if (imeiIndex != -1) return imeiIndex
    }
    if (deviceId != '') {
        return deviceList.value.findIndex(device => device.deviceId == deviceId)
    }
    return -1
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

    const currentIndex = findDeviceIndex(currentCarImei.value, currentCarDeviceId.value)
    const savedDevice = getSavedSelectedDevice()
    const savedDeviceIndex = savedDevice != null
        ? findDeviceIndex(savedDevice.imei, savedDevice.deviceId)
        : -1
    const savedIndex = getSavedSelectedDeviceIndex()

    let selectedIndex = currentIndex
    if (selectedIndex == -1) selectedIndex = savedDeviceIndex
    if (selectedIndex == -1 && savedIndex != null && savedIndex < deviceList.value.length) {
        selectedIndex = savedIndex
    }
    if (selectedIndex == -1) selectedIndex = 0

    const selectedDevice = deviceList.value[selectedIndex]
    if (selectedDevice == null) return

    pickerValues.value = [selectedDevice.imei || selectedDevice.deviceId]
    showPicker.value = true
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
        iconPath: type == 'user' ? '/static/current-location.png' : getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value),
        width: 30,
        height: 30,
        anchor: { x: 0.5, y: 0.5 },
        callout: callout
    }
}

// 获取用户当前位置
const userLocationMarkerId = 1

async function centerOnUserLocation() {
    if (!hasUserLocation.value) return
    isMapReady.value = false
    center.latitude = userLocation.latitude
    center.longitude = userLocation.longitude
    markers.value = []

    await delay(100)
    if (hasDevice.value) return

    const nextMarker = createMarker(
        userLocationMarkerId,
        userLocation.latitude,
        userLocation.longitude,
        'user',
        '当前位置'
    )
    markers.value = [nextMarker]
    isMapReady.value = true
}

function getUserLocation() {
    uni.getLocation({
        type: 'gcj02',
        success: (res) => {
            console.log('用户当前位置:', res)
            userLocation.latitude = res.latitude
            userLocation.longitude = res.longitude
            hasUserLocation.value = true
            if (!hasDevice.value) {
                centerOnUserLocation()
            }
        },
        fail: (err) => {
            console.error('获取用户当前位置失败:', err.errMsg, err)
        }
    })
}

// 加载车辆详情
const loadDeviceDetail = async (deviceId: string) => {
    try {
        const res = await getDeviceDetail(deviceId)
        const detail = res.data
        if (res.code != 200 || detail == null) {
            console.error('加载设备详情失败:', res.msg)
            return
        }
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
                const formattedTime = formatLocalTime(updateTime)
                if (formattedTime != '') lastUpdateTime.value = formattedTime
            }
        }
    } catch (error) {
        console.error('加载设备详情失败', error)
    }
}

// 加载轨迹轨迹
const trackPosInfo = ref<any>({})
const tripData = ref<Array<UTSJSONObject>>([])
const totalMileage = ref(0)
const averageSpeed = ref(0)
let trackRequestId = 0

const clearTripData = () : void => {
    tripData.value = []
    totalMileage.value = 0
    averageSpeed.value = 0
}

const clearCurrentCar = (): void => {
    currentCarImei.value = ''
    currentCarDeptId.value = ''
    currentCarDeviceId.value = ''
    currentCarIccId.value = ''
    currentCarName.value = ''
    currentCarSimMerchant.value = ''
    currentCarConnectionStatus.value = ''
    currentCarCarType.value = ''
    currentCarPlateNo.value = ''
    pickerValues.value = []
    deviceDetail.value = {
        deviceStatus: {
            batteryPercent: 0,
            voltage: 0,
            signalStrength: 0
        },
        connectionStatus: 'offline',
        lastUpdateTime: ''
    }
    lastUpdateTime.value = '--:--:--'
    clearTripData()
}

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
        clearTripData()
    }
}

const createTrackRequestData = (imei: string) : UTSJSONObject => {
    const timeRange = getTodayZeroTime()
    return {
        imei: imei,
        startTime: formatTimes(timeRange.todayZero),
        endTime: formatTimes(timeRange.nowTime),
        minParkTime: 120,
        withStop: false,
        withPos: false,
        withTrip: true,
    } as UTSJSONObject
}

const loadTrackPos = async (data: UTSJSONObject) : Promise<void> => {
    const requestId = ++trackRequestId
    try {
        const res = await getTrackPos(data)
        if (requestId != trackRequestId) return

        if (res.code != 200) {
            console.error('加载轨迹失败:', res.msg)
            clearTripData()
            return
        }

        const trackData = res.data
        if (trackData == null) {
            clearTripData()
            return
        }
        processTripData(trackData)
    } catch (error) {
        if (requestId != trackRequestId) return
        console.error('加载轨迹失败', error)
        clearTripData()
    }
}

// 地图已被用户拖动后，响应式 center 属性不会强制改变原生地图视野。
// 重新挂载地图以确保各端都按受控中心点和缩放级别显示，避免单点 includePoints 在 iOS 上放大视野。
const centerMapOnDevice = async (latitude: number, longitude: number): Promise<void> => {
    center.latitude = latitude
    center.longitude = longitude
    mapScale.value = initialMapScale
    isMapReady.value = false
    await nextTick()
    await delay(50)
    isMapReady.value = true
}

// 加载设备位置
const devicePosInfo = ref<UTSJSONObject | null>(null)
const devicePositionUpdateTime = computed<string>(() => {
    const position = devicePosInfo.value
    return position != null ? position.getString('positionUpdateTime', '暂无位置') : '暂无位置'
})
const loadDevicePos = async (data: UTSJSONObject) : Promise<boolean> => {
    positionState.value = 'loading'
    try {
        const res = await getDevicePos(data)
        const positions = res.data
        if (res.code != 200 || positions == null || positions.length == 0) {
            console.warn('获取设备位置失败:', data.getString('deviceId', ''), res.code)
            positionState.value = 'empty'
            return false
        }

        const position = positions[0]
        devicePosInfo.value = position

        const lat = position.getNumber('latitude', 0)
        const lng = position.getNumber('longitude', 0)
        const isValidCoordinate = !isNaN(lat) && !isNaN(lng) &&
            lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 &&
            !(lat == 0 && lng == 0)

        if (!isValidCoordinate) {
            console.error('经纬度格式错误', position.getString('latitude', ''), position.getString('longitude', ''))
            positionState.value = 'invalid'
            showAppToast({
                title: '定位数据异常',
                icon: 'none'
            })
            return false
        }

        const convertedCoord = CoordTransform.wgs84ToTencent(lat, lng)
        positionState.value = 'available'

        const nextMarker = createMarker(
            1,
            convertedCoord.lat,
            convertedCoord.lng,
            'device',
            currentCarName.value
        )

        // 使用新数组触发原生地图的标记点更新。
        markers.value = [nextMarker]
        try {
            await centerMapOnDevice(convertedCoord.lat, convertedCoord.lng)
        } catch (mapError) {
            // 原生地图视图刷新异常不应覆盖已成功取得的车辆位置。
            console.error('刷新地图视图失败', mapError)
        }
        console.log('标记点更新完成:', data.getString('deviceId', ''), convertedCoord.lat, convertedCoord.lng)
        return true
    } catch (error) {
        console.error('加载设备位置失败', error)
        positionState.value = 'failed'
        showAppToast({
            title: '定位失败，请重试',
            icon: 'none'
        })
        return false
    }
}

// 加载设备数据
const loadDeviceData = async (device: Device) => {
    console.log('开始加载设备数据:', device)
    try {
        await loadDeviceDetail(device.deviceId);
        await loadDevicePos({
            deviceId: device.deviceId,
            deviceids: device.imei || device.value
        })
        await loadTrackPos(createTrackRequestData(device.imei || device.value))
        showAppToast({
            title: '切换成功',
            icon: 'none'
        })
    } catch (error) {
        console.error('切换车辆失败', error)
        showAppToast({
            title: '切换失败，请重试',
            icon: 'none'
        })
    } finally {
        uni.hideLoading()
    }
}

// 处理选择车辆确认
const handlePickerConfirm = (e: PickerConfirmEvent) => {
    showPicker.value = false

    const selectedValue = e.values.length > 0 ? e.values[0].toString() : ''
    let selectedIndex = -1
    if (selectedValue != '') {
        selectedIndex = deviceList.value.findIndex(device =>
            device.imei == selectedValue || device.value == selectedValue || device.deviceId == selectedValue
        )
    }

    if (selectedIndex < 0 && e.indexs.length > 0) {
        const eventIndex = e.indexs[0]
        if (eventIndex >= 0 && eventIndex < deviceList.value.length) {
            selectedIndex = eventIndex
        }
    }

    if (selectedIndex < 0) {
        selectedIndex = findDeviceIndex(currentCarImei.value, currentCarDeviceId.value)
    }
    if (selectedIndex < 0 && deviceList.value.length > 0) {
        selectedIndex = 0
    }

    const selectedDevice = selectedIndex >= 0 ? deviceList.value[selectedIndex] : null
    if (selectedDevice == null) {
        showAppToast({
            title: '选择设备失败',
            icon: 'none'
        })
        return
    }

    if (selectedDevice.imei == currentCarImei.value && selectedDevice.deviceId == currentCarDeviceId.value) {
        console.log('选择的设备与当前设备相同，不重复加载')
        return
    }

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

    saveSelectedDeviceIndex(selectedIndex)
    pickerValues.value = [selectedDevice.imei || selectedDevice.deviceId]
    saveSelectedDevice(selectedDevice)

    uni.showLoading({
        title: '加载车辆数据...',
        mask: true
    })

    loadDeviceData(selectedDevice)
}

// 加载车辆列表
const loadDeviceList = async () => {
    hasDevice.value = false
    getUserLocation()
    try {
        const res = await getUserDeviceList({
            pageSize: 1000
        })
        if (res.code != 200) {
            showAppToast({
                title: res.msg || '加载车辆列表失败',
                icon: 'none'
            })
            return
        }
        console.log('加载车辆列表返回:', res.data)
        const pageData = res.data
        if (pageData == null) {
            userDeviceList.value = []
            deviceList.value = []
            clearCurrentCar()
            markers.value = []
            positionState.value = 'empty'
            if (hasUserLocation.value) {
                await centerOnUserLocation()
            }
            showAppToast({
                title: '暂无车辆数据',
                icon: 'none'
            })
            return
        }
        const list : Array<UTSJSONObject> = pageData.list
        if (list != null && list.length > 0) {
            hasDevice.value = true
            markers.value = []
            userDeviceList.value = list
            deviceList.value = list.map((item: UTSJSONObject): Device => {
                const imei = item.getString('imei', '')
                const rawDeviceName = item.getString('deviceName', '')
                const deviceName = rawDeviceName != '' ? rawDeviceName : (imei != '' ? imei : '未命名设备')
                const apiDeptId = item.getString('deptId', '')
                const deptId = apiDeptId != '' ? apiDeptId : item.getString('companyId', '')
                return {
                    name: deviceName,
                    deviceName: deviceName,
                    value: imei,
                    imei: imei,
                    deptId: deptId,
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

            // 优先按保存的设备身份恢复，避免列表排序变化后选中错误车辆
            if (savedDevice != null) {
                selectedIdx = findDeviceIndex(savedDevice.imei, savedDevice.deviceId)
                if (selectedIdx != -1) {
                    selectedDevice = deviceList.value[selectedIdx]
                    saveSelectedDeviceIndex(selectedIdx)
                } else {
                    clearSavedSelectedDevice()
                    clearSavedSelectedDeviceIndex()
                }
            }

            // 没有可用设备身份时，才使用保存的索引作为兼容回退
            if (selectedDevice == null && savedIndex != null && savedIndex < deviceList.value.length) {
                selectedDevice = deviceList.value[savedIndex]
                selectedIdx = savedIndex
            }

            // 如果没有保存的设备或保存的设备无效，使用第一个设备
            if (!selectedDevice && deviceList.value.length > 0) {
                selectedDevice = deviceList.value[0]
                selectedIdx = 0
                // 保存第一个设备作为默认选中
                saveSelectedDevice(selectedDevice)
                saveSelectedDeviceIndex(0)
                console.log('使用第一个设备作为默认:', selectedDevice?.deviceName)
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

                pickerValues.value = [device.imei != '' ? device.imei : device.deviceId]

                await loadDeviceDetail(device.deviceId);
                await loadDevicePos({
                    deviceId: device.deviceId,
                    deviceids: device.imei != '' ? device.imei : device.value
                })
                await loadTrackPos(createTrackRequestData(device.imei != '' ? device.imei : device.value))
            }
        } else {
            userDeviceList.value = []
            deviceList.value = []
            clearCurrentCar()
            markers.value = []
            positionState.value = 'empty'
            if (hasUserLocation.value) {
                await centerOnUserLocation()
            }

            showAppToast({
                title: '暂无车辆数据',
                icon: 'none'
            })
        }
    } catch (error) {
        console.error('加载车辆列表失败', error)
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
    if (!hasDevice.value) {
        await centerOnUserLocation()
        return
    }

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
        await loadDevicePos({
            deviceId: currentCarDeviceId.value,
            deviceids: currentCarImei.value
        } as UTSJSONObject)
    } catch (error) {
        console.error('刷新位置失败', error)
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

function isCarSelected() : boolean {
    if (!hasDevice.value || !currentCarDeviceId.value) {
        showAppToast({
            title: '请先选择车辆',
            icon: 'none'
        })
        return false
    }
    return true
}

// 跳转轨迹详情
const toRecordDetail = () => {
    if (!isLogin()) return
    if (!isCarSelected()) return
    uni.navigateTo({
        url: '/pages/playBack/playBack?imei=' + currentCarImei.value + '&connectionStatus=' + currentCarConnectionStatus.value + '&plateNo=' + currentCarPlateNo.value + '&carType=' + currentCarCarType.value + '&lat=' + center.latitude + '&lng=' + center.longitude,
        fail: (err) => {
            if (err.errMsg.indexOf('locked') < 0) console.error('跳转轨迹详情失败:', err)
        }
    })
}

// 跳转全部设备
const toDeviceList = () => {
    if (!isLogin()) return
    uni.navigateTo({
        url: '/pages/deviceList/deviceList',
    })
}

// 跳转设备详情
const toDeviceDetail = (e: any) => {
    if (!isLogin()) return
    if (!isCarSelected()) return
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
            if (err.errMsg.indexOf('locked') < 0) console.error('跳转添加设备失败:', err)
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
    if (!isCarSelected()) return
    if (positionState.value != 'available') {
        showAppToast({
            title: positionMessage.value || '暂无有效车辆位置',
            icon: 'none'
        })
        return
    }
    openLocation({
        latitude: center.latitude,
        longitude: center.longitude,
        name: currentCarName.value
    })
}

// 跳转围栏
const toFence = () => {
    if (!isLogin()) return
    if (!isCarSelected()) return
    uni.navigateTo({
        url: '/pages/geofencing/geofencing?imei=' + currentCarImei.value + '&connectionStatus=' + currentCarConnectionStatus.value  + '&carType=' + currentCarCarType.value + '&deptId=' + currentCarDeptId.value + '&deviceName=' + currentCarName.value
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
    if (!isCarSelected()) return
    if(simMerchant.toLowerCase() == 'zddx'){
        iccid = iccid.substring(0,iccid.length-1)
    }
    needRefresh.value = true





















    console.log('iccid',iccid)
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
    isMapReady.value = false
    nextTick(() => {
        uni.navigateTo({
            url: '/pages/login/login',
        })
    })
}

async function unbindCurrentDevice() : Promise<void> {
    const result = await delDevice(currentCarDeviceId.value)
    console.log('解绑设备结果:', result)
    if (result.code == 200) {
        showAppToast({
            title: '解绑成功',
            icon: 'none'
        })
        clearSavedSelectedDevice()
        clearSavedSelectedDeviceIndex()

        await loadDeviceList()
    } else {
        showAppToast({
            title: '解绑失败',
            icon: 'error'
        })
    }
}

// 解绑设备
const unbindDevice = () : void => {
    if (!isLogin()) return
    if (!isCarSelected()) return
    showAppModal({
        title: '解绑车辆',
        content: '确定解绑当前车辆吗？',
        success: (res: AppModalSuccess) : void => {
            if (res.confirm) {
                void unbindCurrentDevice()
            }
        }
    })
}

// 退出登录
const handleExit = () => {
    if (!isLogin()) return
    showAppModal({
        title: '退出登录',
        content: '确定退出登录吗？',
        success: async (res) => {
            if (res.confirm) {
                await unbindPushDeviceOnLogout()
                const res = await logout()
                if(res.code == 200){
                    clearSavedSelectedDevice()
                    clearSavedSelectedDeviceIndex()
                    uni.removeStorageSync('token')
                    clearPushSessionState()
                    uni.reLaunch({
                        url:'/pages/login/login'
                    })
                }else{
                    showAppToast({
                        title: res.msg || '退出账户失败'
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
const _component_l_picker = resolveEasyComponent("l-picker",_easycom_l_picker)
const _component_l_popup = resolveEasyComponent("l-popup",_easycom_l_popup)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)
const _component_app_modal = resolveEasyComponent("app-modal",_easycom_app_modal)

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
              _cE("view", _uM({
                class: "nav-tool-spacing nav-tool-add",
                onClick: toAdd
              }), [
                _cE("image", _uM({
                  src: "/static/addNew.png",
                  mode: "aspectFit",
                  class: "nav-tool-add-image"
                }))
              ])
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
              _cE("view", _uM({
                class: "map-refresh-wrap",
                onClick: refreshLocation
              }), [
                _cE("text", _uM({ class: "map-refresh" }), "刷新位置")
              ])
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
              _cE("view", _uM({
                class: "record-desc-wrap",
                onClick: toRecordDetail
              }), [
                _cE("text", _uM({ class: "record-desc" }), "更多轨迹")
              ])
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
                  mode: "aspectFit",
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
                  mode: "aspectFit",
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
                  mode: "aspectFit",
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
                  mode: "aspectFit",
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
      _cV(_component_l_popup, _uM({
        modelValue: showPicker.value,
        "onUpdate:modelValue": $event => {(showPicker).value = $event},
        position: "bottom",
        closeable: false,
        "safe-area-inset-bottom": true
      }), _uM({
        default: withSlotCtx((): any[] => [
          _cV(_component_l_picker, _uM({
            modelValue: pickerValues.value,
            "onUpdate:modelValue": $event => {(pickerValues).value = $event},
            "cancel-btn": "取消",
            "confirm-btn": "确认",
            columns: pickerColumns.value,
            onCancel: closePicker,
            onConfirm: handlePickerConfirm
          }), null, 8 /* PROPS */, ["modelValue", "onUpdate:modelValue", "columns"])
        ]),
        _: 1 /* STABLE */
      }), 8 /* PROPS */, ["modelValue", "onUpdate:modelValue"])
    ]),
    _cV(_component_app_toast),
    _cV(_component_app_modal)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesIndexIndexStyles = [_uM([["container", _pS(_uM([["height", "100%"], ["backgroundColor", "#E6F9E6"], ["backgroundImage", "linear-gradient(to right, #E6F9E6, #E0F0FF)"]]))], ["page-bg", _uM([[".container ", _uM([["paddingTop", 0], ["paddingRight", "30rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "30rpx"]])]])], ["loading-container", _uM([[".container .page-bg ", _uM([["position", "fixed"], ["top", "50%"], ["left", "50%"], ["transform", "translate(-50%, -50%)"], ["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"], ["zIndex", 999]])]])], ["loading-text", _uM([[".container .page-bg .loading-container ", _uM([["marginTop", "20rpx"], ["fontSize", "28rpx"], ["color", "#666666"]])]])], ["device-car", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["current-car", _uM([[".container .page-bg .top .device-car ", _uM([["position", "relative"], ["display", "flex"], ["flexDirection", "row"], ["alignItems", "flex-end"]])]])], ["car-id", _uM([[".container .page-bg .top .device-car .current-car ", _uM([["fontSize", "36rpx"], ["fontWeight", "bold"], ["color", "#000000"], ["textAlign", "center"], ["position", "relative"]])]])], ["login", _uM([[".container .page-bg .top .device-car .current-car ", _uM([["fontSize", "36rpx"], ["fontWeight", "bold"], ["color", "#000000"], ["textAlign", "center"], ["paddingRight", "10rpx"]])]])], ["nav-tools", _uM([[".container .page-bg .top .device-car ", _uM([["display", "flex"], ["flexShrink", 0], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["nav-tool-spacing", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["flexShrink", 0], ["marginLeft", "30rpx"]])]])], ["nav-tool-add", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["display", "flex"], ["width", "40rpx"], ["height", "40rpx"], ["alignItems", "center"], ["justifyContent", "center"]])]])], ["nav-tool-add-image", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["width", "36rpx"], ["height", "36rpx"]])]])], ["exit", _uM([[".container .page-bg .top .device-car .nav-tools ", _uM([["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "10rpx"], ["paddingRight", "10rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "10rpx"], ["backgroundColor", "rgba(0,0,0,0.05)"], ["transitionProperty", "all"], ["transitionDuration", "0.2s"], ["transitionTimingFunction", "ease"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"]])]])], ["exit-icon", _uM([[".container .page-bg .top .device-car .nav-tools .exit ", _uM([["width", "40rpx"], ["height", "40rpx"]])]])], ["device-info", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "column"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "16rpx"], ["borderTopRightRadius", "16rpx"], ["borderBottomRightRadius", "16rpx"], ["borderBottomLeftRadius", "16rpx"], ["width", "50%"]])]])], ["info", _uM([[".container .page-bg .top .device-info .info+", _uM([["marginTop", "16rpx"]])], [".container .page-bg .top .device-info ", _uM([["fontSize", "26rpx"], ["color", "#333333"]])]])], ["banner-image", _uM([[".container .page-bg .top ", _uM([["width", "100%"], ["height", "300rpx"]])]])], ["car-state", _uM([[".container .page-bg .top ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", 0], ["paddingBottom", "20rpx"], ["paddingLeft", 0], ["borderTopLeftRadius", "16rpx"], ["borderTopRightRadius", "16rpx"], ["borderBottomRightRadius", "16rpx"], ["borderBottomLeftRadius", "16rpx"]])]])], ["state-item", _uM([[".container .page-bg .top .car-state .state-item+", _uM([["marginLeft", "20rpx"]])], [".container .page-bg .top .car-state ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"], ["backgroundColor", "#ffffff"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "30rpx"], ["borderTopRightRadius", "30rpx"], ["borderBottomRightRadius", "30rpx"], ["borderBottomLeftRadius", "30rpx"]])]])], ["state-label", _uM([[".container .page-bg .top .car-state .state-item ", _uM([["fontSize", "24rpx"], ["color", "#999999"]])]])], ["state-value", _uM([[".container .page-bg .top .car-state .state-item ", _uM([["marginTop", "12rpx"], ["fontSize", "25rpx"], ["fontWeight", "bold"], ["color", "#333333"]])], [".container .page-bg .top .car-state .state-item .online", _uM([["color", "#07C160"]])]])], ["map-box", _uM([[".container .page-bg .content ", _uM([["width", "100%"], ["height", "400rpx"], ["marginTop", "10rpx"], ["marginRight", 0], ["marginBottom", "40rpx"], ["marginLeft", 0], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["display", "flex"], ["flexDirection", "column"], ["overflow", "hidden"], ["boxShadow", "0 4rpx 20rpx rgba(0, 0, 0, 0.08)"]])]])], ["map-header", _uM([[".container .page-bg .content .map-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"]])]])], ["map-title", _uM([[".container .page-bg .content .map-box .map-header ", _uM([["flexShrink", 0], ["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["map-refresh-wrap", _uM([[".container .page-bg .content .map-box .map-header ", _uM([["display", "flex"], ["flexShrink", 0], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "8rpx"], ["paddingRight", "16rpx"], ["paddingBottom", "8rpx"], ["paddingLeft", "16rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f9f0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"]])]])], ["map-refresh", _uM([[".container .page-bg .content .map-box .map-header .map-refresh-wrap ", _uM([["fontSize", "26rpx"], ["lineHeight", "42rpx"], ["color", "#07C160"], ["whiteSpace", "nowrap"]])]])], ["map-container", _uM([[".container .page-bg .content .map-box ", _uM([["position", "relative"], ["height", "300rpx"]])]])], ["map-status", _uM([[".container .page-bg .content .map-box .map-container ", _uM([["position", "absolute"], ["left", "24rpx"], ["right", "24rpx"], ["bottom", "24rpx"], ["paddingTop", "16rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "16rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "12rpx"], ["borderTopRightRadius", "12rpx"], ["borderBottomRightRadius", "12rpx"], ["borderBottomLeftRadius", "12rpx"], ["backgroundColor", "rgba(0,0,0,0.68)"], ["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["map-status-text", _uM([[".container .page-bg .content .map-box .map-container .map-status ", _uM([["color", "#ffffff"], ["fontSize", "24rpx"]])]])], ["map-status-retry", _uM([[".container .page-bg .content .map-box .map-container .map-status ", _uM([["flexShrink", 0], ["marginLeft", "20rpx"], ["color", "#8de39b"], ["fontSize", "24rpx"]])]])], ["mile-record", _uM([[".container .page-bg .content ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["display", "flex"], ["flexDirection", "column"], ["overflow", "hidden"], ["boxShadow", "0 4rpx 20rpx rgba(0, 0, 0, 0.08)"]])]])], ["record-header", _uM([[".container .page-bg .content .mile-record ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"]])]])], ["record-title", _uM([[".container .page-bg .content .mile-record .record-header ", _uM([["flexShrink", 0], ["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"]])]])], ["record-desc-wrap", _uM([[".container .page-bg .content .mile-record .record-header ", _uM([["display", "flex"], ["flexShrink", 0], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "8rpx"], ["paddingRight", "16rpx"], ["paddingBottom", "8rpx"], ["paddingLeft", "16rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f9f0"], ["borderTopLeftRadius", "8rpx"], ["borderTopRightRadius", "8rpx"], ["borderBottomRightRadius", "8rpx"], ["borderBottomLeftRadius", "8rpx"]])]])], ["record-desc", _uM([[".container .page-bg .content .mile-record .record-header .record-desc-wrap ", _uM([["fontSize", "26rpx"], ["lineHeight", "42rpx"], ["color", "#07C160"], ["whiteSpace", "nowrap"]])]])], ["ring-container", _uM([[".container .page-bg .content .mile-record ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-around"], ["paddingTop", "30rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "30rpx"], ["paddingLeft", "20rpx"], ["backgroundColor", "#edf7ff"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"]])]])], ["ring-item", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "relative"], ["width", "250rpx"], ["height", "250rpx"], ["display", "flex"], ["alignItems", "center"], ["justifyContent", "center"]])]])], ["ring-bg", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "250rpx"], ["height", "250rpx"], ["zIndex", 2]])]])], ["ring-quarter", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "125rpx"], ["height", "125rpx"], ["overflow", "hidden"]])]])], ["ring-quarter--top-left", _uM([[".container .page-bg .content .mile-record ", _uM([["top", 0], ["left", 0]])]])], ["ring-quarter--top-right", _uM([[".container .page-bg .content .mile-record ", _uM([["top", 0], ["right", 0]])]])], ["ring-quarter--bottom-right", _uM([[".container .page-bg .content .mile-record ", _uM([["right", 0], ["bottom", 0]])]])], ["ring-quarter--bottom-left", _uM([[".container .page-bg .content .mile-record ", _uM([["bottom", 0], ["left", 0]])]])], ["ring-stroke", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "absolute"], ["width", "250rpx"], ["height", "250rpx"], ["boxSizing", "border-box"], ["borderTopWidth", "16rpx"], ["borderRightWidth", "16rpx"], ["borderBottomWidth", "16rpx"], ["borderLeftWidth", "16rpx"], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"], ["borderTopLeftRadius", 999], ["borderTopRightRadius", 999], ["borderBottomRightRadius", 999], ["borderBottomLeftRadius", 999]])], [".container .page-bg .content .mile-record .ring-quarter--top-left ", _uM([["top", 0], ["left", 0]])], [".container .page-bg .content .mile-record .ring-quarter--top-right ", _uM([["top", 0], ["right", 0]])], [".container .page-bg .content .mile-record .ring-quarter--bottom-right ", _uM([["right", 0], ["bottom", 0]])], [".container .page-bg .content .mile-record .ring-quarter--bottom-left ", _uM([["bottom", 0], ["left", 0]])]])], ["ring-stroke--track", _uM([[".container .page-bg .content .mile-record ", _uM([["borderTopColor", "#dceaf3"], ["borderRightColor", "#dceaf3"], ["borderBottomColor", "#dceaf3"], ["borderLeftColor", "#dceaf3"], ["borderTopWidth", "5rpx"], ["borderRightWidth", "5rpx"], ["borderBottomWidth", "5rpx"], ["borderLeftWidth", "5rpx"]])]])], ["ring-stroke--active", _uM([[".container .page-bg .content .mile-record ", _uM([["borderTopColor", "#4cd964"], ["borderRightColor", "#4cd964"], ["borderBottomColor", "#4cd964"], ["borderLeftColor", "#4cd964"]])], [".container .page-bg .content .mile-record .ring-bg.orange ", _uM([["borderTopColor", "#ff9500"], ["borderRightColor", "#ff9500"], ["borderBottomColor", "#ff9500"], ["borderLeftColor", "#ff9500"]])]])], ["ring-text", _uM([[".container .page-bg .content .mile-record ", _uM([["position", "relative"], ["zIndex", 10]])]])], ["num", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "45rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["textAlign", "center"]])]])], ["unit", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "20rpx"], ["color", "#666666"], ["textAlign", "right"]])]])], ["label", _uM([[".container .page-bg .content .mile-record ", _uM([["fontSize", "25rpx"], ["color", "#666666"], ["marginTop", "12rpx"], ["textAlign", "center"]])]])], ["device-list", _uM([[".container .page-bg .content ", _uM([["display", "flex"], ["flexDirection", "column"], ["marginTop", "40rpx"], ["marginRight", 0], ["marginBottom", "40rpx"], ["marginLeft", 0]])]])], ["device-item", _uM([[".container .page-bg .content .device-list .device-item+", _uM([["marginTop", "30rpx"]])], [".container .page-bg .content .device-list ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"]])]])], ["item-label", _uM([[".container .page-bg .content .device-list .device-item ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"]])]])], ["icon", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["width", "80rpx"], ["height", "80rpx"], ["borderTopLeftRadius", "50%"], ["borderTopRightRadius", "50%"], ["borderBottomRightRadius", "50%"], ["borderBottomLeftRadius", "50%"], ["paddingTop", "18rpx"], ["paddingRight", "18rpx"], ["paddingBottom", "18rpx"], ["paddingLeft", "18rpx"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-device", _uM([["backgroundColor", "#f0f9f0"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-car", _uM([["backgroundColor", "#f3f8fb"]])], [".container .page-bg .content .device-list .device-item .item-label .icon-fence", _uM([["backgroundColor", "#f1f7f4"]])]])], ["icon-image", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["width", "45rpx"], ["height", "45rpx"]])], [".container .page-bg .content .service .service-content .service-item ", _uM([["width", "60rpx"], ["height", "60rpx"]])]])], ["item-info", _uM([[".container .page-bg .content .device-list .device-item .item-label ", _uM([["marginLeft", "20rpx"]])]])], ["item-title", _uM([[".container .page-bg .content .device-list .device-item .item-label .item-info ", _uM([["fontSize", "28rpx"], ["fontWeight", "bold"], ["color", "#333333"]])], [".container .page-bg .content .service .service-content .service-item ", _uM([["marginTop", "10rpx"], ["fontSize", "25rpx"], ["color", "#222222"]])]])], ["item-desc", _uM([[".container .page-bg .content .device-list .device-item .item-label .item-info ", _uM([["color", "#cccccc"], ["fontSize", "24rpx"], ["marginTop", "10rpx"]])]])], ["service", _uM([[".container .page-bg .content ", _uM([["display", "flex"], ["flexDirection", "column"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["backgroundColor", "#ffffff"], ["marginBottom", "30rpx"]])]])], ["service-header", _uM([[".container .page-bg .content .service ", _uM([["fontSize", "32rpx"], ["fontWeight", "bold"], ["color", "#333333"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#f0f0f0"], ["marginBottom", "30rpx"]])]])], ["service-content", _uM([[".container .page-bg .content .service ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"]])]])], ["service-item", _uM([[".container .page-bg .content .service .service-content ", _uM([["display", "flex"], ["flexDirection", "column"], ["alignItems", "center"]])]])], ["@TRANSITION", _uM([["exit", _uM([["property", "all"], ["duration", "0.2s"], ["timingFunction", "ease"]])]])]])]
