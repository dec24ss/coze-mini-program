import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

// 100张高质量艺术风格图片URL（使用Lorem Picsum，最稳定可靠）
// 优化策略：使用更小的尺寸（900x1200）和质量（75%），加快加载速度
// Lorem Picsum 优点：永不会404、固定尺寸、免费无限调用、响应速度快
// 使用 ID 100-199，确保图片存在且质量高
const PAINTING_URLS = [
  'https://picsum.photos/id/100/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/101/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/102/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/103/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/104/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/106/900/1200.jpg?quality=75', // 建筑艺术（跳过105）
  'https://picsum.photos/id/107/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/108/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/109/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/110/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/111/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/112/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/113/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/114/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/115/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/116/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/117/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/118/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/119/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/120/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/121/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/122/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/123/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/124/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/125/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/126/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/127/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/128/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/129/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/130/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/131/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/132/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/133/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/134/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/135/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/136/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/137/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/138/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/139/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/140/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/141/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/142/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/143/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/144/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/145/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/146/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/147/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/148/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/149/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/150/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/151/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/152/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/153/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/154/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/155/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/156/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/157/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/158/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/159/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/160/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/161/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/162/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/163/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/164/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/165/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/166/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/167/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/168/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/169/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/170/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/171/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/172/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/173/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/174/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/175/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/176/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/177/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/178/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/179/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/180/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/181/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/182/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/183/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/184/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/185/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/186/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/187/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/188/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/189/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/190/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/191/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/192/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/193/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/194/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/195/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/196/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/197/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/198/900/1200.jpg?quality=75', // 自然风光
  'https://picsum.photos/id/199/900/1200.jpg?quality=75', // 自然风光
]

@Injectable()
export class ImageService implements OnModuleInit {
  // 使用相对于编译后文件的路径：从 dist/image 向上回到 server/public
  // 注意：编译后 image.service.ts 在 dist/image/ 目录，需要上2级到 dist，再上1级到 server，然后到 public/images
  private readonly imagesDir = path.join(__dirname, '../../public/images')
  private readonly imagesUrlBase = '/api/images'

  async onModuleInit() {
    console.log('🖼️  图片服务已启动，将异步下载图片资源...')
    await this.ensureImagesDir()
    // 异步下载，不阻塞服务器启动
    setTimeout(() => {
      this.downloadAllImages().catch((error) => {
        console.error('❌ 下载图片失败:', error)
      })
    }, 1000)
  }

  private async ensureImagesDir(): Promise<void> {
    try {
      await access(this.imagesDir)
      console.log(`📁 图片目录已存在: ${this.imagesDir}`)
    } catch {
      try {
        await mkdir(this.imagesDir, { recursive: true })
        console.log(`📁 创建图片目录: ${this.imagesDir}`)
      } catch (error) {
        console.error(`❌ 无法创建图片目录 ${this.imagesDir}:`, (error as Error).message)
        console.error('⚠️  将使用外部 CDN URL 作为图片源')
        throw error
      }
    }
  }

  private async downloadAllImages(): Promise<void> {
    const total = PAINTING_URLS.length
    console.log(`📥 开始下载 ${total} 张图片...`)
    let downloaded = 0
    let failed = 0

    // 限制并发下载数量为5
    const concurrency = 5
    const chunks: string[][] = []

    for (let i = 0; i < PAINTING_URLS.length; i += concurrency) {
      chunks.push(PAINTING_URLS.slice(i, i + concurrency))
    }

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex]
      await Promise.all(
        chunk.map(async (url, idx) => {
          const i = chunkIndex * concurrency + idx
          const filename = `painting_${i}.jpg`
          const filepath = path.join(this.imagesDir, filename)

          try {
            await access(filepath)
            console.log(`⏭️  跳过已存在: ${filename} (${downloaded + failed + 1}/${total})`)
            downloaded++
          } catch {
            try {
              await this.downloadImage(url, filepath)
              downloaded++
              console.log(`✓ 下载完成: ${filename} (${downloaded + failed}/${total})`)
            } catch (error) {
              failed++
              console.error(`✗ 下载失败: ${filename} - ${(error as Error).message}`)
            }
          }
        })
      )
    }

    console.log(`✅ 图片资源下载完成: 成功 ${downloaded}/${total}, 失败 ${failed}/${total}`)
  }

  private downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`下载超时: ${url}`))
      }, 30000) // 30秒超时

      // 使用 https 并跟随重定向
      https.get(url, (response) => {
        clearTimeout(timeout)

        // 处理重定向 (302, 301, 307, 308)
        if ([301, 302, 307, 308].includes(response.statusCode || 0)) {
          const redirectUrl = response.headers.location || response.headers.Location
          if (redirectUrl && typeof redirectUrl === 'string') {
            console.log(`🔄 跟随重定向: ${url.substring(0, 50)}...`)
            // 递归下载重定向后的 URL
            this.downloadImage(redirectUrl, filepath)
              .then(resolve)
              .catch(reject)
            return
          }
        }

        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath)
          response.pipe(fileStream)
          fileStream.on('finish', () => {
            fileStream.close()
            resolve()
          })
          fileStream.on('error', (err) => {
            fs.unlink(filepath, () => {}) // 删除不完整的文件
            clearTimeout(timeout)
            reject(err)
          })
        } else {
          clearTimeout(timeout)
          reject(new Error(`HTTP ${response.statusCode}: ${url}`))
        }
      }).on('error', (err) => {
        clearTimeout(timeout)
        reject(err)
      })
    })
  }

  // 生成随机图片列表（每次返回不同的图片）
  // 优化：使用更小的尺寸（900x1200）和质量参数，加快加载速度
  getRandomImages(count: number = 100): string[] {
    // 使用时间戳作为随机种子，确保每次请求都生成不同的图片
    const randomSeed = Date.now()

    // 生成指定数量的随机图片 URL
    return Array.from({ length: count }, (_, i) => {
      // 使用 ?random 参数确保每次都不同，并设置质量参数
      return `https://picsum.photos/900/1200?random=${randomSeed}_${i}&quality=75`
    })
  }

  // 获取图片版本号（用于支持增量更新）
  getImageVersion(): string {
    // 使用日期字符串作为版本号，格式：YYYYMMDD
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  getAllImages(): string[] {
    try {
      const files = fs.readdirSync(this.imagesDir)
      return files
        .filter(file => file.endsWith('.jpg'))
        .map(file => `${this.imagesUrlBase}/${file}`)
    } catch (error) {
      console.error('读取图片目录失败:', error)
      console.error('⚠️  将使用外部 CDN URL 作为图片源')
      // 返回原始 URL 作为后备方案
      return PAINTING_URLS
    }
  }
}
