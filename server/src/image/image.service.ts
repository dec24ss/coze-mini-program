import { Injectable, OnModuleInit } from '@nestjs/common';
import * as https from 'https';
import { getSupabaseClient } from '../storage/database/supabase-client';

// 100张高质量艺术风格图片URL（使用Lorem Picsum，最稳定可靠）
// 优化策略：使用更小的尺寸（900x1200），加快加载速度
// Lorem Picsum 优点：永不会404、固定尺寸、免费无限调用、响应速度快
// 使用 ID 100-199，确保图片存在且质量高
const PAINTING_URLS = [
  'https://picsum.photos/id/100/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/101/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/102/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/103/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/104/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/106/900/1200.jpg', // 建筑艺术（跳过105）
  'https://picsum.photos/id/107/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/108/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/109/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/110/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/111/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/112/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/113/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/114/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/115/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/116/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/117/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/118/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/119/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/120/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/121/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/122/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/123/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/124/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/125/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/126/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/127/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/128/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/129/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/130/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/131/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/132/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/133/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/134/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/135/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/136/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/137/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/138/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/139/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/140/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/141/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/142/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/143/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/144/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/145/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/146/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/147/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/148/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/149/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/150/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/151/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/152/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/153/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/154/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/155/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/156/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/157/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/158/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/159/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/160/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/161/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/162/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/163/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/164/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/165/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/166/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/167/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/168/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/169/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/170/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/171/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/172/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/173/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/174/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/175/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/176/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/177/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/178/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/179/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/180/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/181/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/182/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/183/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/184/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/185/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/186/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/187/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/188/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/189/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/190/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/191/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/192/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/193/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/194/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/195/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/196/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/197/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/198/900/1200.jpg', // 自然风光
  'https://picsum.photos/id/199/900/1200.jpg', // 自然风光
]

@Injectable()
export class ImageService implements OnModuleInit {
  private supabase = getSupabaseClient();
  private readonly bucketName = 'puzzle-images';

  async onModuleInit() {
    console.log('🖼️  图片服务已启动，将异步初始化 Supabase 存储...')
    // 异步初始化，不阻塞服务器启动
    setTimeout(() => {
      this.initializeSupabaseStorage().catch((error) => {
        console.error('❌ Supabase 存储初始化失败:', error)
      })
    }, 1000)
  }

  private async initializeSupabaseStorage(): Promise<void> {
    try {
      // 检查存储桶是否存在
      const { data: buckets, error } = await this.supabase.storage.listBuckets();
      if (error) {
        console.error('❌ 列出存储桶失败:', error)
        return;
      }

      // 检查是否存在 puzzle-images 存储桶
      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      if (!bucketExists) {
        // 创建存储桶
        const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true, // 公开访问
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5 * 1024 * 1024, // 5MB 限制
        });
        if (createError) {
          console.error('❌ 创建存储桶失败:', createError)
          return;
        }
        console.log('✅ 创建存储桶成功:', this.bucketName)
      } else {
        console.log('✅ 存储桶已存在:', this.bucketName)
      }

      // 异步下载并上传图片到 Supabase
      await this.uploadImagesToSupabase();
    } catch (error) {
      console.error('❌ Supabase 存储初始化失败:', error)
    }
  }

  private async uploadImagesToSupabase(): Promise<void> {
    const total = PAINTING_URLS.length
    console.log(`📥 开始上传 ${total} 张图片到 Supabase...`)
    let uploaded = 0
    let failed = 0

    // 限制并发上传数量为5
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

          try {
            // 检查文件是否已存在
            const { data: exists, error: checkError } = await this.supabase.storage
              .from(this.bucketName)
              .list('');
            
            if (checkError) {
              console.error(`❌ 检查文件 ${filename} 失败:`, checkError)
              failed++
              return
            }

            const fileExists = exists.some(file => file.name === filename)
            if (fileExists) {
              console.log(`⏭️  跳过已存在: ${filename} (${uploaded + failed + 1}/${total})`)
              uploaded++
              return
            }

            // 下载图片
            const imageBuffer = await this.downloadImage(url)
            
            // 上传到 Supabase
            const { error: uploadError } = await this.supabase.storage
              .from(this.bucketName)
              .upload(filename, imageBuffer, {
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) {
              console.error(`✗ 上传失败: ${filename} - ${uploadError.message}`)
              failed++
            } else {
              uploaded++
              console.log(`✓ 上传完成: ${filename} (${uploaded + failed}/${total})`)
            }
          } catch (error) {
            failed++
            console.error(`✗ 处理失败: ${filename} - ${(error as Error).message}`)
          }
        })
      )
    }

    console.log(`✅ 图片上传完成: 成功 ${uploaded}/${total}, 失败 ${failed}/${total}`)
  }

  private downloadImage(url: string): Promise<Buffer> {
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
            this.downloadImage(redirectUrl)
              .then(resolve)
              .catch(reject)
            return
          }
        }

        if (response.statusCode === 200) {
          const chunks: Buffer[] = []
          response.on('data', (chunk) => chunks.push(chunk))
          response.on('end', () => {
            resolve(Buffer.concat(chunks))
          })
          response.on('error', (err) => {
            reject(err)
          })
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`))
        }
      }).on('error', (err) => {
        clearTimeout(timeout)
        reject(err)
      })
    })
  }

  // 生成随机图片列表（每次返回不同的图片）
  // 优化：使用更小的尺寸（900x1200）加快加载速度
  getRandomImages(count: number = 100): string[] {
    // 使用固定的图片 ID 列表（100-199），这些 ID 都是有效的
    // 每次调用时打乱顺序，实现"随机"效果
    const imageIds = Array.from({ length: 100 }, (_, i) => 100 + i)

    // Fisher-Yates 洗牌算法
    for (let i = imageIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageIds[i], imageIds[j]] = [imageIds[j], imageIds[i]]
    }

    // 生成指定数量的随机图片 URL
    return Array.from({ length: count }, (_, i) => {
      const id = imageIds[i % imageIds.length]
      // 优先使用 Supabase 存储的图片
      try {
        // 获取 Supabase 图片 URL
        const { data } = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(`painting_${id - 100}.jpg`);
        if (data && data.publicUrl) {
          return data.publicUrl;
        }
      } catch (error) {
        console.error('❌ 获取 Supabase 图片 URL 失败:', error)
      }
      // 降级使用 Lorem Picsum
      return `https://picsum.photos/id/${id}/900/1200.jpg`
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

  async getAllImages(): Promise<string[]> {
    try {
      // 从 Supabase 获取图片列表
      const { data: files, error } = await this.supabase.storage
        .from(this.bucketName)
        .list('');

      if (error) {
        console.error('❌ 从 Supabase 获取图片列表失败:', error)
        // 降级使用原始 URL
        return PAINTING_URLS
      }

      // 生成 Supabase 图片 URL
      return files
        .filter(file => file.name.endsWith('.jpg'))
        .map(file => {
          const { data } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(file.name);
          return data?.publicUrl || `https://picsum.photos/id/${100 + parseInt(file.name.replace('painting_', '').replace('.jpg', ''))}/900/1200.jpg`
        })
    } catch (error) {
      console.error('❌ 获取图片列表失败:', error)
      // 降级使用原始 URL
      return PAINTING_URLS
    }
  }
}
