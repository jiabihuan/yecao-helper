const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'data.json')

function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8')
      return JSON.parse(content)
    }
  } catch (e) {
    console.error('Load data error:', e)
  }
  return { files: [] }
}

function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Save data error:', e)
  }
}

function generateCode() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const data = loadData()
  const existingCodes = new Set(data.files.map(f => f.code))
  
  let code
  let attempts = 0
  do {
    code = ''
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    attempts++
    if (!existingCodes.has(code)) return code
  } while (attempts < 100)
  
  throw new Error('Failed to generate unique code')
}

function addFile(filename, originalName, size, mimeType, expireDays = 7) {
  const data = loadData()
  const code = generateCode()
  const now = Date.now()
  const expireTime = now + expireDays * 24 * 60 * 60 * 1000
  
  const file = {
    id: Date.now() + Math.random(),
    code,
    filename,
    original_name: originalName,
    size,
    mime_type: mimeType,
    upload_time: now,
    expire_time: expireTime,
    download_count: 0
  }
  
  data.files.push(file)
  saveData(data)
  
  return file
}

function getFileByCode(code) {
  const data = loadData()
  const file = data.files.find(f => f.code === code.toUpperCase())
  if (!file) return null
  if (file.expire_time < Date.now()) return null
  return file
}

function incrementDownload(code) {
  const data = loadData()
  const file = data.files.find(f => f.code === code.toUpperCase())
  if (file) {
    file.download_count = (file.download_count || 0) + 1
    saveData(data)
  }
}

function cleanExpiredFiles() {
  const data = loadData()
  const now = Date.now()
  const uploadDir = path.join(__dirname, '..', 'uploads')
  
  const expired = data.files.filter(f => f.expire_time < now)
  
  expired.forEach(file => {
    const filePath = path.join(uploadDir, file.filename)
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (e) {
      console.error('Failed to delete expired file:', e)
    }
  })
  
  data.files = data.files.filter(f => f.expire_time >= now)
  saveData(data)
  
  return expired.length
}

setInterval(() => {
  try {
    const count = cleanExpiredFiles()
    if (count > 0) {
      console.log(`Cleaned up ${count} expired files`)
    }
  } catch (e) {
    console.error('Error cleaning expired files:', e)
  }
}, 60 * 60 * 1000)

module.exports = {
  addFile,
  getFileByCode,
  incrementDownload,
  cleanExpiredFiles
}
