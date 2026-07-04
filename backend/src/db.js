const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const dataPath = path.join(__dirname, '..', 'data.json')

function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8')
      const data = JSON.parse(content)
      if (!data.users) data.users = []
      if (!data.invite_codes) data.invite_codes = []
      if (!data.files) data.files = []
      return data
    }
  } catch (e) {
    console.error('Load data error:', e)
  }
  return { users: [], invite_codes: [], files: [] }
}

function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error('Save data error:', e)
  }
}

// ---------- 文件相关 ----------
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

function addFile(filename, originalName, size, mimeType, expireDays = 7, userId = null) {
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
    download_count: 0,
    user_id: userId
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

function getFilesByUserId(userId) {
  const data = loadData()
  const now = Date.now()
  return data.files
    .filter(f => f.user_id === userId && f.expire_time >= now)
    .sort((a, b) => b.upload_time - a.upload_time)
}

function getAllFiles() {
  const data = loadData()
  return data.files.sort((a, b) => b.upload_time - a.upload_time)
}

function deleteFile(fileId) {
  const data = loadData()
  const index = data.files.findIndex(f => f.id == fileId)
  if (index === -1) return false
  const file = data.files[index]
  const uploadDir = path.join(__dirname, '..', 'uploads')
  const filePath = path.join(uploadDir, file.filename)
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (e) {
    console.error('Delete file error:', e)
  }
  data.files.splice(index, 1)
  saveData(data)
  return true
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

// ---------- 用户相关 ----------
function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

function findUserByUsername(username) {
  const data = loadData()
  return data.users.find(u => u.username === username) || null
}

function findUserById(id) {
  const data = loadData()
  return data.users.find(u => u.id == id) || null
}

function registerUser(username, password, inviteCodeId = null) {
  const data = loadData()
  
  if (data.users.find(u => u.username === username)) {
    throw new Error('用户名已存在')
  }
  
  const user = {
    id: Date.now() + Math.random(),
    username,
    password: hashPassword(password),
    role: 'user',
    max_uploads: 50,
    max_file_size_mb: 100,
    invite_code_id: inviteCodeId,
    created_at: Date.now()
  }
  
  data.users.push(user)
  saveData(data)
  
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    max_uploads: user.max_uploads,
    max_file_size_mb: user.max_file_size_mb
  }
}

function loginUser(username, password) {
  const user = findUserByUsername(username)
  if (!user) return null
  if (!comparePassword(password, user.password)) return null
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    max_uploads: user.max_uploads,
    max_file_size_mb: user.max_file_size_mb
  }
}

function getAllUsers() {
  const data = loadData()
  return data.users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    max_uploads: u.max_uploads,
    max_file_size_mb: u.max_file_size_mb,
    created_at: u.created_at
  })).sort((a, b) => b.created_at - a.created_at)
}

function getUserUploadCount(userId) {
  const data = loadData()
  const now = Date.now()
  return data.files.filter(f => f.user_id == userId && f.expire_time >= now).length
}

function deleteUser(userId) {
  const data = loadData()
  const userIndex = data.users.findIndex(u => u.id == userId)
  if (userIndex === -1) return false
  
  const user = data.users[userIndex]
  if (user.role === 'admin') {
    const adminCount = data.users.filter(u => u.role === 'admin').length
    if (adminCount <= 1) {
      throw new Error('不能删除最后一个管理员')
    }
  }
  
  const uploadDir = path.join(__dirname, '..', 'uploads')
  const userFiles = data.files.filter(f => f.user_id == userId)
  userFiles.forEach(file => {
    const filePath = path.join(uploadDir, file.filename)
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (e) {}
  })
  
  data.files = data.files.filter(f => f.user_id != userId)
  data.users.splice(userIndex, 1)
  saveData(data)
  return true
}

// ---------- 邀请码相关 ----------
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function createInviteCodes(count, createdBy = null) {
  const data = loadData()
  const existingCodes = new Set(data.invite_codes.map(c => c.code))
  const newCodes = []
  
  for (let i = 0; i < count; i++) {
    let code
    let attempts = 0
    do {
      code = generateInviteCode()
      attempts++
    } while (existingCodes.has(code) && attempts < 100)
    
    if (existingCodes.has(code)) continue
    
    const invite = {
      id: Date.now() + Math.random() + i,
      code,
      used: false,
      used_by: null,
      used_at: null,
      created_by: createdBy,
      created_at: Date.now()
    }
    
    data.invite_codes.push(invite)
    newCodes.push(invite)
    existingCodes.add(code)
  }
  
  saveData(data)
  return newCodes
}

function getInviteCode(code) {
  const data = loadData()
  return data.invite_codes.find(c => c.code === code.toUpperCase()) || null
}

function useInviteCode(code, userId) {
  const data = loadData()
  const invite = data.invite_codes.find(c => c.code === code.toUpperCase())
  if (!invite) return false
  if (invite.used) return false
  
  invite.used = true
  invite.used_by = userId
  invite.used_at = Date.now()
  saveData(data)
  return true
}

function getAllInviteCodes() {
  const data = loadData()
  return data.invite_codes.sort((a, b) => b.created_at - a.created_at)
}

function deleteInviteCode(id) {
  const data = loadData()
  const index = data.invite_codes.findIndex(c => c.id == id)
  if (index === -1) return false
  if (data.invite_codes[index].used) return false
  data.invite_codes.splice(index, 1)
  saveData(data)
  return true
}

// ---------- 初始化管理员 ----------
function initAdmin() {
  const data = loadData()
  const adminExists = data.users.some(u => u.role === 'admin')
  if (!adminExists) {
    const admin = {
      id: Date.now(),
      username: 'admin',
      password: hashPassword('admin123'),
      role: 'admin',
      max_uploads: 9999,
      max_file_size_mb: 400,
      created_at: Date.now()
    }
    data.users.push(admin)
    saveData(data)
    console.log('👑 默认管理员已创建: admin / admin123')
  }
}

initAdmin()

module.exports = {
  addFile,
  getFileByCode,
  getFilesByUserId,
  getAllFiles,
  deleteFile,
  incrementDownload,
  cleanExpiredFiles,
  findUserByUsername,
  findUserById,
  registerUser,
  loginUser,
  getAllUsers,
  getUserUploadCount,
  deleteUser,
  createInviteCodes,
  getInviteCode,
  useInviteCode,
  getAllInviteCodes,
  deleteInviteCode
}
