# 🎤 语音识别应用 (ASR Tauri App)

一个基于 Tauri + React + Whisper 的跨平台语音识别桌面应用。

## ✨ 功能特性

- 🎙️ **实时录音**: 使用浏览器录音 API 进行高质量录音
- 🤖 **AI 语音识别**: 集成 OpenAI Whisper 模型进行准确的语音转文字
- 🎨 **现代化界面**: 美观的渐变背景和流畅的动画效果
- 📱 **响应式设计**: 支持桌面和移动设备
- 📋 **一键复制**: 识别结果可一键复制到剪贴板
- 🗑️ **数据清理**: 自动清理临时文件，保护隐私

## 🛠️ 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Tauri (Rust) + Python
- **语音识别**: OpenAI Whisper
- **样式**: CSS3 + 现代化设计

## 📋 系统要求

- Node.js 18+ 或 Bun
- Python 3.8+
- Rust (通过 rustup 安装)
- ffmpeg (音频处理必需)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd ASR-tauri-app
```

### 2. 安装依赖

```bash
# 安装前端依赖
bun install

# 安装 Python 依赖 (推荐使用国内镜像源)
pip install -r src-tauri/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 安装 ffmpeg (必需)
conda install -c conda-forge ffmpeg
```

### 3. 运行应用

```bash
# 开发模式
bun run tauri dev

# 构建生产版本
bun run tauri build
```

## 📖 使用说明

1. **开始录音**: 点击 "🎤 开始录音" 按钮，允许麦克风权限
2. **停止录音**: 点击 "⏹️ 停止录音" 按钮结束录音
3. **预览录音**: 录音完成后可以播放预览
4. **开始识别**: 点击 "🔍 开始识别" 按钮进行语音识别
5. **查看结果**: 识别结果会显示在下方，可以点击 "📋 复制文本" 复制
6. **清除数据**: 点击 "🗑️ 清除" 按钮清除当前录音和结果

## 🔧 配置说明

### Whisper 模型

默认使用 "base" 模型，可以在 `src-tauri/whisper_asr.py` 中修改：

```python
model = whisper.load_model("base")  # 可选: tiny, base, small, medium, large
```

### 音频格式

应用支持多种音频格式，推荐使用 WAV 格式以获得最佳识别效果。

## 🐛 故障排除与修复过程

在开发过程中，我们遇到了几个常见问题，以下是详细的解决方案：

### 1. Python 脚本路径错误

**问题描述**：
```
❌ 识别失败: python: can't open file '/Users/.../src-tauri/src-tauri/whisper_asr.py': [Errno 2] No such file or directory
```

**问题分析**：
路径中有重复的 `src-tauri` 目录，导致 Python 找不到脚本文件。

**解决方案**：
修改 `src-tauri/src/lib.rs` 文件中的路径构建逻辑：

```rust
// 修复前
let script_path = std::env::current_dir()
    .map_err(|e| format!("Failed to get current dir: {}", e))?
    .join("src-tauri").join("whisper_asr.py");

// 修复后
let script_path = std::env::current_dir()
    .map_err(|e| format!("Failed to get current dir: {}", e))?
    .join("whisper_asr.py");
```

**原因**：Tauri 应用运行时的工作目录已经是 `src-tauri`，不需要再添加前缀。

### 2. SSL 证书验证失败

**问题描述**：
```
WARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1002)'))': /simple/openai-whisper/
ERROR: Could not find a version that satisfies the requirement openai-whisper
```

**解决方案**：
使用国内镜像源安装 Python 依赖：

```bash
# 方法1: 使用清华大学镜像源 (推荐)
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 方法2: 临时禁用SSL验证
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

# 方法3: 使用conda安装
conda install -c conda-forge openai-whisper
conda install pytorch torchvision torchaudio -c pytorch
```

### 3. ffmpeg 缺失错误

**问题描述**：
```
FileNotFoundError: [Errno 2] No such file or directory: 'ffmpeg'
```

**问题分析**：
Whisper 需要 ffmpeg 来处理音频文件，但系统中没有安装。

**解决方案**：

```bash
# 方法1: 使用conda安装 (推荐)
conda install -c conda-forge ffmpeg

# 方法2: 使用Homebrew安装 (macOS)
brew install ffmpeg

# 方法3: 手动下载安装
# 访问 https://ffmpeg.org/download.html 下载对应版本
```

**验证安装**：
```bash
ffmpeg -version
```

### 4. Whisper 模型下载问题

**问题描述**：
首次运行时，Whisper 需要下载模型文件（约139MB），可能因为网络问题失败。

**解决方案**：
1. 确保网络连接稳定
2. 使用代理或VPN
3. 手动下载模型文件到 `~/.cache/whisper/` 目录

### 5. 麦克风权限问题

**问题描述**：
```
无法访问麦克风，请检查权限设置
```

**解决方案**：
1. 确保浏览器允许麦克风访问
2. 检查系统麦克风设置
3. 重启应用

### 6. Python 环境问题

**问题描述**：
```
ModuleNotFoundError: No module named 'whisper'
```

**解决方案**：
1. 确保 Python 版本 >= 3.8
2. 重新安装依赖: `pip install -r src-tauri/requirements.txt`
3. 检查 Python 路径是否正确
4. 使用虚拟环境隔离依赖

## 📁 项目结构

```
ASR-tauri-app/
├── src/                    # React 前端代码
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 样式文件
│   └── main.tsx           # 入口文件
├── src-tauri/             # Tauri 后端代码
│   ├── src/
│   │   ├── lib.rs         # Rust 后端逻辑
│   │   └── main.rs        # 主入口
│   ├── whisper_asr.py     # Python 语音识别脚本
│   └── requirements.txt   # Python 依赖
├── public/                # 静态资源
└── package.json           # 项目配置
```

## 🔍 调试技巧

### 1. 查看详细错误信息
在 Tauri 开发模式下，错误信息会显示在终端中。

### 2. 测试 Python 脚本
```bash
cd src-tauri
python whisper_asr.py <audio_file_path>
```

### 3. 检查依赖版本
```bash
pip list | grep whisper
ffmpeg -version
```

### 4. 清理缓存
```bash
# 清理 Whisper 模型缓存
rm -rf ~/.cache/whisper/

# 清理 Tauri 构建缓存
cargo clean
```

## 🚀 性能优化

### 1. 模型选择
- `tiny`: 最快，准确度较低
- `base`: 平衡速度和准确度（推荐）
- `small`: 更准确，速度较慢
- `medium/large`: 最高准确度，速度最慢

### 2. 音频质量
- 采样率：16kHz（Whisper 默认）
- 格式：WAV 或 MP3
- 避免背景噪音

### 3. 内存管理
- 及时清理临时文件
- 避免长时间录音
- 定期重启应用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [OpenAI Whisper](https://github.com/openai/whisper) - 语音识别模型
- [React](https://reactjs.org/) - 前端框架

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 修复 Python 脚本路径问题
- ✅ 解决 SSL 证书验证失败
- ✅ 添加 ffmpeg 依赖安装说明
- ✅ 完善故障排除文档
- ✅ 优化错误处理机制 