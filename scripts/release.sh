#!/bin/bash

# 发布脚本 - 自动更新版本号并创建Git标签

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查参数
if [ $# -eq 0 ]; then
    print_error "请提供版本号，例如: ./scripts/release.sh v1.0.0"
    exit 1
fi

VERSION=$1

# 验证版本号格式
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "版本号格式错误，请使用格式: v1.0.0"
    exit 1
fi

print_step "开始发布版本: $VERSION"

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    print_warning "检测到未提交的更改，请先提交或暂存更改"
    git status --short
    exit 1
fi

# 更新 package.json 版本号
print_step "更新 package.json 版本号"
if command -v jq &> /dev/null; then
    jq --arg version "${VERSION#v}" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json
else
    print_warning "jq 未安装，请手动更新 package.json 中的版本号为 ${VERSION#v}"
fi

# 更新 Cargo.toml 版本号
print_step "更新 Cargo.toml 版本号"
sed -i.bak "s/^version = \".*\"/version = \"${VERSION#v}\"/" src-tauri/Cargo.toml
rm src-tauri/Cargo.toml.bak

# 更新 tauri.conf.json 版本号
print_step "更新 tauri.conf.json 版本号"
sed -i.bak "s/\"version\": \".*\"/\"version\": \"${VERSION#v}\"/" src-tauri/tauri.conf.json
rm src-tauri/tauri.conf.json.bak

# 提交更改
print_step "提交版本更新"
git add .
git commit -m "Release $VERSION"

# 创建标签
print_step "创建 Git 标签"
git tag $VERSION

# 推送到远程仓库
print_step "推送到远程仓库"
git push origin main
git push origin $VERSION

print_message "版本 $VERSION 发布成功！"
print_message "GitHub Actions 将自动构建并发布到 Releases 页面"
print_message "请访问: https://github.com/your-username/ASR-tauri-app/releases" 