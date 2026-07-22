const DEFAULT_TK = '1e3374be3d63de65d44dbfdc7b311afb'

type AddressResult = {
  formatted_address: string
}

type AddressResponse = {
  result: AddressResult
}

export function getAddress(latitude: number, longitude: number, tk: string = DEFAULT_TK): Promise<AddressResponse> {
  return new Promise<AddressResponse>((resolve, reject) => {
    // 构造请求参数
    const postStr = JSON.stringify({
      lon: longitude,
      lat: latitude,
      ver: 1
    });
    
    uni.request({
      url: `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${tk}`,
      method: 'GET',
      header: {
        'User-Agent': 'Mozilla/5.0'
      },
      success: (res: RequestSuccess<any>) => {
        if (res.statusCode != 200 || res.data == null) {
          reject(new Error(`获取地址信息失败，状态码：${res.statusCode}`))
          return
        }

        const response = res.data as UTSJSONObject
        const result = response.getJSON('result')
        if (result == null) {
          reject(new Error(`获取地址信息失败：${response.getString('msg', '响应缺少结果')}`))
          return
        }

        const formattedAddress = result.getString('formatted_address', '')
        if (formattedAddress == '') {
          reject(new Error('获取地址信息失败：响应缺少地址'))
          return
        }

        resolve({ result: { formatted_address: formattedAddress } })
      },
      fail: (err: RequestFail) => {
        reject(err);
      }
    });
  });
}
