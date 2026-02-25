import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

// 30张高质量艺术风格图片URL（使用Unsplash，稳定可靠）
const PAINTING_URLS = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578924679036-9c6589887646?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579789927302-5894700706f1?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1545989253-02cc26577f88?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577720643272-265f09367456?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783245133-3cb47169b9b5?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578320146475-872b7530a994?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584716544323-8c95380d6b16?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578320212374-9955323bcdf2?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783245133-3cb47169b9b5?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578320146475-872b7530a994?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578320212374-9955323bcdf2?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783245133-3cb47169b9b5?w=1200&h=1600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578320146475-872b7530a994?w=1200&h=1600&fit=crop&q=80'
]

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
