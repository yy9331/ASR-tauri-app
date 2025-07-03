#!/bin/bash

# 测试构建脚本
set -e

echo "🚀 开始测试构建..."

# 检查必要的工具
echo "📋 检查工具..."
command -v bun >/dev/null 2>&1 || { echo "❌ bun 未安装"; exit 1; }
command -v rustc >/dev/null 2>&1 || { echo "❌ rustc 未安装"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ python3 未安装"; exit 1; }

# 安装前端依赖
echo "📦 安装前端依赖..."
bun install

# 构建前端
echo "🔨 构建前端..."
bun run build

# 安装 Python 依赖（处理 SSL 证书问题）
echo "🐍 安装 Python 依赖..."
# 尝试使用国内镜像源解决 SSL 问题
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r src-tauri/requirements.txt || {
    echo "⚠️ 使用默认源失败，尝试使用国内镜像源..."
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn -r src-tauri/requirements.txt || {
        echo "⚠️ 清华源失败，尝试阿里云源..."
        pip install -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com -r src-tauri/requirements.txt || {
            echo "❌ 所有镜像源都失败，跳过 Python 依赖安装"
            echo "💡 提示：你可以手动安装依赖：pip install openai-whisper torch"
        }
    }
}

# 构建 Tauri 应用
echo "⚙️ 构建 Tauri 应用..."
bun run tauri build

echo "✅ 构建完成！" 