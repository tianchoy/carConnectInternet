import _easycom_custom_navBar from '@/components/custom-navBar/custom-navBar.uvue'
import { getUserDeviceList } from '../../../api/request.uts'

	
const __sfc__ = defineComponent({
  __name: 'payDeviceList',
  setup(__props) {
const __ins = getCurrentInstance()!;
const _ctx = __ins.proxy as InstanceType<typeof __sfc__>;
const _cache = __ins.renderCache;

	const deviceList = ref<Array<UTSJSONObject>>([])
	// 当前页码
	const currPage = ref(1)
	// 每页条数
	const pageSize = ref(10)
	// 总页数
	const totalPage = ref(0)
	// 是否正在加载
	const loading = ref(false)
	// 是否还有更多数据
	const hasMore = ref(true)
	// 是否需要刷新数据
	const needRefresh = ref(false)

	const addCar = () => {
		uni.navigateTo({
			url: '/pages/addCar/addCar'
		})
	}

	onShow(() => {
		// 如果需要刷新或者首次加载，则加载数据
		if (needRefresh.value || deviceList.value.length === 0) {
			resetData()
			loadPayDeviceListData()
			needRefresh.value = false
		}
	})

	// 重置数据
	const resetData = () => {
		deviceList.value = []
		currPage.value = 1
		totalPage.value = 0
		hasMore.value = true
	}

	// 加载车辆列表数据
	const loadPayDeviceListData = async () => {
		if (loading.value || !hasMore.value) return

		loading.value = true
		try {
			const data = {
				page: currPage.value,
				pageSize: pageSize.value
			}
			const res = await getUserDeviceList(data)

			if (res.code == 0) {
				// 保存总页数
				totalPage.value = res.data.totalPage

				// 如果是第一页，直接赋值
				if (currPage.value == 1) {
					deviceList.value = res.data.list
				} else {
					deviceList.value = [...deviceList.value, ...res.data.list]
				}

				// 判断是否还有更多数据
				hasMore.value = currPage.value < totalPage.value

				// 还有更多数据时增加页码
				if (hasMore.value) {
					currPage.value++
				}
				
			} else {
				uni.showToast({
					title: res.msg || '加载失败',
					icon: 'none'
				})
			}
		} catch (error) {
			console.error('加载车辆列表失败:', error)
			uni.showToast({
				title: '加载失败，请重试',
				icon: 'none'
			})
		} finally {
			loading.value = false
		}
	}

	// 监听页面滚动到底部，触发加载更多
	onReachBottom(() => {
		loadPayDeviceListData()
	})

	// 支付
	const pay = (iccid : string,simMerchant : string) => {
		if(simMerchant.toLowerCase() == 'zddx'){
			iccid = iccid.substring(0,iccid.length-1) //电信卡
		}
		// iccid = iccid.substring(0,iccid.length-1)
		
		console.log(iccid)
		// 设置需要刷新的标志
		needRefresh.value = true
		
		//拉起半屏小程序
		wx.openEmbeddedMiniProgram({
			appId: 'wx1d647f2cfdc089e6',
			path: '/pages/home/userSimRecharge?iccid=' + iccid,
			envVersion: 'release',
			success(res) {
				// 打开成功
				console.log('打开小程序成功', res)
			},
			fail(res) {
				// 打开失败
				console.log('打开小程序失败', res)
				// 如果打开失败，取消刷新标志
				needRefresh.value = false
				uni.showToast({
					title: '打开支付页面失败',
					icon: 'none'
				})
			}
		})
	}

	// 添加下拉刷新功能
	onPullDownRefresh(() => {
		resetData()
		loadPayDeviceListData().finally(() => {
			uni.stopPullDownRefresh()
			uni.showToast({
				title: '刷新成功',
				icon: 'success'
			})
		})
	})

return (): any | null => {

const _component_custom_navBar = resolveEasyComponent("custom-navBar",_easycom_custom_navBar)

  return _cE(Fragment, null, [
    _cV(_component_custom_navBar, _uM({
      title: "续费管理",
      "show-back": true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false,
      isIcon: true,
      isShowStyle: true
    })),
    _cE("view", _uM({ class: "container" }), [
      _cE("view", _uM({ class: "content" }), [
        _cE(Fragment, null, RenderHelpers.renderList(unref(deviceList), (item, index, __index, _cached): any => {
          return _cE("view", _uM({
            class: "list",
            key: index
          }), [
            _cE("view", _uM({ class: "device-info" }), [
              _cE("view", _uM({ class: "label title" }), _tD(item.deviceName), 1 /* TEXT */),
              _cE("view", _uM({ class: "value" }))
            ]),
            isTrue(item.iccid)
              ? _cE("view", _uM({
                  key: 0,
                  class: "device-info"
                }), [
                  _cE("view", _uM({ class: "label" }), "ICCID:"),
                  _cE("view", _uM({ class: "value" }), _tD(item.iccid), 1 /* TEXT */)
                ])
              : _cC("v-if", true),
            isTrue(item.imei && item.imei != '')
              ? _cE("view", _uM({
                  key: 1,
                  class: "device-info"
                }), [
                  _cE("view", _uM({ class: "label" }), "ID:"),
                  _cE("view", _uM({ class: "value" }), _tD(item.imei), 1 /* TEXT */)
                ])
              : _cC("v-if", true),
            _cE("view", _uM({ class: "device-info" }), [
              _cE("view"),
              _cE("text", _uM({
                class: "pay-btn",
                onClick: () => {pay(item.iccid,item.simMerchant)}
              }), "去续费", 8 /* PROPS */, ["onClick"])
            ])
          ])
        }), 128 /* KEYED_FRAGMENT */),
        isTrue(unref(loading))
          ? _cE("view", _uM({
              key: 0,
              class: "loading"
            }), [
              _cE("text", null, "加载中...")
            ])
          : _cC("v-if", true),
        isTrue(!unref(hasMore) && !unref(loading) && unref(deviceList).length > 0)
          ? _cE("view", _uM({
              key: 1,
              class: "no-more"
            }), [
              _cE("text", null, "没有更多数据了")
            ])
          : _cC("v-if", true),
        isTrue(!unref(loading) && unref(deviceList).length === 0)
          ? _cE("view", _uM({
              key: 2,
              class: "empty"
            }), [
              _cE("text", null, "暂无设备数据")
            ])
          : _cC("v-if", true)
      ])
    ])
  ], 64 /* STABLE_FRAGMENT */)
}
}

})
export default __sfc__
const GenPagesUserCenterPayDeviceListPayDeviceListStyles = [_uM([["container", _pS(_uM([["width", "100%"], ["backgroundColor", "#f5f5f5"], ["marginTop", "170rpx"]]))], ["content", _uM([[".container ", _uM([["marginTop", "30rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"]])]])], ["list", _uM([[".container .content ", _uM([["backgroundColor", "#ffffff"], ["borderTopLeftRadius", "20rpx"], ["borderTopRightRadius", "20rpx"], ["borderBottomRightRadius", "20rpx"], ["borderBottomLeftRadius", "20rpx"], ["paddingTop", "20rpx"], ["paddingRight", "20rpx"], ["paddingBottom", "20rpx"], ["paddingLeft", "20rpx"], ["marginBottom", "30rpx"]])]])], ["device-info", _uM([[".container .content .list ", _uM([["display", "flex"], ["flexDirection", "row"], ["justifyContent", "space-between"], ["alignItems", "center"], ["fontSize", "28rpx"], ["paddingTop", "10rpx"], ["paddingRight", 0], ["paddingBottom", "10rpx"], ["paddingLeft", 0]])]])], ["label", _uM([[".container .content .list .device-info ", _uM([["color", "#666666"]])]])], ["title", _uM([[".container .content .list .device-info ", _uM([["fontWeight", "bold"], ["fontSize", "32rpx"], ["color", "#000000"]])]])], ["value", _uM([[".container .content .list .device-info ", _uM([["color", "#333333"]])]])], ["pay-btn", _uM([[".container .content .list .device-info ", _uM([["paddingTop", "10rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "10rpx"], ["paddingLeft", "15rpx"], ["fontSize", "25rpx"], ["color", "#ffffff"], ["backgroundColor", "#5ac725"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"]])]])], ["loading", _uM([[".container .content ", _uM([["textAlign", "center"], ["paddingTop", "30rpx"], ["paddingRight", 0], ["paddingBottom", "30rpx"], ["paddingLeft", 0], ["color", "#999999"], ["fontSize", "24rpx"]])]])], ["no-more", _uM([[".container .content ", _uM([["textAlign", "center"], ["paddingTop", "30rpx"], ["paddingRight", 0], ["paddingBottom", "30rpx"], ["paddingLeft", 0], ["color", "#999999"], ["fontSize", "24rpx"]])]])], ["empty", _uM([[".container .content ", _uM([["textAlign", "center"], ["paddingTop", "100rpx"], ["paddingRight", 0], ["paddingBottom", "100rpx"], ["paddingLeft", 0], ["color", "#999999"], ["fontSize", "28rpx"]])]])]])]
