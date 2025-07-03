# 📦 安装说明

## 🚀 快速安装

### 方法一：直接下载（推荐）

1. 访问 [GitHub Releases](https://github.com/yy9331/ASR-tauri-app/releases)
2. 下载适合你操作系统的安装包
3. 按照下面的平台特定说明进行安装

### 方法二：从源码构建

如果你想要最新版本或自定义功能，可以从源码构建：

```bash
git clone https://github.com/yy9331/ASR-tauri-app.git
cd ASR-tauri-app
./scripts/release.sh v1.0.0
```

## 📱 平台特定安装

### macOS

#### 下载 DMG 文件
1. 从 Releases 页面下载 `.dmg` 文件
2. 双击打开 DMG 文件
3. 将应用拖拽到 Applications 文件夹
4. 从启动台或 Applications 文件夹启动应用

#### 首次运行
- 如果遇到"无法验证开发者"错误：
  1. 打开系统偏好设置 > 安全性与隐私
  2. 点击"仍要打开"或"允许"
  3. 重新启动应用

#### 权限设置
应用需要以下权限：
- **麦克风权限**: 用于语音录音
- **文件访问权限**: 用于保存音频文件

### Windows

#### 下载 MSI 安装包
1. 从 Releases 页面下载 `.msi` 文件
2. 双击运行安装程序
3. 按照安装向导完成安装
4. 从开始菜单或桌面快捷方式启动

#### 下载 EXE 文件
1. 从 Releases 页面下载 `.exe` 文件
2. 双击运行（便携版，无需安装）
3. 或右键选择"以管理员身份运行"

#### 系统要求
- Windows 10 (版本 1903) 或更高版本
- 至少 4GB RAM
- 至少 500MB 可用磁盘空间

### Linux

#### 下载 AppImage 文件
1. 从 Releases 页面下载 `.AppImage` 文件
2. 给文件添加执行权限：
   ```bash
   chmod +x 智能语音识别助手-*.AppImage
   ```
3. 双击运行或通过终端执行：
   ```bash
   ./智能语音识别助手-*.AppImage
   ```

#### 下载 DEB 包
1. 从 Releases 页面下载 `.deb` 文件
2. 使用包管理器安装：
   ```bash
   sudo dpkg -i 智能语音识别助手-*.deb
   sudo apt-get install -f  # 安装依赖
   ```

#### 系统要求
- Ubuntu 18.04+ 或其他支持 AppImage 的发行版
- 至少 4GB RAM
- 至少 500MB 可用磁盘空间

## 🔧 依赖安装

### Python 依赖

应用需要 Python 3.8+ 和以下包：

```bash
# 使用 pip 安装
pip install -r src-tauri/requirements.txt

# 或使用国内镜像源（推荐）
pip install -r src-tauri/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

### FFmpeg

音频处理需要 FFmpeg：

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
1. 下载 FFmpeg: https://ffmpeg.org/download.html
2. 解压到系统 PATH 目录
3. 或使用 Chocolatey: `choco install ffmpeg`

## 🐛 常见问题

### 应用无法启动

1. **检查系统要求**: 确保系统版本满足要求
2. **检查权限**: 确保有足够的权限运行应用
3. **检查依赖**: 确保 Python 和 FFmpeg 已正确安装
4. **查看日志**: 检查应用日志文件

### 语音识别失败

1. **检查麦克风权限**: 确保应用有麦克风访问权限
2. **检查网络连接**: 首次使用需要下载 Whisper 模型
3. **检查 Python 环境**: 确保 Python 依赖已正确安装

### 性能问题

1. **关闭其他应用**: 释放系统资源
2. **检查磁盘空间**: 确保有足够的可用空间
3. **更新系统**: 确保系统是最新版本

## 📞 获取帮助

如果遇到问题：

1. 查看 [故障排除指南](README.md#故障排除与修复过程)
2. 提交 [GitHub Issue](https://github.com/yy9331/ASR-tauri-app/issues)
3. 查看 [常见问题](https://github.com/yy9331/ASR-tauri-app/wiki/FAQ)

## 🔄 更新应用

### 自动更新
应用会自动检查更新，如果有新版本会提示用户。

### 手动更新
1. 访问 [GitHub Releases](https://github.com/yy9331/ASR-tauri-app/releases)
2. 下载最新版本
3. 按照安装说明重新安装

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。 