import { showAppToast } from '../utils/toast.uts'
// 定义类型
type RequestOptions = {
    url?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'
    data?: any
    header?: UTSJSONObject | null
    showLoading?: boolean
}

type HttpResponse<T = any> = {
    code: number
    message: string
    data: T
}

type HttpError = {
    statusCode: number
    message: string
    data?: any
}

type RequestResult = {
    statusCode: number
    data: any
    errMsg?: string
}

type RequestFailure = {
    errMsg?: string
    data?: any
}

const BASE_URL = 'https://car.zdiot.cn:18443/api'
// const BASE_URL = 'http://192.168.3.7:8085/api'

// 处理token过期的函数
function handleTokenExpired(): void {
    __f__('log','at api/http.uts:39','检测到token过期，执行跳转登录页逻辑')
    
    // 清除本地token
    uni.removeStorageSync('token')
    
    // 显示提示
    showAppToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
    })
    
    // 使用定时器确保Toast显示完成后再跳转
    setTimeout(() => {
        __f__('log','at api/http.uts:53','正在跳转到登录页...')
        uni.redirectTo({
            url: '/pages/login/login',
            success: () => {
                __f__('log','at api/http.uts:57','跳转登录页成功')
            },
            fail: (err) => {
                __f__('log','at api/http.uts:60','跳转登录页失败:', err)
                // 如果跳转失败，尝试使用 reLaunch
                uni.reLaunch({
                    url: '/pages/login/login'
                })
            }
        })
    }, 500)
}

// 请求拦截器
function requestInterceptor(config: RequestOptions): RequestOptions {
    const token = uni.getStorageSync('token')
    if (token != null && token.toString().length > 0) {








        if (config.header == null) {
            config.header = new UTSJSONObject()
        }
        config.header!.set('token', token.toString())

    }
    
    // 显示加载中
    // if (config.showLoading !== false) {
    //     uni.showLoading({
    //         title: '加载中...',
    //         mask: true
    //     })
    // }
    
    return config
}

// 响应拦截器
function responseInterceptor(response: RequestSuccess<any>, config: RequestOptions): any {
    return response.data!
}

// 错误处理
function errorHandler(error: HttpError, config: RequestOptions): void {
    // 隐藏加载中
    if (config.showLoading != false) {
        uni.hideLoading()
    }
    
    __f__('log','at api/http.uts:112','请求错误详情:', error)
    
    // 处理错误状态码
    if (error.statusCode != 0) {
        switch (error.statusCode) {
            case 401:
                handleTokenExpired()
                break
            case 403:
                showAppToast({
                    title: '没有权限访问',
                    icon: 'none'
                })
                break
            case 404:
                showAppToast({
                    title: '请求资源不存在',
                    icon: 'none'
                })
                break
            case 500:
                showAppToast({
                    title: '服务器错误',
                    icon: 'none'
                })
                break
            default:
                showAppToast({
                    title: error.message != null ? error.message : `请求错误: ${error.statusCode}`,
                    icon: 'none'
                })
        }
    } else {
        // 网络错误等
        showAppToast({
            title: '网络错误，请检查网络连接',
            icon: 'none'
        })
    }
}

// 封装uni.request
function request(options: RequestOptions): Promise<any> {
    const requestUrl = options.url != null ? options.url! : ''

    // 合并配置
    const config: RequestOptions = {
        url: requestUrl,
        method: options.method != null ? options.method : 'GET',
        data: options.data != null ? options.data : {},
        header: options.header != null ? options.header : new UTSJSONObject(),
        showLoading: options.showLoading != false
    }
    
    // 处理完整URL
    if (!config.url!.startsWith('http')) {
        config.url = BASE_URL + config.url!
    }
    
    // 请求拦截
    const processedConfig = requestInterceptor(config)
    
    return new Promise<any>((resolve, reject) => {
        uni.request<any>({
            url: processedConfig.url!,
            method: processedConfig.method,
            data: processedConfig.data,
            header: processedConfig.header,
            success: (res: RequestSuccess<any>) => {
                const statusCode = res.statusCode
                if (statusCode == 200) {
                    const data = responseInterceptor(res, processedConfig)
                    resolve(data)
                } else {
                    const httpError: HttpError = {
                        statusCode: statusCode,
                        message: `请求失败: ${statusCode}`,
                        data: res.data
                    }
                    errorHandler(httpError, processedConfig)
                    reject(httpError)
                }
            },
            fail: (error: RequestFail) => {
                const httpError: HttpError = {
                    statusCode: 0,
                    message: error.errMsg != null ? error.errMsg : '网络请求失败',
                    data: error
                }
                errorHandler(httpError, processedConfig)
                reject(httpError)
            }
        })
    })
}

// 封装常用方法
export function get(url: string, data: any = {}, options: RequestOptions = {} as RequestOptions): Promise<any> {
    return request({
        url: url,
        method: 'GET',
        data: data,
        header: options.header,
        showLoading: options.showLoading
    })
}

export function post(url: string, data: any = {}, options: RequestOptions = {} as RequestOptions): Promise<any> {
    return request({
        url: url,
        method: 'POST',
        data: data,
        header: options.header,
        showLoading: options.showLoading
    })
}

export function put(url: string, data: any = {}, options: RequestOptions = {} as RequestOptions): Promise<any> {
    return request({
        url: url,
        method: 'PUT',
        data: data,
        header: options.header,
        showLoading: options.showLoading
    })
}

export function remove(url: string, data: any = {}, options: RequestOptions = {} as RequestOptions): Promise<any> {
    return request({
        url: url,
        method: 'DELETE',
        data: data,
        header: options.header,
        showLoading: options.showLoading
    })
}

export function upload(url: string, filePath: string, name: string = 'file', formData: UTSJSONObject = {} as UTSJSONObject, options: RequestOptions = {} as RequestOptions): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        // 处理完整URL
        const fullUrl = url.startsWith('http') ? url : BASE_URL + url

        // 添加token到header
        const token = uni.getStorageSync('token')
        const header = options.header != null ? options.header : new UTSJSONObject()
        if (token != null && token.toString().length > 0) {





            header.set('token', token.toString())

        }

        if (options.showLoading != false) {
            uni.showLoading({
                title: '上传中...',
                mask: true
            })
        }

        uni.uploadFile({
            url: fullUrl,
            filePath: filePath,
            name: name,
            formData: formData,
            header: header,
            success: (res) => {
                if (options.showLoading != false) {
                    uni.hideLoading()
                }

                if (res.statusCode == 200) {
                    try {
                        const data = JSON.parse(res.data)
                        resolve(data)
                    } catch (e) {
                        resolve(res.data)
                    }
                } else {
                    const error: HttpError = {
                        statusCode: res.statusCode,
                        message: '文件上传失败',
                        data: res.data
                    }
                    errorHandler(error, options)
                    reject(error)
                }
            },
            fail: (error) => {
                if (options.showLoading != false) {
                    uni.hideLoading()
                }

                const httpError: HttpError = {
                    statusCode: 0,
                    message: error.errMsg != null ? error.errMsg : '文件上传失败',
                    data: error
                }
                errorHandler(httpError, options)
                reject(httpError)
            }
        })
    })
}
