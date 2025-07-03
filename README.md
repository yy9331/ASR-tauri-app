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

# 安装 Python 依赖
pip install -r src-tauri/requirements.txt
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

## 🐛 故障排除

### 麦克风权限问题

如果遇到麦克风权限问题：
1. 确保浏览器允许麦克风访问
2. 检查系统麦克风设置
3. 重启应用

### Python 环境问题

如果 Whisper 无法运行：
1. 确保 Python 版本 >= 3.8
2. 重新安装依赖: `pip install -r src-tauri/requirements.txt`
3. 检查 Python 路径是否正确

### 识别失败

如果语音识别失败：
1. 确保音频文件格式正确
2. 检查网络连接（首次运行需要下载模型）
3. 查看控制台错误信息

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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [OpenAI Whisper](https://github.com/openai/whisper) - 语音识别模型
- [React](https://reactjs.org/) - 前端框架 