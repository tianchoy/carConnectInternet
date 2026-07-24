import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import _easycom_sub_navBar from '@/components/sub-navBar/sub-navBar.uvue'
import _easycom_i_icon from '@/uni_modules/i-ui-x/components/i-icon/i-icon.uvue'
import _easycom_i_grid from '@/uni_modules/i-ui-x/components/i-grid/i-grid.uvue'
import _easycom_i_input from '@/uni_modules/i-ui-x/components/i-input/i-input.uvue'
import _easycom_i_modal from '@/uni_modules/i-ui-x/components/i-modal/i-modal.uvue'
import _easycom_app_toast from '@/components/app-toast/app-toast.uvue'
import { showAppToast } from '../../utils/toast.uts'
	import { getDevicePos, getUserDeviceList, getDeviceDetail, sendCommand } from '../../api/request.uts'
	import { getAddress } from '../../utils/getAdress.uts'
	import { getDeviceIcon } from '../../utils/cars'
	// 导入坐标转换插件
	import CoordTransform from '../../utils/coordTransform.uts'

	type MapCenter = { __$originalPosition?: UTSSourceMapPosition<"MapCenter", "pages/carInfoDetail/carInfoDetail.uvue", 124, 7>;
		latitude: number
		longitude: number
	}
	type SignalDetail = { __$originalPosition?: UTSSourceMapPosition<"SignalDetail", "pages/carInfoDetail/carInfoDetail.uvue", 202, 7>;
		experience: string
		quality: string
		color: string
		level: number
	}

	// 信号强度处理方法
	
const __sfc__ = defineComponent({
  __name: 'carInfoDetail',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

const deptId = ref<string | null>('')
	const imei = ref<string | null>('')
	const deviceId = ref<string | null>('')
	// 地图状态
	const center = reactive<MapCenter>({
		latitude: 39.90469,
		longitude: 116.40717
	})
	const mapScale = ref(15)
	const datainfo = ref<UTSJSONObject>({})
	const address = ref('')
	const currentTime = ref('5s')
	const onCurrentTimeChange = (value: string) => {
		currentTime.value = value
	}
	const times = ref([
		[
			{ label: '5s', value: '5' },
			{ label: '10s', value: '10' },
			{ label: '20s', value: '20' },
			{ label: '30s', value: '30' },
			{ label: '停止刷新', value: '0' }
		]
	])
	const refreshTimer = ref<number | null>(null)
	const isRefreshing = ref(false)

	const popupRef = ref(false);
	const psw = ref('')
	const currentOperation = ref(0) // 0:无操作 1:恢复油电 2:断开油电
	const modalTitle = ref('验证密码')
	const userType = ref('')

	// 密码过滤（只允许 ASCII 字符）
	const filterNonLatin = (value: string) => {
		psw.value = value.replace(/[^\x00-\x7F]/g, '')
	}

	// 标记点集合
	const markers = ref<Array<Marker>>([])

	// 控制弹窗显示
	const showDevicePopup = ref(false)
	const currentDeviceInfo = ref({
		deviceName: '',
		carNumber: '',
		deviceSerial: '',
		locationType: '',
		lngLat: '',
		updateTime: '',
		locationTime: '',
		speed: '',
		totalMileage: '',
		address: ''
	})
	const currentCarInfo = ref<UTSJSONObject>({})
	const signalRssi = ref<string | number | null>(null)
	const signalSat = ref<string | number | null>(null)
	const carVoltage = computed<string | number | null>(() => currentCarInfo.value['voltage'] as string | number | null)
	const batteryPercent = computed<string | number | null>(() => datainfo.value['batteryPercent'] as string | number | null)

	// 获取电池颜色
	const getBatteryColor = (batteryPercent: string | number | null): string => {
		if (batteryPercent == null || batteryPercent == '') return '#c9c9c9'

		const batteryValue = parseFloat(batteryPercent.toString())

		if (batteryValue >= 70) {
			return '#07C160' // 绿色，电量充足
		} else if (batteryValue >= 30) {
			return '#FF9C19' // 橙色，电量中等
		} else if (batteryValue >= 10) {
			return '#FF6B00' // 深橙色，电量低
		} else {
			return '#FF0000' // 红色，电量严重不足
		}
	}

	function getSignalDetail(rssi: string | number | null): SignalDetail {
		// 处理 null 或空字符串的情况
		if (rssi == null || rssi == '') {
			return {
				experience: "无信号",
				quality: "无服务",
				color: "#999",
				level: 0
			};
		}

		const signalValue = parseFloat(rssi.toString());

		if (isNaN(signalValue)) {
			return {
				experience: "信号数据无效",
				quality: "无服务",
				color: "#999",
				level: 0
			};
		}

		// 根据图片规则判断信号等级
		if (signalValue >= 26) {
			return {
				experience: "极好",
				quality: "极强",
				color: "#07C160",
				level: 5
			};
		} else if (signalValue >= 20) {
			return {
				experience: "良好",
				quality: "强",
				color: "#52c41a",
				level: 4
			};
		} else if (signalValue >= 15) {
			return {
				experience: "一般",
				quality: "一般",
				color: "#faad14",
				level: 3
			};
		} else if (signalValue >= 10) {
			return {
				experience: "差",
				quality: "较弱",
				color: "#fa8c16",
				level: 2
			};
		} else if (signalValue >= 1) {
			return {
				experience: "非常差",
				quality: "微弱",
				color: "#f5222d",
				level: 1
			};
		} else {
			return {
				experience: "无信号",
				quality: "无服务",
				color: "#999",
				level: 0
			};
		}
	}

	// 样式计算方法
	const getMobileSignalBarClass = (barIndex: number, rssi: string | number | null): string => {
		if (rssi == null || rssi == '') {
			return 'bar-off';
		}

		const signalValue = parseFloat(rssi.toString());
		if (isNaN(signalValue)) return 'bar-off';

		const signalDetail = getSignalDetail(signalValue);
		const level = signalDetail.level;

		// 根据信号等级决定哪些信号条亮起
		// 5格信号条对应5个等级
		return barIndex < level ? 'bar-active' : 'bar-off';
	}

	//封装markers
	const createMarker = (id : number, lat : number, lng : number, type : string, title ?: string): Marker => {
		const connectionStatus = datainfo.value['connectionStatus'] as string | null;
		const carType = currentCarInfo.value['carType'] as string | null;
		const marker = {
			id,
			latitude: lat,
			longitude: lng,
			width: 25,
			height: 25,
			iconPath: getDeviceIcon(connectionStatus ?? '', carType ?? ''),
			callout: {
				content: title || '爱车位置',
				color: connectionStatus == 'online' ? '#fff' : '#666',
				borderRadius: 10,
				bgColor: connectionStatus == 'online' ? '#07C160' : '#ccc',
				padding: 5,
				display: 'ALWAYS'
			}
		} as Marker

		return marker
	}

	const delay = (ms: number): Promise<void> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	const loadData = async (data : UTSJSONObject, retryCount : number): Promise<boolean> => {
		signalRssi.value = null
		signalSat.value = null
		let retry = retryCount;

		const tryLoad = async (attempt : number): Promise<boolean> => {
			try {
				const res = await getDevicePos(data);

				// 检查返回结果是否有效
				if (!res || !res.data || res.data.length == 0) {
					throw new Error('返回数据为空');
				}

				let foundDevice = false;

				// 使用 for...of 替代 forEach，确保 await 生效
				for (const item of res.data) {
					const itemImei = item.getString('imei', '');
					if (itemImei != null && itemImei == imei.value) {
						foundDevice = true;

						// item 已是 UTSJSONObject，直接赋值以保留正确类型。
						datainfo.value = item;
						const attribute = item['attribute'] as UTSJSONObject | null;
						signalRssi.value = attribute != null ? attribute['rssi'] as string | number | null : null;
						signalSat.value = attribute != null ? attribute['sat'] as string | number | null : null;

						const latitude = item.getNumber('latitude', 0);
						const longitude = item.getNumber('longitude', 0);
						if (latitude == null || longitude == null || latitude.toString().length == 0 || longitude.toString().length == 0) {
							console.error('位置信息缺失', item, " at pages/carInfoDetail/carInfoDetail.uvue:358");
							showAppToast({
								title: '位置信息缺失',
								icon: 'none'
							})
							return false;
						}

						// 确保经纬度是数字类型
						const lat = parseFloat(latitude.toString());
						const lng = parseFloat(longitude.toString());

						if (isNaN(lat) || isNaN(lng)) {
							console.error('经纬度格式错误', latitude, longitude, " at pages/carInfoDetail/carInfoDetail.uvue:371");
							return false;
						}

						// 使用明确的基础类型，避免 Kotlin 无法推断局部对象类型。
						let convertedLat : number = lat;
						let convertedLng : number = lng;
						try {
							const coord = CoordTransform.wgs84ToTencent(lat, lng);
							convertedLat = coord.lat;
							convertedLng = coord.lng;
						} catch (transformError) {
							console.error('坐标转换失败:', transformError, " at pages/carInfoDetail/carInfoDetail.uvue:383");
						}

						center.latitude = convertedLat;
						center.longitude = convertedLng;

						// 在 UTS 环境中，使用 setTimeout 替代 $nextTick
						await delay(50);

						// 更新设备标记
						const deviceMarker = createMarker(
							1,
							convertedLat,
							convertedLng,
							'device',
							currentCarInfo.value['deviceName'] as string | null
						);

						// 使用强制响应式更新
						markers.value = [];
						await delay(50);
						markers.value = [deviceMarker];

						// 检查设备状态，如果变为离线状态则停止定时器
						const connectionStatus = item['connectionStatus'] as string | null;
						if (connectionStatus != 'online' && refreshTimer.value !== null) {
							const timer = refreshTimer.value;
				if (timer !== null) {
					clearInterval(timer);
				}
							refreshTimer.value = null;
							isRefreshing.value = false;
							showAppToast({
								title: '设备已离线，停止自动刷新',
								icon: 'none'
							});
						}

						// 信号强度监控提醒
						if (signalRssi.value != null) {
							const signalExp = getSignalDetail(signalRssi.value).experience;
							if (signalExp === '差' || signalExp === '非常差' || signalExp === '无信号') {
								console.warn(`设备 ${imei.value} 信号较弱: ${signalRssi.value}dBm`, " at pages/carInfoDetail/carInfoDetail.uvue:425");
							}
						}
					}
				}

				// 如果没有找到对应设备
				if (!foundDevice) {
					throw new Error('未找到对应的设备数据');
				}

				return true; // 成功标志

			} catch (error) {
				console.error(`第${attempt}次加载设备数据失败:`, error, " at pages/carInfoDetail/carInfoDetail.uvue:439");

				// 如果不是最后一次重试，则继续重试
				if (attempt < retry) {
					// 等待一段时间后重试（指数退避）
					const delayMs = Math.pow(2, attempt) * 1000; // 2^attempt 秒
					console.log(`等待${delayMs / 1000}秒后重试...`, " at pages/carInfoDetail/carInfoDetail.uvue:445");

					await delay(delayMs);

					return false;
				} else {
					// 所有重试都失败了
					showAppToast({
						title: '数据加载失败，请稍后重试',
						icon: 'none',
						duration: 2000
					});

					// 如果设备在线状态，停止自动刷新
					if (datainfo.value.connectionStatus == 'online' && refreshTimer.value !== null) {
						const timer = refreshTimer.value;
							if (timer !== null) {
								clearInterval(timer);
							}
						refreshTimer.value = null;
						isRefreshing.value = false;
						showAppToast({
							title: '数据加载失败，停止自动刷新',
							icon: 'none'
						});
					}

					return false; // 失败标志
				}
			}
		}

		// 开始重试逻辑
		return tryLoad(1);
	}

	// 手动刷新方法
	const manualRefresh = async () => {
		uni.showLoading({
			title: '刷新中...',
			mask: true
		});

		try {
			const success = await loadData({
				deptId: deptId.value,
				deviceids: imei.value
			} as UTSJSONObject, 3);

			if (success) {

				showAppToast({
					title: '刷新成功',
					icon: 'success'
				});
			} else {
				showAppToast({
					title: '刷新失败',
					icon: 'none'
				});
			}
		} catch (error) {
			console.error('手动刷新失败:', error, " at pages/carInfoDetail/carInfoDetail.uvue:507");
			showAppToast({
				title: '刷新失败',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	}

	const setupAutoRefresh = (intervalValue : string) => {
		// 清除现有的定时器
		if (refreshTimer.value !== null) {
			const timer = refreshTimer.value
			if (timer !== null) {
				clearInterval(timer)
			}
			refreshTimer.value = null
			isRefreshing.value = false
		}

		// 如果选择"停止刷新"(值为'0')，则直接返回
		if (intervalValue == '0') {
			isRefreshing.value = false
			return
		}

		// 只有当设备在线时才启动定时器
		if (datainfo.value.connectionStatus != 'online') {
			isRefreshing.value = false
			return
		}

		// 将字符串值转换为数字(秒)
		const intervalSeconds = parseInt(intervalValue)

		if (intervalSeconds > 0) {

			isRefreshing.value = true
			// 将秒转换为毫秒
			const intervalMs = intervalSeconds * 1000

			// 立即加载一次数据
			loadData({
				deptId: deptId.value,
				deviceids: imei.value
			} as UTSJSONObject, 3)

			// 设置定时器
			refreshTimer.value = setInterval(() => {
				loadData({
					deptId: deptId.value,
					deviceids: imei.value
				} as UTSJSONObject, 3)
			}, intervalMs) as number
		}
	}

	watch(currentTime, (newVal: string) => {
		setupAutoRefresh(newVal); // 当时间间隔变化时，重新设置自动刷新
	});

	// 停止自动刷新
	const stopAutoRefresh = () => {
		if (refreshTimer.value !== null) {
			const timer = refreshTimer.value
			if (timer !== null) {
				clearInterval(timer)
			}
			refreshTimer.value = null
			isRefreshing.value = false
		}
	}

	const baseList = computed(() => {
	const list = [{
		image: '/static/gjhf.png',
		text: '轨迹回放'
	}, {
		image: '/static/clgz.png',
		text: '车辆跟踪'
	}, {
		image: '/static/lcjl.png',
		text: '里程记录'
	}, {
		image: '/static/tcjl.png',
		text: '停车记录'
	},
	{
		image: '/static/dzwl.png',
		text: '电子围栏'
	},
	{
		image: '/static/navto.png',
		text: '一键寻车'
	},
	{
		image: '/static/power.png',
		text: '恢复油电'
	},
	{
		image: '/static/offpower.png',
		text: '断开油电'
	}]

	// 根据 productId 决定是否添加发送指令选项
	const productId = currentCarInfo.value.productId
	if (productId === 'product-1141811865601576960' ||
		productId === 'product-1183161303028600832') {
		list.push({
			image: '/static/cmd.png',
			text: '发送指令'
		})
	}

	return list
})


	// 执行操作的统一方法
	async function executeOperation(operationType: number): Promise<void> {
		let predictCmdId = 0
		let type = 0

		if (operationType == 1) {
			// 恢复油电
			predictCmdId = 2
			type = 2
		} else if (operationType == 2) {
			// 断开油电
			predictCmdId = 1
			type = 1
		} else {
			showAppToast({
				title: '操作类型错误',
				icon: 'none'
			})
			return
		}

		try {
			// 显示加载中
			uni.showLoading({
				title: '执行中...',
				mask: true
			})

			// 调用接口
			const res = await sendCommand({
				imei: imei.value,
				password: userType.value == '1' ? psw.value : '', // 根据用户类型决定是否传密码
				params: ['1111'],
				predictCmdId: predictCmdId,
				type: type
			})

			// 隐藏加载中
			uni.hideLoading()

			// 根据响应处理结果
			if (res.code == 0) {
				showAppToast({
					title: operationType == 1 ? '恢复油电成功' : '断开油电成功',
					icon: 'success'
				})

				// 清空密码
				psw.value = ''
			} else {
				showAppToast({
					title: res.msg.length > 0 ? res.msg : '操作失败',
					icon: 'none'
				})
			}
		} catch (error) {
			// 隐藏加载中
			uni.hideLoading()

			console.error('操作失败:', error, " at pages/carInfoDetail/carInfoDetail.uvue:685")
			showAppToast({
				title: '操作失败，请重试',
				icon: 'none'
			})
		}
	}

	const confirm = async () => {
		if (userType.value == '1' && psw.value == '') {
			showAppToast({
				title: '请输入密码',
				icon: 'none'
			})
			return
		}

		// 执行当前操作
		executeOperation(currentOperation.value);
	}

	const carDetail = () => {
		stopAutoRefresh() // 停止刷新
		uni.navigateTo({
			url: '/pages/userCenter/carDetail/carDetail?deviceId=' + deviceId.value
		})
	}




	const refreshAdress = async (): Promise<void> => {
		try {
			const addr = await getAddress(center.latitude, center.longitude);
			address.value = addr.result.formatted_address;
		} catch (error) {
			console.error('获取地址信息失败:', error, " at pages/carInfoDetail/carInfoDetail.uvue:721");
		}
	}

	async function navTo(): Promise<void> {
		if (!address.value) {
			await refreshAdress()
		}
		//导航去此位置
		uni.openLocation({
			latitude: center.latitude,
			longitude: center.longitude,
			name: address.value || '当前位置',
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
				console.error('调起地图失败:', err, " at pages/carInfoDetail/carInfoDetail.uvue:746");
			}
		});
	}


	const handleGridClick = (event: any) => {
		const name = event as UTSJSONObject
		const itemTo = name.text
		if (itemTo == '轨迹回放') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/playBack/playBack?imei=' + imei.value + '&connectionStatus=' + datainfo.value.connectionStatus + '&plateNo=' + currentCarInfo.value.deviceName + '&carType=' + currentCarInfo.value.carType + '&lat=' + datainfo.value.latitude + '&lng=' + datainfo.value.longitude
			})
		}
		if (itemTo == '车辆跟踪') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/vehicleTracking/vehicleTracking?imei=' + imei.value + '&deptId=' + deptId.value + '&connectionStatus=' + datainfo.value.connectionStatus + '&plateNo=' + currentCarInfo.value.deviceName + '&carType=' + currentCarInfo.value.carType
			})
		}
		if (itemTo == '里程记录') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/mileageRecord/mileageRecord?imei=' + imei.value + '&connectionStatus=' + datainfo.value.connectionStatus + '&plateNo=' + currentCarInfo.value.deviceName + '&carType=' + currentCarInfo.value.carType
			})
		}
		if (itemTo == '停车记录') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/stopRecord/stopRecord?imei=' + imei.value + '&deptId=' + deptId.value
			})
		}
		if (itemTo == '恢复油电') {
			// 恢复油电
			if (userType.value == '1') {
				// 需要密码验证
				psw.value = ''
				currentOperation.value = 1
				modalTitle.value = '验证密码'
				popupRef.value = true
			} else {
				// 不需要密码验证，直接执行操作
				executeOperation(1);
			}
		}
		if (itemTo == '断开油电') {
			// 断开油电
			if (userType.value == '1') {
				// 需要密码验证
				psw.value = ''
				currentOperation.value = 2
				modalTitle.value = '验证密码'
				popupRef.value = true
			} else {
				// 不需要密码验证，直接执行操作
				executeOperation(2);
			}
		}
		if (itemTo == '电子围栏') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/geofencing/geofencing?imei=' + imei.value + '&connectionStatus=' + datainfo.value.connectionStatus + '&plateNo=' + currentCarInfo.value.deviceName + '&carType=' + currentCarInfo.value.carType + '&deptId=' + deptId.value + '&deviceName=' + currentCarInfo.value.deviceName
			})
		}
		if (itemTo == '一键寻车') {
			navTo()
		}
		if (itemTo == '发送指令') {
			stopAutoRefresh() // 停止刷新
			uni.navigateTo({
				url: '/pages/cmd/cmd?imei=' + imei.value
			})
		}

	}


	const loadDeviceDetail = async () => {
		if (deviceId.value !== null) {
			const res = await getDeviceDetail(deviceId.value)
			currentCarInfo.value = res.data
		} else {
			console.error("设备id获取失败", " at pages/carInfoDetail/carInfoDetail.uvue:829")
		}
	}

	onLoad((option) => {
		deptId.value = option.deptId;
		imei.value = option.imei;
		deviceId.value = option.deviceId;
		const storedUserType = uni.getStorageSync('userType') as string | null;
		userType.value = storedUserType ?? '';

		loadDeviceDetail().then(() => {
			const data: UTSJSONObject = {__$originalPosition: new UTSSourceMapPosition("data", "pages/carInfoDetail/carInfoDetail.uvue", 841, 10),
				deptId: deptId.value,
				deviceids: imei.value
			};

			uni.showLoading({ title: '加载中...' });
			loadData(data, 3).then((success: boolean) => {
				uni.hideLoading();
				if (success && datainfo.value.connectionStatus == 'online') {
					setupAutoRefresh(currentTime.value);
				}
			});
		});


	})





	onShow(() => {
		console.log('页面显示，检查自动刷新状态', " at pages/carInfoDetail/carInfoDetail.uvue:863")
		// 如果设备在线且没有在刷新，重新启动自动刷新
		if (datainfo.value.connectionStatus == 'online' && !isRefreshing.value) {
			setupAutoRefresh(currentTime.value)
		}
	})

	// 新增页面隐藏时的处理
	onHide(() => {
		console.log('页面隐藏时停止自动刷新', " at pages/carInfoDetail/carInfoDetail.uvue:872")
		stopAutoRefresh()
	})

	onUnmounted(() => {
		console.log('页面卸载时停止自动刷新', " at pages/carInfoDetail/carInfoDetail.uvue:877")
		stopAutoRefresh()
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)
const _component_map = resolveComponent("map")
const _component_sub_navBar = resolveEasyComponent("sub-navBar",_easycom_sub_navBar)
const _component_i_icon = resolveEasyComponent("i-icon",_easycom_i_icon)
const _component_i_grid = resolveEasyComponent("i-grid",_easycom_i_grid)
const _component_i_input = resolveEasyComponent("i-input",_easycom_i_input)
const _component_i_modal = resolveEasyComponent("i-modal",_easycom_i_modal)
const _component_app_toast = resolveEasyComponent("app-toast",_easycom_app_toast)

  return _cE(Fragment, null, [
    _cE("view", _uM({ class: "container" }), [
      _cV(_component_custom_navBar, _uM({
        title: "详情",
        "show-back": true,
        backgroundColor: "#fff",
        textColor: "#333",
        showCapsule: false
      })),
      _cE("view", _uM({ class: "map-container" }), [
        _cV(_component_map, _uM({
          id: "myMap",
          latitude: unref(center).latitude,
          longitude: unref(center).longitude,
          markers: unref(markers),
          scale: unref(mapScale),
          style: _nS(_uM({"width":"100%","height":"100%"})),
          "show-location": false,
          "enable-traffic": true,
          "enable-overlooking": true,
          "enable-building": true,
          "enable-3D": true
        }), null, 8 /* PROPS */, ["latitude", "longitude", "markers", "scale", "style"]),
        _cV(_component_sub_navBar, _uM({
          class: "sub-nav-overlay",
          currentTime: unref(currentTime),
          showTime: true,
          showPickerTime: false,
          "onUpdate:currentTime": onCurrentTimeChange,
          currentCar: unref(currentCarInfo).deviceName,
          times: unref(times),
          carStatus: unref(datainfo).connectionStatus,
          showPicker: false,
          showCar: true
        }), null, 8 /* PROPS */, ["currentTime", "currentCar", "times", "carStatus"])
      ]),
      _cE("view", _uM({ class: "tools-panel" }), [
        _cE("view", _uM({ class: "Imei-box" }), [
          _cE("view", _uM({
            class: "imei-info",
            onClick: carDetail
          }), [
            _cE("view", _uM({ class: "imeis" }), [
              _cE("text", null, "ID: " + _tD(unref(imei)), 1 /* TEXT */),
              _cE("text", _uM({ class: "pos-time" }))
            ]),
            _cV(_component_i_icon, _uM({
              name: "/static/arrow-right.png",
              fontSize: "16"
            }))
          ]),
          _cE("view", _uM({ class: "pos-date" }), [
            _cE("text", _uM({ class: "addree-box" }), "定位时间: " + _tD(unref(datainfo).positionUpdateTime), 1 /* TEXT */),
            _cE("text", _uM({ class: "addree-box" }), "通信时间: " + _tD(unref(datainfo).signalUpdateTime), 1 /* TEXT */)
          ]),
          _cE("view", _uM({ class: "pos-adress" }), [
            _cE("view", _uM({ class: "addree-box" }), [
              _cE("text", _uM({
                style: _nS(_uM({"margin-right":"10rpx","font-size":"22rpx"}))
              }), "当前位置:", 4 /* STYLE */),
              isTrue(unref(address))
                ? _cE("text", _uM({
                    key: 0,
                    class: "address-text"
                  }), _tD(unref(address)), 1 /* TEXT */)
                : _cE("text", _uM({
                    key: 1,
                    class: "address-text"
                  }), _tD(unref(center).latitude) + " , " + _tD(unref(center).longitude), 1 /* TEXT */),
              isTrue(!unref(address))
                ? _cE("text", _uM({
                    key: 2,
                    style: _nS(_uM({"color":"#007AFF","margin-left":"20rpx","font-weight":"bold","font-size":"22rpx"})),
                    onClick: refreshAdress
                  }), "中文地址", 4 /* STYLE */)
                : _cC("v-if", true)
            ])
          ]),
          _cE("view", _uM({ class: "signal-container" }), [
            unref(signalRssi) != null
              ? _cE("view", _uM({
                  key: 0,
                  class: "signal-item"
                }), [
                  _cE("view", _uM({ class: "mobile-signal" }), [
                    _cE("view", _uM({ class: "signal-bars-horizontal" }), [
                      _cE("view", _uM({
                        class: "signal-bar-h signal-bar-h-1",
                        style: _nS(_uM({ backgroundColor: getMobileSignalBarClass(0, unref(signalRssi)) == 'bar-active' ? getSignalDetail(unref(signalRssi)).color : '#e8e8e8' }))
                      }), null, 4 /* STYLE */),
                      _cE("view", _uM({
                        class: "signal-bar-h signal-bar-h-2",
                        style: _nS(_uM({ backgroundColor: getMobileSignalBarClass(1, unref(signalRssi)) == 'bar-active' ? getSignalDetail(unref(signalRssi)).color : '#e8e8e8' }))
                      }), null, 4 /* STYLE */),
                      _cE("view", _uM({
                        class: "signal-bar-h signal-bar-h-3",
                        style: _nS(_uM({ backgroundColor: getMobileSignalBarClass(2, unref(signalRssi)) == 'bar-active' ? getSignalDetail(unref(signalRssi)).color : '#e8e8e8' }))
                      }), null, 4 /* STYLE */),
                      _cE("view", _uM({
                        class: "signal-bar-h signal-bar-h-4",
                        style: _nS(_uM({ backgroundColor: getMobileSignalBarClass(3, unref(signalRssi)) == 'bar-active' ? getSignalDetail(unref(signalRssi)).color : '#e8e8e8' }))
                      }), null, 4 /* STYLE */),
                      _cE("view", _uM({
                        class: "signal-bar-h signal-bar-h-5",
                        style: _nS(_uM({ backgroundColor: getMobileSignalBarClass(4, unref(signalRssi)) == 'bar-active' ? getSignalDetail(unref(signalRssi)).color : '#e8e8e8' }))
                      }), null, 4 /* STYLE */)
                    ]),
                    _cE("view", _uM({ class: "signal-info-h" }), [
                      _cE("text", _uM({
                        class: "experience",
                        style: _nS(_uM({ color: getSignalDetail(unref(signalRssi)).color }))
                      }), _tD(getSignalDetail(unref(signalRssi)).experience), 5 /* TEXT, STYLE */),
                      _cE("text", _uM({
                        class: "signal-value",
                        style: _nS(_uM({ color: getSignalDetail(unref(signalRssi)).color }))
                      }), "CSQ " + _tD(unref(signalRssi)), 5 /* TEXT, STYLE */)
                    ])
                  ])
                ])
              : _cC("v-if", true),
            unref(signalSat) != null
              ? _cE("view", _uM({
                  key: 1,
                  class: "satellite-item-h"
                }), [
                  _cE("image", _uM({
                    class: "satellite-icon",
                    src: "/static/sate.png"
                  })),
                  _cE("text", _uM({ class: "satellite-text" }), _tD(unref(signalSat)), 1 /* TEXT */)
                ])
              : _cC("v-if", true),
            isTrue(unref(carVoltage))
              ? _cE("view", _uM({
                  key: 2,
                  class: "power"
                }), [
                  _cE("image", _uM({
                    class: "power-icon",
                    src: "/static/v.png"
                  })),
                  _cE("text", null, _tD(unref(carVoltage)) + "V", 1 /* TEXT */)
                ])
              : _cC("v-if", true),
            isTrue(unref(batteryPercent))
              ? _cE("view", _uM({
                  key: 3,
                  class: "battery",
                  style: _nS(_uM({ color: getBatteryColor(unref(batteryPercent)) }))
                }), [
                  _cE("image", _uM({
                    class: "battery-icon",
                    src: "/static/pow.png",
                    alt: ""
                  })),
                  _cE("text", null, _tD(unref(batteryPercent)) + "%", 1 /* TEXT */)
                ], 4 /* STYLE */)
              : _cC("v-if", true)
          ])
        ]),
        _cV(_component_i_grid, _uM({
          items: unref(baseList),
          col: 5,
          itemHeight: "88",
          round: "8",
          imageSize: 30,
          iconColor: "#3c9cff",
          textColor: "#606266",
          showBorder: true,
          onClick: ($event: any) => {handleGridClick($event)}
        }), null, 8 /* PROPS */, ["items", "onClick"])
      ]),
      _cE("view", null, [
        _cV(_component_i_modal, _uM({
          show: unref(popupRef),
          title: unref(modalTitle),
          onConfirm: confirm
        }), _uM({
          default: withSlotCtx((): any[] => [
            _cE("view", null, [
              _cV(_component_i_input, _uM({
                modelValue: unref(psw),
                "onUpdate:modelValue": $event => {trySetRefValue(psw, $event)},
                onInput: filterNonLatin,
                placeholder: "请输入密码",
                clearable: "",
                password: true
              }), null, 8 /* PROPS */, ["modelValue"])
            ])
          ]),
          _: 1 /* STABLE */
        }), 8 /* PROPS */, ["show", "title"])
      ])
    ]),
    _cV(_component_app_toast)
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesCarInfoDetailCarInfoDetailStyles = [_uM([["container", _pS(_uM([["position", "relative"], ["width", "100%"], ["height", "100%"], ["display", "flex"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fa"]]))], ["map-container", _uM([[".container ", _uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["width", "100%"], ["position", "relative"]])]])], ["sub-nav-overlay", _uM([[".container .map-container ", _uM([["position", "absolute"], ["top", 0], ["left", 0], ["right", 0], ["zIndex", 100]])]])], ["drag-hint", _uM([[".container .map-container ", _uM([["position", "absolute"], ["top", "20rpx"], ["left", 0], ["right", 0], ["zIndex", 100], ["backgroundColor", "rgba(255,255,255,0.9)"], ["paddingTop", "16rpx"], ["paddingRight", "16rpx"], ["paddingBottom", "16rpx"], ["paddingLeft", "16rpx"], ["textAlign", "center"], ["fontSize", "28rpx"], ["color", "#00aa00"], ["fontWeight", "bold"], ["boxShadow", "0 4rpx 10rpx rgba(0, 0, 0, 0.1)"]])]])], ["navTo", _uM([[".container .map-container ", _uM([["width", "60rpx"], ["height", "60rpx"], ["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["position", "absolute"], ["zIndex", 100], ["bottom", "10%"], ["right", "30rpx"], ["paddingTop", "5rpx"], ["paddingRight", "5rpx"], ["paddingBottom", "5rpx"], ["paddingLeft", "5rpx"]])]])], ["tool-nav", _uM([[".container ", _uM([["position", "absolute"], ["top", "200rpx"], ["right", "20rpx"], ["zIndex", 100]])]])], ["btn-map-list", _uM([[".container .tool-nav ", _uM([["width", "60rpx"], ["height", "60rpx"]])]])], ["btn-map-list-icon", _uM([[".container .tool-nav ", _uM([["width", "100%"], ["height", "100%"], ["paddingTop", "8rpx"], ["paddingRight", "8rpx"], ["paddingBottom", "8rpx"], ["paddingLeft", "8rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["backgroundColor", "#69c2f1"]])]])], ["tool-more", _uM([[".container ", _uM([["position", "absolute"], ["top", "30%"], ["right", "20rpx"], ["zIndex", 100], ["width", "60rpx"], ["height", "60rpx"]])]])], ["btn-tool-more-icon", _uM([[".container .tool-more ", _uM([["width", "100%"], ["height", "100%"]])]])], ["tools-panel", _uM([[".container ", _uM([["width", "100%"], ["backgroundColor", "#ffffff"], ["paddingBottom", "70rpx"]])]])], ["refresh-status", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", "30rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "30rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f8f9fa"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#e8e8e8"]])]])], ["refresh-text", _uM([[".container .tools-panel .refresh-status ", _uM([["fontSize", "26rpx"], ["color", "#666666"]])], [".container .tools-panel .refresh-status .refreshing", _uM([["color", "#1890ff"]])]])], ["refresh-btn", _uM([[".container .tools-panel .refresh-status ", _uM([["marginLeft", "auto"], ["color", "#1890ff"], ["fontSize", "26rpx"]])]])], ["Imei-box", _uM([[".container .tools-panel ", _uM([["marginTop", "30rpx"], ["marginRight", "30rpx"], ["marginBottom", 0], ["marginLeft", "30rpx"], ["fontSize", "28rpx"], ["borderBottomWidth", "1rpx"], ["borderBottomStyle", "solid"], ["borderBottomColor", "#dcdfe6"]])]])], ["imei-info", _uM([[".container .tools-panel .Imei-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["imeis", _uM([[".container .tools-panel .Imei-box .imei-info ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"]])]])], ["pos-time", _uM([[".container .tools-panel .Imei-box ", _uM([["fontSize", "20rpx"], ["color", "#999999"], ["marginLeft", "30rpx"]])]])], ["pos-date", _uM([[".container .tools-panel .Imei-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["pos-adress", _uM([[".container .tools-panel .Imei-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"]])]])], ["addree-box", _uM([[".container .tools-panel .Imei-box .pos-date ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["fontSize", "22rpx"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["color", "#999999"]])], [".container .tools-panel .Imei-box .pos-adress ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "flex-start"], ["alignItems", "center"], ["fontSize", "22rpx"], ["marginTop", "20rpx"], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0], ["color", "#999999"]])]])], ["address-text", _uM([[".container .tools-panel .Imei-box .pos-date .addree-box ", _uM([["fontSize", "22rpx"], ["maxWidth", "490rpx"], ["lineHeight", 1.4]])], [".container .tools-panel .Imei-box .pos-adress .addree-box ", _uM([["fontSize", "22rpx"], ["maxWidth", "490rpx"], ["lineHeight", 1.4]])]])], ["pos-icon", _uM([[".container .tools-panel .Imei-box .pos-date .addree-box ", _uM([["width", "30rpx"], ["height", "30rpx"], ["marginRight", "10rpx"]])], [".container .tools-panel .Imei-box .pos-adress .addree-box ", _uM([["width", "30rpx"], ["height", "30rpx"], ["marginRight", "10rpx"]])]])], ["signal-container", _uM([[".container .tools-panel .Imei-box ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["paddingTop", "20rpx"], ["paddingRight", 0], ["paddingBottom", "20rpx"], ["paddingLeft", 0]])]])], ["signal-item", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["marginRight", "10rpx"]])]])], ["mobile-signal", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["justifyContent", "center"], ["backgroundImage", "none"], ["backgroundColor", "#f0f8ff"], ["paddingTop", "10rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["signal-bars-horizontal", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "flex-end"], ["height", "40rpx"], ["marginRight", "5rpx"]])]])], ["signal-bar-h", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal ", _uM([["width", "8rpx"], ["marginRight", "3rpx"], ["borderTopLeftRadius", "2rpx"], ["borderTopRightRadius", "2rpx"], ["borderBottomRightRadius", 0], ["borderBottomLeftRadius", 0], ["transitionProperty", "all"], ["transitionDuration", "0.3s"], ["transitionTimingFunction", "ease"]])], [".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-1", _uM([["height", "12rpx"]])], [".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-2", _uM([["height", "16rpx"]])], [".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-3", _uM([["height", "20rpx"]])], [".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-4", _uM([["height", "24rpx"]])], [".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-bars-horizontal .signal-bar-h-5", _uM([["height", "28rpx"]])]])], ["signal-info-h", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal ", _uM([["display", "flex"], ["flexDirection", "column"], ["justifyContent", "center"], ["alignItems", "center"]])]])], ["signal-value", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h ", _uM([["fontSize", "18rpx"], ["color", "#333333"]])]])], ["experience", _uM([[".container .tools-panel .Imei-box .signal-container .signal-item .mobile-signal .signal-info-h ", _uM([["fontSize", "18rpx"], ["fontWeight", "normal"]])]])], ["satellite-item-h", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["backgroundImage", "none"], ["backgroundColor", "#f0f8ff"], ["paddingTop", "10rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["satellite-icon", _uM([[".container .tools-panel .Imei-box .signal-container .satellite-item-h ", _uM([["width", "47rpx"], ["height", "47rpx"], ["marginRight", "10rpx"]])]])], ["satellite-text", _uM([[".container .tools-panel .Imei-box .signal-container .satellite-item-h ", _uM([["fontSize", "24rpx"], ["color", "#1890ff"], ["fontWeight", "bold"]])]])], ["power-icon", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["width", "47rpx"], ["height", "47rpx"], ["marginRight", "10rpx"]])]])], ["battery-icon", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["width", "47rpx"], ["height", "47rpx"], ["marginRight", "10rpx"]])]])], ["power", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["fontSize", "24rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f8ff"], ["paddingTop", "10rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["battery", _uM([[".container .tools-panel .Imei-box .signal-container ", _uM([["display", "flex"], ["flexDirection", "row"], ["alignItems", "center"], ["fontSize", "24rpx"], ["backgroundImage", "none"], ["backgroundColor", "#f0f8ff"], ["paddingTop", "10rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "20rpx"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["h-line", _uM([[".container .tools-panel ", _uM([["width", "90%"], ["height", "2rpx"], ["backgroundColor", "#f1f1f1"], ["marginTop", "50rpx"], ["marginRight", "auto"], ["marginBottom", 0], ["marginLeft", "auto"]])]])], ["tool-tag-item", _uM([[".container .tools-panel ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["paddingTop", "50rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "50rpx"], ["paddingLeft", "20rpx"]])]])], ["speed-control", _uM([[".container .tools-panel ", _uM([["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"]])]])], ["slider", _uM([[".container .tools-panel .speed-control ", _uM([["width", "90%"], ["marginTop", 0], ["marginRight", "auto"], ["marginBottom", 0], ["marginLeft", "auto"]])]])], ["grid-text", _uM([[".container .tools-panel ", _uM([["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", 0], ["paddingLeft", 0], ["boxSizing", "border-box"], ["fontSize", "24rpx"]])]])], ["@TRANSITION", _uM([["signal-bar-h", _uM([["property", "all"], ["duration", "0.3s"], ["timingFunction", "ease"]])]])]])]
