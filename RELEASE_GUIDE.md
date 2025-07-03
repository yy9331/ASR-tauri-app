# 🚀 发布指南

本指南将帮助你使用 GitHub Actions 自动构建和发布应用到 GitHub Releases。

## 📋 前置条件

1. **GitHub 仓库**: 确保你的项目已推送到 GitHub
2. **GitHub Actions 权限**: 确保仓库启用了 GitHub Actions
3. **本地开发环境**: 确保本地可以正常构建应用

## 🔧 首次设置

### 1. 推送代码到 GitHub

```bash
# 确保所有更改已提交
git add .
git commit -m "Initial commit with GitHub Actions"
git push origin main
```

### 2. 检查 GitHub Actions

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签页
3. 确认工作流文件已正确创建

## 📦 发布新版本

### 方法一：使用发布脚本（推荐）

```bash
# 确保脚本有执行权限
chmod +x scripts/release.sh

# 发布新版本
./scripts/release.sh v2.1.0
```

发布脚本会自动：
- 更新所有版本号文件
- 提交更改
- 创建 Git 标签
- 推送到 GitHub
- 触发 GitHub Actions 构建

### 方法二：手动发布

1. **更新版本号**：
   ```bash
   # 更新 package.json
   # 更新 src-tauri/Cargo.toml
   # 更新 src-tauri/tauri.conf.json
   ```

2. **提交更改**：
   ```bash
   git add .
   git commit -m "Release v2.1.0"
   ```

3. **创建标签**：
   ```bash
   git tag v2.1.0
   git push origin main --tags
   ```

## 🔍 监控构建过程

### 1. 查看构建状态

1. 访问 GitHub 仓库的 "Actions" 页面
2. 查看最新的工作流运行状态
3. 点击运行记录查看详细日志

### 2. 构建平台

GitHub Actions 会在以下平台构建：
- **macOS**: 生成 `.dmg` 和 `.app.tar.gz` 文件
- **Windows**: 生成 `.msi` 和 `.exe` 文件
- **Linux**: 生成 `.AppImage` 和 `.deb` 文件

### 3. 构建时间

- 首次构建：约 10-15 分钟（需要下载依赖）
- 后续构建：约 5-8 分钟

## 📋 发布检查清单

发布前请确认：

- [ ] 所有功能已测试通过
- [ ] 版本号已正确更新
- [ ] 更新日志已更新
- [ ] 本地构建测试通过
- [ ] 代码已提交到 GitHub

## 🐛 常见问题

### 构建失败

1. **检查日志**: 查看 GitHub Actions 的详细错误信息
2. **依赖问题**: 确保 `requirements.txt` 和 `package.json` 正确
3. **权限问题**: 确保 GitHub Actions 有足够权限

### 版本号不匹配

1. **检查文件**: 确保所有版本号文件都已更新
2. **重新发布**: 删除标签重新发布
   ```bash
   git tag -d v2.1.0
   git push origin :refs/tags/v2.1.0
   ./scripts/release.sh v2.1.0
   ```

### 文件未上传到 Releases

1. **检查权限**: 确保 GitHub Actions 有写入权限
2. **检查标签**: 确保标签格式正确（v*）
3. **重新触发**: 手动重新运行工作流

## 📊 发布统计

### 文件大小

- **macOS**: ~50-80MB
- **Windows**: ~40-60MB
- **Linux**: ~30-50MB

### 支持的平台

- **macOS**: 10.15+ (Intel/Apple Silicon)
- **Windows**: 10+ (x64)
- **Linux**: Ubuntu 18.04+ (x64)

## 🔄 自动化流程

### 触发条件

- 推送标签（格式：v*）
- 手动触发（workflow_dispatch）

### 构建流程

1. **环境设置**: 安装 Node.js、Bun、Rust
2. **依赖安装**: 安装系统依赖和项目依赖
3. **前端构建**: 构建 React 应用
4. **Tauri 构建**: 构建桌面应用
5. **文件上传**: 上传构建产物到 Releases

### 发布流程

1. **下载产物**: 下载所有平台的构建产物
2. **创建 Release**: 自动创建 GitHub Release
3. **上传文件**: 上传所有安装包
4. **生成说明**: 自动生成发布说明

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Actions 文档](https://docs.github.com/en/actions)
2. 检查 [Tauri 构建文档](https://tauri.app/v2/guides/getting-started/setup/)
3. 提交 [GitHub Issue](https://github.com/your-username/ASR-tauri-app/issues)

## 🎯 最佳实践

1. **版本命名**: 使用语义化版本号（如 v1.0.0）
2. **测试发布**: 先发布预发布版本测试
3. **文档更新**: 及时更新 README 和安装说明
4. **回滚准备**: 保留旧版本以应对问题 