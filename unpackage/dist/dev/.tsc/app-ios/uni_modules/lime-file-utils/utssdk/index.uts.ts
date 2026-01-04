// @ts-nocheck
// fileToBase64, fileToDataURL,dataURLToFile

export function fileToBase64(filePath : string) {
	return new Promise((resolve, reject)=>{
		if(uni.canIUse('getFileSystemManager')){
			uni.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: (res) => {
					resolve(res.data)
				},
				fail: (error) => {
					__f__('error','at uni_modules/lime-file-utils/utssdk/index.uts:14',{ error, path })
					reject(error)
				}
			})
		} else {
			reject('fileToBase64：环境不支持')
		}
	})
	
}
export function fileToDataURL(filePath : string) {
	let extension = path.substring(path.lastIndexOf('.') + 1);
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
	const isImageFile = imageExtensions.includes(extension.toLowerCase());
	let prefix = ''
	if (isImageFile) {
		prefix = 'image/';
		if(extension == 'svg') {
			extension += '+xml'
		}
	} else if (extension === 'pdf') {
		prefix = 'application/pdf';
	} else if (extension === 'txt') {
		prefix = 'text/plain';
	} else {
		// 添加更多文件类型的判断
		// 如果不是图片、PDF、文本等类型，可以设定默认的前缀或采取其他处理
		prefix = 'application/octet-stream';
	}
	
	return fileToBase64(filePath).then(res => `data:${prefix}${extension};base64,${res}`)
}

function getFileExtensionFromDataURL(dataURL : string) : string {
	const commaIndex = dataURL.indexOf(",");
	const mimeType = dataURL.substring(0, commaIndex).replace("data:", "").replace(";base64", "");
	const mimeTypeParts = mimeType.split("/");
	return mimeTypeParts[1];
}

function getPlatform():Uni {






























	return uni
}

export function dataURLToFile(dataURL : string, filename : NullableString = null) {

	return new Promise((resolve, reject) => {
		const name = filename ?? `${Date.now()}.${getFileExtensionFromDataURL(dataURL)}`;
		const commaIndex = dataURL.indexOf(",");
		const base64 = dataURL.substring(commaIndex + 1);
		const platform = getPlatform()
		const filePath = `${platform.env.USER_DATA_PATH}/${name}`;

		fs.writeFile({
			filePath,
			data: base64,
			encoding: 'base64',
			success() {
				resolve(filePath)
			},
			fail(err) {
				reject(err)
			}
		})
	})

}