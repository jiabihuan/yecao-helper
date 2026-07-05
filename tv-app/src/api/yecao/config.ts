const BASE_URL = 'http://172.245.61.121:3000'

export const ApiConfig = {
  BASE_URL,
  UPLOAD_URL: `${BASE_URL}/api/upload`,
  CODE_INFO_URL: `${BASE_URL}/api/code`,
  DOWNLOAD_URL: `${BASE_URL}/api/download`,
}

export function setBaseUrl(url: string) {
  ApiConfig.BASE_URL = url
  ApiConfig.UPLOAD_URL = `${url}/api/upload`
  ApiConfig.CODE_INFO_URL = `${url}/api/code`
  ApiConfig.DOWNLOAD_URL = `${url}/api/download`
}

export default ApiConfig
