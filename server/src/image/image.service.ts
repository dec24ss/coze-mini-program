import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

// 30张高质量艺术风格图片URL（使用Lorem Picsum，最稳定可靠）
// Lorem Picsum 优点：永不会404、固定尺寸、免费无限调用、响应速度快
const PAINTING_URLS = [
  // 使用已验证的 Image ID，确保图片存在
  'https://picsum.photos/id/100/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/101/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/102/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/103/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/104/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/106/1200/1600.jpg', // 跳过105（不存在）
  'https://picsum.photos/id/107/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/108/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/109/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/110/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/111/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/112/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/113/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/114/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/115/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/116/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/117/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/118/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/119/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/120/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/121/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/122/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/123/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/124/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/125/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/126/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/127/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/128/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/129/1200/1600.jpg', // 自然风光
  'https://picsum.photos/id/130/1200/1600.jpg', // 自然风光
]

// 4种游戏音效URL（使用可靠的 CDN 源，稳定且免费）
const SOUND_URLS = [
  'https://www.soundjay.com/buttons/sounds/button-1.mp3', // 点击音效
  'https://www.soundjay.com/buttons/sounds/button-2.mp3', // 成功音效
  'https://www.soundjay.com/buttons/sounds/button-3.mp3', // 失败音效
  'https://www.soundjay.com/buttons/sounds/button-4.mp3', // 拖拽音效
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
    // 异步下载图片，不阻塞服务器启动
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
  getRandomImages(count: number = 30): string[] {
    // 使用时间戳作为随机种子，确保每次请求都生成不同的图片
    const randomSeed = Date.now()

    // 生成指定数量的随机图片 URL
    return Array.from({ length: count }, (_, i) => {
      // 使用 ?random 参数确保每次都不同
      return `https://picsum.photos/1200/1600?random=${randomSeed}_${i}`
    })
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

  getAllSounds(): { name: string; url: string }[] {
    // 直接返回音效URL列表，不下载到本地
    const soundNames = ['click', 'success', 'fail', 'drag']
    return soundNames.map((name, i) => ({
      name,
      url: SOUND_URLS[i]
    }))
  }
}
