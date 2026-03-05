/**
 * 预览版导出脚本
 * 用于导出可以在微信开发者工具中直接预览的版本（无需配置云开发）
 */

const fs = require('fs')
const path = require('path')

console.log('📦 开始准备预览版导出...\n')

// 1. 确保 USE_CLOUDBASE 设置为 false
const cloudbaseIndexPath = path.join(__dirname, 'src/cloudbase/index.ts')
if (fs.existsSync(cloudbaseIndexPath)) {
  let content = fs.readFileSync(cloudbaseIndexPath, 'utf-8')
  content = content.replace(
    /export const USE_CLOUDBASE = true/,
    'export const USE_CLOUDBASE = false'
  )
  fs.writeFileSync(cloudbaseIndexPath, content, 'utf-8')
  console.log('✅ 已将 USE_CLOUDBASE 设置为 false')
}

// 2. 确保 loading 页面的 USE_CLOUDBASE 设置为 false
const loadingIndexPath = path.join(__dirname, 'src/pages/loading/index.tsx')
if (fs.existsSync(loadingIndexPath)) {
  let content = fs.readFileSync(loadingIndexPath, 'utf-8')
  content = content.replace(
    /const USE_CLOUDBASE = true/,
    'const USE_CLOUDBASE = false'
  )
  fs.writeFileSync(loadingIndexPath, content, 'utf-8')
  console.log('✅ 已将 loading 页面的 USE_CLOUDBASE 设置为 false')
}

console.log('\n📝 预览版导出准备完成！')
console.log('\n📋 使用说明：')
console.log('   1. 运行: pnpm build:weapp')
console.log('   2. 使用微信开发者工具打开 dist 目录')
console.log('   3. 可以直接预览，无需配置云开发')
console.log('\n⚠️  注意事项：')
console.log('   - 云开发功能已禁用，排行榜和用户系统使用本地存储')
console.log('   - 如果需要完整功能，请使用正式 AppID 并启用云开发')
console.log('   - 详见 README.md 中的云开发配置说明\n')
