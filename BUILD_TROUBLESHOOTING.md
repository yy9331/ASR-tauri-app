# 构建故障排除指南

## 问题概述

GitHub Actions 构建失败的主要原因是：

1. **Tauri 2.0 配置问题**：缺少 WebView 配置
2. **系统依赖问题**：WebKit 和 GTK 依赖不完整
3. **平台特定问题**：不同操作系统的构建环境配置
4. **SSL 证书问题**：Python 依赖安装时的网络问题

## 当前状态

✅ **macOS 构建成功** - 已生成 5.9MB 的构建产物  
❌ **Ubuntu 构建失败** - 需要修复 WebKit 依赖问题  
❌ **Windows 构建失败** - 需要修复 Visual Studio 配置问题  

## 已修复的问题

### 1. Tauri 2.0 配置修复

在 `src-tauri/tauri.conf.json` 中添加了：

```json
{
  "plugins": {
    "opener": {}
  }
}
```

### 2. GitHub Actions 工作流优化

- 简化了依赖安装步骤
- 移除了不必要的包管理器安装
- 添加了平台特定的环境变量
- 优化了 Rust 工具链配置
- **添加了 SSL 证书问题的解决方案**
- **添加了 FFmpeg 音频处理依赖**
- **修复了 Windows Chocolatey 安装问题**

### 3. Cargo.toml 更新

添加了必要的 Tauri 特性：

```toml
tauri = { version = "2", features = [] }
```

### 4. SSL 证书问题解决方案

创建了专门的 Python 依赖安装脚本，提供多种解决方案：

```bash
./scripts/install-python-deps.sh
```

## 平台诊断工具

使用平台诊断脚本检查环境：

```bash
./scripts/platform-test.sh
```

## 本地测试构建

### 方法1: 使用测试脚本
```bash
./scripts/test-build.sh
```

### 方法2: 手动安装 Python 依赖
如果遇到 SSL 证书问题，可以手动安装：

```bash
# 使用清华源
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn openai-whisper torch

# 或使用阿里云源
pip install -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com openai-whisper torch
```

## 常见问题解决

### SSL 证书验证失败

**错误信息**：
```
SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed
```

**解决方案**：

1. **使用信任主机参数**：
   ```bash
   pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org openai-whisper torch
   ```

2. **使用国内镜像源**：
   ```bash
   # 清华源
   pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn openai-whisper torch
   
   # 阿里云源
   pip install -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com openai-whisper torch
   
   # 豆瓣源
   pip install -i https://pypi.douban.com/simple/ --trusted-host pypi.douban.com openai-whisper torch
   ```

3. **使用专门的安装脚本**：
   ```bash
   ./scripts/install-python-deps.sh
   ```

### Ubuntu/Linux 构建问题

**常见错误**：
- `Process completed with exit code 1`
- `webkitgtk: Unsatisfied requirements failed this build`

**解决方案**：

1. **安装完整的 WebKit 依赖**：
   ```bash
   sudo apt-get update
   sudo apt-get install -y \
     build-essential \
     libssl-dev \
     pkg-config \
     libwebkit2gtk-4.0-dev \
     libgtk-3-dev \
     libsoup-3.0-dev \
     libjavascriptcoregtk-4.1-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev \
     libcairo2-dev \
     libpango1.0-dev \
     libatk1.0-dev \
     libgdk-pixbuf2.0-dev \
     libglib2.0-dev \
     libgirepository1.0-dev \
     # 额外的 WebKit 依赖
     libwebkit2gtk-4.1-dev \
     libsoup2.4-dev \
     libgstreamer1.0-dev \
     libgstreamer-plugins-base1.0-dev \
     # 音频处理依赖
     ffmpeg \
     libavcodec-dev \
     libavformat-dev \
     libavutil-dev
   ```

2. **设置环境变量**：
   ```bash
   export PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig:/usr/share/pkgconfig
   export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu
   ```

3. **检查 WebKit 版本兼容性**：
   ```bash
   pkg-config --modversion webkit2gtk-4.0
   ```

### Windows 构建问题

**常见错误**：
- `Process completed with exit code 1`
- `link.exe not found`
- `Visual Studio Build Tools not found`

**解决方案**：

1. **安装 Visual Studio Build Tools**：
   ```powershell
   # 安装 Chocolatey
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   
   # 安装 Visual Studio Build Tools
   choco install visualstudio2022buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended" -y
   
   # 安装 FFmpeg
   choco install ffmpeg -y
   ```

2. **设置 Rust 目标**：
   ```bash
   rustup target add x86_64-pc-windows-msvc
   ```

3. **设置环境变量**：
   ```bash
   set CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_LINKER=link.exe
   ```

4. **检查 Visual Studio 安装**：
   ```bash
   where cl
   where link
   ```

### macOS 构建问题

如果遇到 WebKit 相关错误：

1. 确保 Xcode 命令行工具已安装：
   ```bash
   xcode-select --install
   ```

2. 检查 Rust 工具链：
   ```bash
   rustup default stable
   rustup target add aarch64-apple-darwin x86_64-apple-darwin
   ```

3. 安装音频处理依赖：
   ```bash
   brew install ffmpeg
   ```

## 验证构建

构建成功后，检查以下目录：

- `src-tauri/target/release/bundle/` - 包含构建的应用程序包

## 下一步

1. 推送更改到 GitHub
2. 创建新的标签触发构建：
   ```bash
   git tag v0.1.4
   git push origin v0.1.4
   ```
3. 监控 GitHub Actions 构建状态

## 网络问题临时解决方案

如果持续遇到网络问题，可以考虑：

1. **使用代理**：设置 HTTP_PROXY 和 HTTPS_PROXY 环境变量
2. **使用 VPN**：连接到稳定的网络
3. **手动下载**：从镜像站手动下载 wheel 文件并安装
4. **跳过 Python 依赖**：如果 Python 功能不是必需的，可以暂时跳过安装

## 最新修复

### v0.1.4 修复内容

1. **修复 GitHub Actions 工作流**：
   - 添加了缺失的步骤名称
   - 优化了 Ubuntu WebKit 依赖安装
   - 修复了 Windows Chocolatey 安装问题
   - 添加了 FFmpeg 音频处理依赖

2. **创建平台诊断工具**：
   - `scripts/platform-test.sh` - 检测平台特定问题

3. **增强错误处理**：
   - 改进了 Python 依赖安装的容错性
   - 添加了更详细的错误信息 