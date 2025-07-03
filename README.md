# 🎤 智能语音识别与文本修饰应用 (ASR Tauri App)

一个基于 Tauri + React + Whisper + Tailwind CSS 的跨平台智能语音识别与文本修饰桌面应用。

## 🚀 快速下载

### 最新版本下载

访问 [GitHub Releases](https://github.com/your-username/ASR-tauri-app/releases) 下载最新版本：

- **macOS**: 下载 `.dmg` 文件，双击安装
- **Windows**: 下载 `.msi` 或 `.exe` 文件安装
- **Linux**: 下载 `.AppImage` 或 `.deb` 文件

### 系统要求

- **macOS**: 10.15 (Catalina) 或更高版本
- **Windows**: Windows 10 或更高版本
- **Linux**: Ubuntu 18.04+ 或其他支持 AppImage 的发行版
- **内存**: 至少 4GB RAM
- **存储**: 至少 500MB 可用空间

### 安装说明

#### macOS
1. 下载 `.dmg` 文件
2. 双击打开 DMG 文件
3. 将应用拖拽到 Applications 文件夹
4. 从启动台或 Applications 文件夹启动应用

#### Windows
1. 下载 `.msi` 或 `.exe` 文件
2. 双击运行安装程序
3. 按照安装向导完成安装
4. 从开始菜单或桌面快捷方式启动

#### Linux
1. 下载 `.AppImage` 文件
2. 给文件添加执行权限：`chmod +x 文件名.AppImage`
3. 双击运行或通过终端执行

## 📦 开发构建

如果你想从源码构建应用，请按照以下步骤操作：

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

### 4. 发布新版本

要发布新版本，请按照以下步骤：

1. 使用发布脚本（推荐）：
   ```bash
   # 确保脚本有执行权限
   chmod +x scripts/release.sh
   
   # 发布新版本
   ./scripts/release.sh v1.0.0
   ```

2. 手动发布（如果脚本不可用）：
   ```bash
   # 更新版本号
   # 更新 package.json 中的版本号
   # 更新 src-tauri/Cargo.toml 中的版本号
   # 更新 src-tauri/tauri.conf.json 中的版本号
   
   # 提交更改
   git add .
   git commit -m "Release v1.0.0"
   git tag v1.0.0
   git push origin main --tags
   ```

3. GitHub Actions 会自动构建并发布到 Releases 页面

## ✨ 功能特性

- 🎙️ **实时录音**: 使用浏览器录音 API 进行高质量录音
- 🤖 **AI 语音识别**: 集成 OpenAI Whisper 模型进行准确的语音转文字
- ✨ **智能文本修饰**: 自动检测语言并修正语法错误、标点符号、重复词等，特别优化中文语音识别缺少标点符号的问题
- 🎨 **现代化界面**: 使用 Tailwind CSS 构建美观的界面和流畅的动画效果
- 🌓 **主题切换**: 默认黑夜模式，支持手动切换到白天模式，温和的米色暖色调保护眼睛
- 📱 **响应式设计**: 支持桌面和移动设备
- 📋 **一键复制**: 识别结果和修饰文本可一键复制到剪贴板
- 🗑️ **数据清理**: 自动清理临时文件，保护隐私
- 🌐 **多语言支持**: 支持中文和英文的智能修饰

## 🛠️ 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Tauri (Rust) + Python
- **语音识别**: OpenAI Whisper
- **文本修饰**: 自定义 Python 脚本
- **样式**: Tailwind CSS + 现代化设计

## 📋 开发环境要求

- Node.js 18+ 或 Bun
- Python 3.8+
- Rust (通过 rustup 安装)
- ffmpeg (音频处理必需)

## 📖 使用说明

### 语音识别功能

1. **开始录音**: 点击 "🎤 开始录音" 按钮，允许麦克风权限
2. **停止录音**: 点击 "⏹️ 停止录音" 按钮结束录音
3. **预览录音**: 录音完成后可以播放预览
4. **开始识别**: 点击 "🔍 开始识别" 按钮进行语音识别
5. **查看结果**: 识别结果会显示在下方，可以点击 "📋 复制文本" 复制
6. **修饰文本**: 点击 "✨ 修饰文本" 按钮进入文本修饰功能

### 文本修饰功能

1. **输入文本**: 在文本框中输入需要修饰的文本
2. **选择修饰方式**:
   - **✨ 智能修饰**: 自动检测语言并修饰
   - **🇨🇳 中文修饰**: 专门针对中文文本修饰
   - **🇺🇸 英文修饰**: 专门针对英文文本修饰
3. **查看结果**: 对比原始文本和修饰后文本
4. **查看修改**: 查看具体的修改内容列表
5. **复制使用**: 复制修饰后的文本或直接使用

### 文本修饰功能特性

#### 中文修饰
- 修正标点符号（中文标点 → 英文标点）
- 修正重复词（如"的的" → "的"）
- 添加中英文间空格
- 自动添加句末标点

#### 英文修饰
- 修正重复词（如"the the" → "the"）
- 修正大小写（如"i" → "I"）
- 自动添加句末标点
- 修正常见语法错误

## 🔧 配置说明

### Whisper 模型

默认使用 "base" 模型，可以在 `src-tauri/whisper_asr.py` 中修改：

```python
model = whisper.load_model("base")  # 可选: tiny, base, small, medium, large
```

### 文本修饰规则

可以在 `src-tauri/text_polish.py` 中自定义修饰规则：

```python
# 添加新的语法规则
'custom_rule': {
    'pattern': r'your_pattern',
    'replacement': 'your_replacement'
}
```

### Tailwind CSS 配置

可以在 `tailwind.config.js` 中自定义样式：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* 自定义主色调 */ },
        accent: { /* 自定义强调色 */ }
      }
    }
  }
}
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

### 4. Tailwind CSS 配置问题

**问题描述**：
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package
```

**解决方案**：
安装正确版本的 Tailwind CSS：

```bash
# 移除错误版本
bun remove tailwindcss postcss autoprefixer

# 安装兼容版本
bun add -D "tailwindcss@^3.4.0" "postcss@^8.4.0" "autoprefixer@^10.4.0"
```

**原因**：Tailwind CSS v4 的配置方式与 v3 不同，需要使用兼容的版本。

### 5. Whisper 模型下载问题

**问题描述**：
首次运行时，Whisper 需要下载模型文件（约139MB），可能因为网络问题失败。

**解决方案**：
1. 确保网络连接稳定
2. 使用代理或VPN
3. 手动下载模型文件到 `~/.cache/whisper/` 目录

### 6. 麦克风权限问题

**问题描述**：
```
无法访问麦克风，请检查权限设置
```

**解决方案**：
1. 确保浏览器允许麦克风访问
2. 检查系统麦克风设置
3. 重启应用

### 7. Python 环境问题

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
│   ├── index.css          # Tailwind CSS 样式
│   └── main.tsx           # 入口文件
├── src-tauri/             # Tauri 后端代码
│   ├── src/
│   │   ├── lib.rs         # Rust 后端逻辑
│   │   └── main.rs        # 主入口
│   ├── whisper_asr.py     # Python 语音识别脚本
│   ├── text_polish.py     # Python 文本修饰脚本
│   └── requirements.txt   # Python 依赖
├── .github/               # GitHub Actions 配置
│   └── workflows/         # 自动化工作流
│       ├── release.yml    # 发布工作流
│       └── test.yml       # 测试工作流
├── scripts/               # 构建和发布脚本
│   └── release.sh         # 自动化发布脚本
├── public/                # 静态资源
├── tailwind.config.cjs    # Tailwind CSS 配置
├── postcss.config.cjs     # PostCSS 配置
├── INSTALL.md             # 详细安装说明
├── LICENSE                # 许可证文件
└── package.json           # 项目配置
```

## 🔍 调试技巧

### 1. 查看详细错误信息
在 Tauri 开发模式下，错误信息会显示在终端中。

### 2. 测试 Python 脚本
```bash
cd src-tauri
python whisper_asr.py <audio_file_path>
python text_polish.py "测试文本"
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

# 清理 Tailwind CSS 缓存
rm -rf node_modules/.cache
```

## 🚀 性能优化

### 1. 中文标点符号智能添加
应用特别针对中文语音识别缺少标点符号的问题进行了优化：

- **智能句子分割**: 基于句末词、疑问词、感叹词自动识别句子边界
- **停顿词识别**: 自动在"但是"、"然后"、"如果"等连接词前添加逗号
- **疑问句识别**: 检测"什么"、"怎么"、"为什么"等疑问词，自动添加问号
- **感叹句识别**: 识别"真"、"太"、"好"等感叹词，自动添加感叹号
- **句末标点**: 确保每个句子都以适当的标点符号结尾

**示例**：
```
输入: "我今天去超市买了苹果香蕉橙子然后回家做饭"
输出: "我今天去超市买了苹果香蕉橙子，然后回家做饭。"
```

### 2. 模型选择
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

### 4. 主题系统
- 默认使用黑夜模式
- 手动切换主题按钮（点击切换到白天模式）
- 主题偏好本地存储
- 平滑的过渡动画
- **白天主题**: 温和的米色暖色调，保护眼睛
- **夜晚主题**: 深色舒适模式，减少蓝光刺激

### 5. Tailwind CSS 优化
- 使用 JIT 模式减少构建时间
- 配置 content 路径以优化打包大小
- 使用 CDN 版本进行开发

## 🎨 UI/UX 特性

### 1. 响应式设计
- 移动端友好的布局
- 自适应按钮大小
- 触摸友好的交互

### 2. 动画效果
- 平滑的过渡动画
- 录音状态指示器
- 加载状态反馈

### 3. 无障碍设计
- 键盘导航支持
- 屏幕阅读器友好
- 高对比度模式

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [OpenAI Whisper](https://github.com/openai/whisper) - 语音识别模型
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 📝 更新日志

### v2.1.0 (2024-01-XX)
- 🚀 新增 GitHub Actions 自动构建和发布功能
- 📦 支持一键发布到 GitHub Releases
- 🔧 新增自动化发布脚本
- 📚 完善安装说明和文档
- 🎯 优化应用窗口大小和布局
- 📄 添加 MIT 许可证

### v2.0.0 (2024-01-XX)
- ✨ 新增智能文本修饰功能，特别优化中文语音识别缺少标点符号的问题
- 🎨 完全重构 UI，使用 Tailwind CSS
- 🌓 新增主题切换功能（默认黑夜模式，支持切换到白天模式）
- 🌐 支持中英文智能修饰
- 📱 改进响应式设计
- 🔧 优化性能和用户体验
- 📚 完善文档和故障排除指南

### v1.0.0 (2024-01-XX)
- ✅ 修复 Python 脚本路径问题
- ✅ 解决 SSL 证书验证失败
- ✅ 添加 ffmpeg 依赖安装说明
- ✅ 完善故障排除文档
- ✅ 优化错误处理机制 