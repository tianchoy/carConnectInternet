const DEFAULT_TK = '1e3374be3d63de65d44dbfdc7b311afb'

export function getAddress(latitude: number, longitude: number, tk: string = DEFAULT_TK): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // 构造请求参数
    const postStr = JSON.stringify({
      lon: longitude,
      lat: latitude,
      ver: 1
    });
    
    uni.request({
      url: `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${tk}`,
      method: 'GET',
      success: (res: RequestSuccess<any>) => {
        if (res.statusCode === 200 && res.data != null) {
          resolve(res.data!)
        } else {
          reject(new Error('获取地址信息失败'));
        }
      },
      fail: (err: RequestFail) => {
        reject(err);
      }
    });
  });
}
