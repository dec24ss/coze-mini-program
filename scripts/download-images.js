#!/usr/bin/env node

/**
 * 图片预下载脚本
 * 确保后端图片目录有图片，避免小程序图片加载失败
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 100张高质量艺术风格图片URL（使用Lorem Picsum）
const PAINTING_URLS = [
  'https://picsum.photos/id/100/900/1200.jpg?quality=75',
  'https://picsum.photos/id/101/900/1200.jpg?quality=75',
  'https://picsum.photos/id/102/900/1200.jpg?quality=75',
  'https://picsum.photos/id/103/900/1200.jpg?quality=75',
  'https://picsum.photos/id/104/900/1200.jpg?quality=75',
  'https://picsum.photos/id/106/900/1200.jpg?quality=75',
  'https://picsum.photos/id/107/900/1200.jpg?quality=75',
  'https://picsum.photos/id/108/900/1200.jpg?quality=75',
  'https://picsum.photos/id/109/900/1200.jpg?quality=75',
  'https://picsum.photos/id/110/900/1200.jpg?quality=75',
  'https://picsum.photos/id/111/900/1200.jpg?quality=75',
  'https://picsum.photos/id/112/900/1200.jpg?quality=75',
  'https://picsum.photos/id/113/900/1200.jpg?quality=75',
  'https://picsum.photos/id/114/900/1200.jpg?quality=75',
  'https://picsum.photos/id/115/900/1200.jpg?quality=75',
  'https://picsum.photos/id/116/900/1200.jpg?quality=75',
  'https://picsum.photos/id/117/900/1200.jpg?quality=75',
  'https://picsum.photos/id/118/900/1200.jpg?quality=75',
  'https://picsum.photos/id/119/900/1200.jpg?quality=75',
  'https://picsum.photos/id/120/900/1200.jpg?quality=75',
  'https://picsum.photos/id/121/900/1200.jpg?quality=75',
  'https://picsum.photos/id/122/900/1200.jpg?quality=75',
  'https://picsum.photos/id/123/900/1200.jpg?quality=75',
  'https://picsum.photos/id/124/900/1200.jpg?quality=75',
  'https://picsum.photos/id/125/900/1200.jpg?quality=75',
  'https://picsum.photos/id/126/900/1200.jpg?quality=75',
  'https://picsum.photos/id/127/900/1200.jpg?quality=75',
  'https://picsum.photos/id/128/900/1200.jpg?quality=75',
  'https://picsum.photos/id/129/900/1200.jpg?quality=75',
  'https://picsum.photos/id/130/900/1200.jpg?quality=75',
  'https://picsum.photos/id/131/900/1200.jpg?quality=75',
  'https://picsum.photos/id/132/900/1200.jpg?quality=75',
  'https://picsum.photos/id/133/900/1200.jpg?quality=75',
  'https://picsum.photos/id/134/900/1200.jpg?quality=75',
  'https://picsum.photos/id/135/900/1200.jpg?quality=75',
  'https://picsum.photos/id/136/900/1200.jpg?quality=75',
  'https://picsum.photos/id/137/900/1200.jpg?quality=75',
  'https://picsum.photos/id/138/900/1200.jpg?quality=75',
  'https://picsum.photos/id/139/900/1200.jpg?quality=75',
  'https://picsum.photos/id/140/900/1200.jpg?quality=75',
  'https://picsum.photos/id/141/900/1200.jpg?quality=75',
  'https://picsum.photos/id/142/900/1200.jpg?quality=75',
  'https://picsum.photos/id/143/900/1200.jpg?quality=75',
  'https://picsum.photos/id/144/900/1200.jpg?quality=75',
  'https://picsum.photos/id/145/900/1200.jpg?quality=75',
  'https://picsum.photos/id/146/900/1200.jpg?quality=75',
  'https://picsum.photos/id/147/900/1200.jpg?quality=75',
  'https://picsum.photos/id/148/900/1200.jpg?quality=75',
  'https://picsum.photos/id/149/900/1200.jpg?quality=75',
  'https://picsum.photos/id/150/900/1200.jpg?quality=75',
  'https://picsum.photos/id/151/900/1200.jpg?quality=75',
  'https://picsum.photos/id/152/900/1200.jpg?quality=75',
  'https://picsum.photos/id/153/900/1200.jpg?quality=75',
  'https://picsum.photos/id/154/900/1200.jpg?quality=75',
  'https://picsum.photos/id/155/900/1200.jpg?quality=75',
  'https://picsum.photos/id/156/900/1200.jpg?quality=75',
  'https://picsum.photos/id/157/900/1200.jpg?quality=75',
  'https://picsum.photos/id/158/900/1200.jpg?quality=75',
  'https://picsum.photos/id/159/900/1200.jpg?quality=75',
  'https://picsum.photos/id/160/900/1200.jpg?quality=75',
  'https://picsum.photos/id/161/900/1200.jpg?quality=75',
  'https://picsum.photos/id/162/900/1200.jpg?quality=75',
  'https://picsum.photos/id/163/900/1200.jpg?quality=75',
  'https://picsum.photos/id/164/900/1200.jpg?quality=75',
  'https://picsum.photos/id/165/900/1200.jpg?quality=75',
  'https://picsum.photos/id/166/900/1200.jpg?quality=75',
  'https://picsum.photos/id/167/900/1200.jpg?quality=75',
  'https://picsum.photos/id/168/900/1200.jpg?quality=75',
  'https://picsum.photos/id/169/900/1200.jpg?quality=75',
  'https://picsum.photos/id/170/900/1200.jpg?quality=75',
  'https://picsum.photos/id/171/900/1200.jpg?quality=75',
  'https://picsum.photos/id/172/900/1200.jpg?quality=75',
  'https://picsum.photos/id/173/900/1200.jpg?quality=75',
  'https://picsum.photos/id/174/900/1200.jpg?quality=75',
  'https://picsum.photos/id/175/900/1200.jpg?quality=75',
  'https://picsum.photos/id/176/900/1200.jpg?quality=75',
  'https://picsum.photos/id/177/900/1200.jpg?quality=75',
  'https://picsum.photos/id/178/900/1200.jpg?quality=75',
  'https://picsum.photos/id/179/900/1200.jpg?quality=75',
  'https://picsum.photos/id/180/900/1200.jpg?quality=75',
  'https://picsum.photos/id/181/900/1200.jpg?quality=75',
  'https://picsum.photos/id/182/900/1200.jpg?quality=75',
  'https://picsum.photos/id/183/900/1200.jpg?quality=75',
  'https://picsum.photos/id/184/900/1200.jpg?quality=75',
  'https://picsum.photos/id/185/900/1200.jpg?quality=75',
  'https://picsum.photos/id/186/900/1200.jpg?quality=75',
  'https://picsum.photos/id/187/900/1200.jpg?quality=75',
  'https://picsum.photos/id/188/900/1200.jpg?quality=75',
  'https://picsum.photos/id/189/900/1200.jpg?quality=75',
  'https://picsum.photos/id/190/900/1200.jpg?quality=75',
  'https://picsum.photos/id/191/900/1200.jpg?quality=75',
  'https://picsum.photos/id/192/900/1200.jpg?quality=75',
  'https://picsum.photos/id/193/900/1200.jpg?quality=75',
  'https://picsum.photos/id/194/900/1200.jpg?quality=75',
  'https://picsum.photos/id/195/900/1200.jpg?quality=75',
  'https://picsum.photos/id/196/900/1200.jpg?quality=75',
  'https://picsum.photos/id/197/900/1200.jpg?quality=75',
  'https://picsum.photos/id/198/900/1200.jpg?quality=75',
  'https://picsum.photos/id/199/900/1200.jpg?quality=75',
];

// 图片目录路径
const IMAGES_DIR = path.join(__dirname, '../server/public/images');

// 创建图片目录
if (!fs.existsSync(IMAGES_DIR)) {
  console.log(`📁 创建图片目录: ${IMAGES_DIR}`);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// 下载图片函数
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`下载超时: ${url}`));
    }, 30000); // 30秒超时

    https.get(url, (response) => {
      clearTimeout(timeout);

      // 处理重定向
      if ([301, 302, 307, 308].includes(response.statusCode)) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`🔄 跟随重定向: ${url.substring(0, 50)}...`);
          downloadImage(redirectUrl, filepath)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {});
          clearTimeout(timeout);
          reject(err);
        });
      } else {
        clearTimeout(timeout);
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// 主函数
async function main() {
  console.log('==========================================');
  console.log('📥 开始下载图片...');
  console.log('==========================================');

  const total = PAINTING_URLS.length;
  let downloaded = 0;
  let failed = 0;

  // 限制并发下载数量为5
  const concurrency = 5;
  const chunks = [];

  for (let i = 0; i < PAINTING_URLS.length; i += concurrency) {
    chunks.push(PAINTING_URLS.slice(i, i + concurrency));
  }

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    await Promise.all(
      chunk.map(async (url, idx) => {
        const i = chunkIndex * concurrency + idx;
        const filename = `painting_${i}.jpg`;
        const filepath = path.join(IMAGES_DIR, filename);

        try {
          await fs.promises.access(filepath);
          console.log(`⏭️  跳过已存在: ${filename} (${downloaded + failed + 1}/${total})`);
          downloaded++;
        } catch {
          try {
            await downloadImage(url, filepath);
            downloaded++;
            console.log(`✓ 下载完成: ${filename} (${downloaded + failed}/${total})`);
          } catch (error) {
            failed++;
            console.error(`✗ 下载失败: ${filename} - ${error.message}`);
          }
        }
      })
    );
  }

  console.log('==========================================');
  console.log(`✅ 图片下载完成: 成功 ${downloaded}/${total}, 失败 ${failed}/${total}`);
  console.log(`📁 图片目录: ${IMAGES_DIR}`);
  console.log('==========================================');

  if (failed > 0) {
    console.warn(`⚠️  有 ${failed} 张图片下载失败，但不影响小程序使用`);
  }

  if (downloaded === 0) {
    console.error('❌ 所有图片下载失败，请检查网络连接');
    process.exit(1);
  }
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 下载图片失败:', error);
  process.exit(1);
});
