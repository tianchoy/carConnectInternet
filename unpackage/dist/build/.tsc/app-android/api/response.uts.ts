export function asJSONObject(value: any): UTSJSONObject {
    if (value == null) {
        return new UTSJSONObject()
    }
    return value as UTSJSONObject
}

export function getResponseCode(response: UTSJSONObject): number {
    return response.getNumber('code', -1)
}

export function getResponseMessage(response: UTSJSONObject): string {
    const msg = response.getString('msg', '')
    return msg != '' ? msg : response.getString('message', '')
}

export function getResponseDataObject(response: UTSJSONObject): UTSJSONObject {
    const data = response.getJSON('data')
    return data != null ? data : new UTSJSONObject()
}

export function getResponseDataArray(response: UTSJSONObject): Array<UTSJSONObject> {
    const data = response.getArray<UTSJSONObject>('data')
    return data != null ? data : []
}
