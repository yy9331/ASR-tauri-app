#!/bin/bash

# 平台特定测试脚本
set -e

echo "🔍 平台诊断测试..."

# 检测操作系统
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
    echo "📋 检测到平台: Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    echo "📋 检测到平台: macOS"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    PLATFORM="windows"
    echo "📋 检测到平台: Windows"
else
    PLATFORM="unknown"
    echo "❓ 未知平台: $OSTYPE"
fi

# 检查基本工具
echo "🔧 检查基本工具..."
command -v bun >/dev/null 2>&1 && echo "✅ bun: $(bun --version)" || echo "❌ bun 未安装"
command -v rustc >/dev/null 2>&1 && echo "✅ rustc: $(rustc --version)" || echo "❌ rustc 未安装"
command -v python3 >/dev/null 2>&1 && echo "✅ python3: $(python3 --version)" || echo "❌ python3 未安装"

# 平台特定检查
if [[ "$PLATFORM" == "linux" ]]; then
    echo "🐧 Linux 特定检查..."
    
    # 检查 WebKit 依赖
    echo "🔍 检查 WebKit 依赖..."
    pkg-config --exists webkit2gtk-4.0 && echo "✅ webkit2gtk-4.0" || echo "❌ webkit2gtk-4.0 未安装"
    pkg-config --exists gtk+-3.0 && echo "✅ gtk+-3.0" || echo "❌ gtk+-3.0 未安装"
    pkg-config --exists libsoup-3.0 && echo "✅ libsoup-3.0" || echo "❌ libsoup-3.0 未安装"
    
    # 检查音频依赖
    echo "🔍 检查音频依赖..."
    command -v ffmpeg >/dev/null 2>&1 && echo "✅ ffmpeg: $(ffmpeg -version | head -n1)" || echo "❌ ffmpeg 未安装"
    
    # 检查环境变量
    echo "🔍 检查环境变量..."
    echo "PKG_CONFIG_PATH: ${PKG_CONFIG_PATH:-未设置}"
    echo "LD_LIBRARY_PATH: ${LD_LIBRARY_PATH:-未设置}"

elif [[ "$PLATFORM" == "macos" ]]; then
    echo "🍎 macOS 特定检查..."
    
    # 检查 Xcode 工具
    echo "🔍 检查 Xcode 工具..."
    xcode-select -p >/dev/null 2>&1 && echo "✅ Xcode 命令行工具已安装" || echo "❌ Xcode 命令行工具未安装"
    
    # 检查 Rust 目标
    echo "🔍 检查 Rust 目标..."
    rustup target list --installed | grep -q "aarch64-apple-darwin" && echo "✅ aarch64-apple-darwin" || echo "❌ aarch64-apple-darwin"
    rustup target list --installed | grep -q "x86_64-apple-darwin" && echo "✅ x86_64-apple-darwin" || echo "❌ x86_64-apple-darwin"
    
    # 检查音频依赖
    echo "🔍 检查音频依赖..."
    command -v ffmpeg >/dev/null 2>&1 && echo "✅ ffmpeg: $(ffmpeg -version | head -n1)" || echo "❌ ffmpeg 未安装"

elif [[ "$PLATFORM" == "windows" ]]; then
    echo "🪟 Windows 特定检查..."
    
    # 检查 Visual Studio
    echo "🔍 检查 Visual Studio..."
    if command -v cl >/dev/null 2>&1; then
        echo "✅ Visual Studio Build Tools 已安装"
    else
        echo "❌ Visual Studio Build Tools 未安装"
    fi
    
    # 检查 Rust 目标
    echo "🔍 检查 Rust 目标..."
    rustup target list --installed | grep -q "x86_64-pc-windows-msvc" && echo "✅ x86_64-pc-windows-msvc" || echo "❌ x86_64-pc-windows-msvc"
    
    # 检查 Chocolatey
    echo "🔍 检查 Chocolatey..."
    command -v choco >/dev/null 2>&1 && echo "✅ Chocolatey 已安装" || echo "❌ Chocolatey 未安装"
    
    # 检查音频依赖
    echo "🔍 检查音频依赖..."
    command -v ffmpeg >/dev/null 2>&1 && echo "✅ ffmpeg: $(ffmpeg -version | head -n1)" || echo "❌ ffmpeg 未安装"
fi

# 检查 Python 依赖
echo "🐍 检查 Python 依赖..."
python3 -c "import whisper; print('✅ openai-whisper 已安装')" 2>/dev/null || echo "❌ openai-whisper 未安装"
python3 -c "import torch; print('✅ torch 已安装')" 2>/dev/null || echo "❌ torch 未安装"

# 检查项目配置
echo "📁 检查项目配置..."
if [[ -f "src-tauri/tauri.conf.json" ]]; then
    echo "✅ tauri.conf.json 存在"
    # 检查配置语法
    if python3 -m json.tool src-tauri/tauri.conf.json >/dev/null 2>&1; then
        echo "✅ tauri.conf.json 语法正确"
    else
        echo "❌ tauri.conf.json 语法错误"
    fi
else
    echo "❌ tauri.conf.json 不存在"
fi

if [[ -f "src-tauri/Cargo.toml" ]]; then
    echo "✅ Cargo.toml 存在"
else
    echo "❌ Cargo.toml 不存在"
fi

echo "✅ 平台诊断完成！" 