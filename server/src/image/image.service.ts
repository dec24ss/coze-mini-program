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
const PAINTING_URLS = Array.from({ length: 30 }, (_, i) => {
  // 使用不同的image ID确保每张图片不同
  const imageId = 100 + i
  // 固定尺寸 1200x1600 (3:4 比例)，适合拼图游戏
  return `https://picsum.photos/id/${imageId}/1200/1600.jpg`
})

@Injectable()
export class ImageService implements OnModuleInit {
  // 使用相对于编译后文件的路径：从 dist/src/image 向上回到 server/public
  private readonly imagesDir = path.join(__dirname, '../../../public/images')
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

      https.get(url, (response) => {
        clearTimeout(timeout)

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

  getRandomImages(count: number = 10): string[] {
    const allImages = this.getAllImages()
    const shuffled = allImages.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, allImages.length))
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
