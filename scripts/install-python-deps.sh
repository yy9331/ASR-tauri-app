#!/bin/bash

# Python 依赖安装脚本
set -e

echo "🐍 开始安装 Python 依赖..."

# 检查 Python 版本
python_version=$(python3 --version 2>&1 | cut -d' ' -f2)
echo "📋 Python 版本: $python_version"

# 升级 pip
echo "⬆️ 升级 pip..."
python3 -m pip install --upgrade pip

# 方法1: 使用默认源（带信任主机）
echo "🔄 方法1: 使用默认源..."
if python3 -m pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r src-tauri/requirements.txt; then
    echo "✅ 方法1 成功！"
    exit 0
fi

# 方法2: 使用清华源
echo "🔄 方法2: 使用清华源..."
if python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn -r src-tauri/requirements.txt; then
    echo "✅ 方法2 成功！"
    exit 0
fi

# 方法3: 使用阿里云源
echo "🔄 方法3: 使用阿里云源..."
if python3 -m pip install -i https://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com -r src-tauri/requirements.txt; then
    echo "✅ 方法3 成功！"
    exit 0
fi

# 方法4: 使用豆瓣源
echo "🔄 方法4: 使用豆瓣源..."
if python3 -m pip install -i https://pypi.douban.com/simple/ --trusted-host pypi.douban.com -r src-tauri/requirements.txt; then
    echo "✅ 方法4 成功！"
    exit 0
fi

# 方法5: 使用中科大源
echo "🔄 方法5: 使用中科大源..."
if python3 -m pip install -i https://pypi.mirrors.ustc.edu.cn/simple/ --trusted-host pypi.mirrors.ustc.edu.cn -r src-tauri/requirements.txt; then
    echo "✅ 方法5 成功！"
    exit 0
fi

# 方法6: 手动安装每个包
echo "🔄 方法6: 手动安装每个包..."
echo "📦 安装 openai-whisper..."
if python3 -m pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org openai-whisper; then
    echo "✅ openai-whisper 安装成功"
else
    echo "⚠️ openai-whisper 安装失败，尝试使用镜像源..."
    python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn openai-whisper || {
        echo "❌ openai-whisper 安装失败"
    }
fi

echo "📦 安装 torch..."
if python3 -m pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org torch; then
    echo "✅ torch 安装成功"
else
    echo "⚠️ torch 安装失败，尝试使用镜像源..."
    python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ --trusted-host pypi.tuna.tsinghua.edu.cn torch || {
        echo "❌ torch 安装失败"
    }
fi

echo "✅ Python 依赖安装完成！" 