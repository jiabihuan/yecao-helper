require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { addFile, getFileByCode, incrementDownload, cleanExpiredFiles } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB) || 400) * 1024 * 1024;
const EXPIRE_DAYS = parseInt(process.env.EXPIRE_DAYS) || 7;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.apk') {
      cb(null, true);
    } else {
      cb(new Error('只支持上传 APK 文件'));
    }
  }
});

app.post('/api/upload', (req, res) => {
  console.log('收到上传请求');
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('上传错误:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `文件大小超过限制（最大 ${MAX_FILE_SIZE / 1024 / 1024}MB）` });
      }
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      console.log('没有文件');
      return res.status(400).json({ error: '请选择要上传的文件' });
    }
    
    console.log('文件上传成功:', req.file.originalname, req.file.size);
    
    try {
      const fileInfo = addFile(
        req.file.filename,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        EXPIRE_DAYS
      );
      
      console.log('生成口令:', fileInfo.code);
      
      res.json({
        success: true,
        code: fileInfo.code,
        filename: fileInfo.original_name,
        size: fileInfo.size,
        upload_time: fileInfo.upload_time,
        expire_time: fileInfo.expire_time,
        expire_days: EXPIRE_DAYS
      });
    } catch (e) {
      console.error('保存文件信息错误:', e);
      res.status(500).json({ error: '上传失败，请重试' });
    }
  });
});

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

app.get('/cleanup', (req, res) => {
  const key = req.query.key;
  if (key !== process.env.CLEANUP_KEY) {
    return res.status(403).json({ error: '无权访问' });
  }
  const count = cleanExpiredFiles();
  res.json({ cleaned: count });
});

app.listen(PORT, () => {
  console.log(`🌿 野草助手后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📂 上传目录: ${UPLOAD_DIR}`);
  console.log(`📦 最大文件: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  console.log(`⏰ 过期时间: ${EXPIRE_DAYS}天`);
});
