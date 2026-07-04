import ApiConfig from './config'

export interface FileInfo {
  code: string
  filename: string
  size: number
  mime_type: string
  upload_time: number
  expire_time: number
  download_count: number
}

export async function getFileInfo(code: string): Promise<FileInfo | null> {
  try {
    const response = await fetch(`${ApiConfig.CODE_INFO_URL}/${code.toUpperCase()}`)
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    if (data.success) {
      return data as FileInfo
    }
    return null
  } catch (e) {
    console.error('Get file info error:', e)
    return null
  }
}

export function getDownloadUrl(code: string): string {
  return `${ApiConfig.DOWNLOAD_URL}/${code.toUpperCase()}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
