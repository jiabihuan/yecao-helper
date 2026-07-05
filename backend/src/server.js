require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
  addFile,
  getFileByCode,
  getFilesByUserId,
  getAllFiles,
  deleteFile,
  incrementDownload,
  cleanExpiredFiles,
  registerUser,
  loginUser,
  findUserById,
  getAllUsers,
  getUserUploadCount,
  deleteUser,
  createInviteCodes,
  getInviteCode,
  useInviteCode,
  getAllInviteCodes,
  deleteInviteCode
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const JWT_SECRET = process.env.JWT_SECRET || 'xinghe-helper-secret-key-2024';
const DEFAULT_MAX_FILE_SIZE_MB = 100;
const DEFAULT_EXPIRE_DAYS = parseInt(process.env.EXPIRE_DAYS) || 7;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' });
  }
  
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      max_uploads: user.max_uploads,
      max_file_size_mb: user.max_file_size_mb
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '无权访问' });
  }
  next();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

function getUpload(req, res, next) {
  const maxSize = (req.user ? req.user.max_file_size_mb : DEFAULT_MAX_FILE_SIZE_MB) * 1024 * 1024;
  const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.apk') {
        cb(null, true);
      } else {
        cb(new Error('只支持上传 APK 文件'));
      }
    }
  });
  upload.single('file')(req, res, next);
}

// ---------- 用户认证 API ----------
app.post('/api/auth/register', (req, res) => {
  const { username, password, invite_code } = req.body;
  
  if (!username || !password || !invite_code) {
    return res.status(400).json({ error: '请填写完整信息' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: '用户名长度 3-20 位' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少 6 位' });
  }
  
  const invite = getInviteCode(invite_code);
  if (!invite) {
    return res.status(400).json({ error: '邀请码无效' });
  }
  if (invite.used) {
    return res.status(400).json({ error: '邀请码已被使用' });
  }
  
  try {
    const user = registerUser(username, password, invite.id);
    useInviteCode(invite_code, user.id);
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        max_uploads: user.max_uploads,
        max_file_size_mb: user.max_file_size_mb
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名和密码' });
  }
  
  const user = loginUser(username, password);
  if (!user) {
    return res.status(400).json({ error: '用户名或密码错误' });
  }
  
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      max_uploads: user.max_uploads,
      max_file_size_mb: user.max_file_size_mb
    }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const uploadCount = getUserUploadCount(req.user.id);
  res.json({
    success: true,
    user: {
      ...req.user,
      upload_count: uploadCount
    }
  });
});

// ---------- 文件上传 API ----------
app.post('/api/upload', authMiddleware, (req, res) => {
  const uploadCount = getUserUploadCount(req.user.id);
  if (uploadCount >= req.user.max_uploads) {
    return res.status(400).json({ error: `上传数量已达上限（${req.user.max_uploads}个）` });
  }
  
  getUpload(req, res, (err) => {
    if (err) {
      console.error('上传错误:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `文件大小超过限制（最大 ${req.user.max_file_size_mb}MB）` });
      }
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的文件' });
    }
    
    console.log('文件上传成功:', req.file.originalname, req.file.size);
    
    try {
      const fileInfo = addFile(
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        DEFAULT_EXPIRE_DAYS,
        req.user.id
      );
      
      console.log('生成口令:', fileInfo.code);
      
      res.json({
        success: true,
        code: fileInfo.code,
        filename: fileInfo.original_name,
        size: fileInfo.size,
        upload_time: fileInfo.upload_time,
        expire_time: fileInfo.expire_time,
        expire_days: DEFAULT_EXPIRE_DAYS
      });
    } catch (e) {
      console.error('保存文件信息错误:', e);
      res.status(500).json({ error: '上传失败，请重试' });
    }
  });
});

app.get('/api/my-files', authMiddleware, (req, res) => {
  const files = getFilesByUserId(req.user.id);
  res.json({
    success: true,
    files
  });
});

app.delete('/api/files/:id', authMiddleware, (req, res) => {
  const fileId = req.params.id;
  const file = getFileByCode(fileId) || getAllFiles().find(f => f.id == fileId);
  
  if (!file) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  if (file.user_id != req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: '无权删除' });
  }
  
  deleteFile(file.id);
  res.json({ success: true });
});

// ---------- 公共 API（TV端用） ----------
app.get('/api/code/:code', (req, res) => {
  const code = req.params.code;
  const file = getFileByCode(code);
  
  if (!file) {
    return res.status(404).json({ error: '口令无效或文件已过期' });
  }
  
  res.json({
    success: true,
    code: file.code,
    filename: file.original_name,
    size: file.size,
    mime_type: file.mime_type,
    upload_time: file.upload_time,
    expire_time: file.expire_time,
    download_count: file.download_count
  });
});

app.get('/api/download/:code', (req, res) => {
  const code = req.params.code;
  const file = getFileByCode(code);
  
  if (!file) {
    return res.status(404).json({ error: '口令无效或文件已过期' });
  }
  
  const filePath = path.join(UPLOAD_DIR, file.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  incrementDownload(code);
  
  res.download(filePath, file.original_name, (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

// ---------- 管理员 API ----------
app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  const users = getAllUsers();
  const files = getAllFiles();
  const invites = getAllInviteCodes();
  
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const usedInvites = invites.filter(i => i.used).length;
  const unusedInvites = invites.filter(i => !i.used).length;
  
  res.json({
    success: true,
    stats: {
      user_count: users.length,
      file_count: files.length,
      total_size: totalSize,
      invite_total: invites.length,
      invite_used: usedInvites,
      invite_unused: unusedInvites
    }
  });
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const users = getAllUsers();
  const usersWithCount = users.map(u => ({
    ...u,
    upload_count: getUserUploadCount(u.id)
  }));
  res.json({ success: true, users: usersWithCount });
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  const userId = req.params.id;
  try {
    const result = deleteUser(userId);
    res.json({ success: result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/admin/invites', authMiddleware, adminMiddleware, (req, res) => {
  const invites = getAllInviteCodes();
  res.json({ success: true, invites });
});

app.post('/api/admin/invites', authMiddleware, adminMiddleware, (req, res) => {
  const { count } = req.body;
  const num = parseInt(count) || 1;
  if (num < 1 || num > 100) {
    return res.status(400).json({ error: '数量需在 1-100 之间' });
  }
  
  const codes = createInviteCodes(num, req.user.id);
  res.json({ success: true, codes });
});

app.delete('/api/admin/invites/:id', authMiddleware, adminMiddleware, (req, res) => {
  const result = deleteInviteCode(req.params.id);
  res.json({ success: result });
});

app.get('/api/admin/files', authMiddleware, adminMiddleware, (req, res) => {
  const files = getAllFiles();
  res.json({ success: true, files });
});

app.delete('/api/admin/files/:id', authMiddleware, adminMiddleware, (req, res) => {
  const result = deleteFile(req.params.id);
  res.json({ success: result });
});

app.listen(PORT, () => {
  console.log(`🌿 星河助手后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📂 上传目录: ${UPLOAD_DIR}`);
  console.log(`⏰ 过期时间: ${DEFAULT_EXPIRE_DAYS}天`);
  console.log(`👑 默认管理员: admin / admin123`);
  console.log(`⚙️  管理后台: http://localhost:${PORT}/admin.html`);
});
