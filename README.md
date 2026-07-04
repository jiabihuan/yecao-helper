# 🌿 野草助手 (Yecao Helper)

基于 QuickTVUI 框架开发的大屏应用安装工具，类似野草助手的功能。通过 4 位口令快速在智能电视/盒子上安装 APK 应用。

## ✨ 功能特性

- **口令安装**：输入 4 位口令即可自动下载并安装应用
- **网页上传**：简洁的网页界面，拖拽上传 APK 生成口令
- **多端支持**：智能电视、电视盒子、投影仪等 Android 大屏设备
- **文件过期**：自动清理过期文件，默认保留 7 天
- **断点续传**：支持大文件下载（最大 400MB）

## 📁 项目结构

```
yecao-helper/
├── backend/              # 后端服务
│   ├── src/              # 后端源码
│   │   ├── server.js     # Express 服务器
│   │   └── db.js         # SQLite 数据库
│   ├── uploads/          # APK 文件存储目录
│   ├── public/           # 网页上传端
│   │   └── index.html    # 上传页面
│   ├── package.json
│   └── .env.example
│
└── tv-app/               # TV 端应用（基于 QuickTVUI）
    ├── android/          # Android 打包配置
    ├── src/              # TV 端源码
    │   ├── pages/
    │   │   ├── yecao-home/       # 首页
    │   │   ├── yecao-code/       # 口令输入页
    │   │   ├── yecao-download/   # 下载安装页
    │   │   └── yecao-settings/   # 设置页
    │   ├── api/yecao/            # API 接口
    │   └── ...
    └── package.json
```

## 🚀 快速开始

### 1. 启动后端服务

```bash
cd backend

# 安装依赖
npm install

# 复制配置文件
cp .env.example .env

# 启动服务
npm start
```

服务启动后：
- 网页上传端：http://localhost:3000
- API 接口：http://localhost:3000/api

### 2. 配置 TV 端

修改 `tv-app/src/api/yecao/config.ts` 中的服务器地址：

```typescript
const BASE_URL = 'http://你的服务器地址:3000'
```

### 3. TV 端开发调试

```bash
cd tv-app

# 安装依赖
npm install --legacy-peer-deps

# 开发调试
npm run dev

# 打包 APK
npm run build-apk-debug    # Debug 包
npm run build-apk-release  # Release 包
```

APK 输出路径：`tv-app/android/app/build/outputs/apk/`

## 📡 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/upload` | POST | 上传 APK 文件，返回口令 |
| `/api/code/:code` | GET | 查询口令对应的文件信息 |
| `/api/download/:code` | GET | 通过口令下载文件 |
| `/api/health` | GET | 健康检查 |

### 上传示例

```bash
curl -X POST -F "file=@app.apk" http://localhost:3000/api/upload
```

响应：
```json
{
  "success": true,
  "code": "A1B2",
  "filename": "app.apk",
  "size": 12345678,
  "expire_days": 7
}
```

## ⚙️ 配置说明

### 后端配置 (.env)

```
PORT=3000                  # 服务端口
MAX_FILE_SIZE_MB=400       # 最大文件大小（MB）
EXPIRE_DAYS=7              # 文件过期天数
CLEANUP_KEY=your-secret    # 清理接口密钥
```

### TV 端配置

在 TV 端设置页面中配置服务器地址，或直接修改源码：
- 文件：`src/api/yecao/config.ts`
- 变量：`BASE_URL`

## 📱 TV 端页面

1. **首页**：功能入口菜单
2. **口令安装**：遥控器输入 4 位口令
3. **下载安装**：显示下载进度和安装状态
4. **设置**：配置服务器地址

## 🛠 技术栈

**后端：**
- Node.js + Express
- SQLite (better-sqlite3)
- Multer (文件上传)

**TV 端：**
- QuickTVUI (基于 Hippy)
- Vue 3 + TypeScript
- Android 原生打包

## 📝 注意事项

1. 首次使用 TV 端需要在设置中配置服务器地址
2. 确保电视和服务器在同一网络，或服务器有公网访问
3. APK 文件默认保留 7 天，过期自动删除
4. 最大支持 400MB 的 APK 文件

## 📄 License

Apache-2.0
