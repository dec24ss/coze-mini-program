import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

// 拼图碎片类型
export interface PuzzlePiece {
  id: number                    // 碎片唯一ID
  correctIndex: number           // 正确位置索引
  currentIndex: number           // 当前位置索引
  x: number                      // 当前X坐标
  y: number                      // 当前Y坐标
  imageSrc: string               // 碎片图片（canvas切割后的临时路径）
}

// 关卡配置
interface LevelConfig {
  level: number                  // 关卡编号
  gridSize: number               // 网格大小（8×8、10×10、12×12）
  imageUrl: string               // 原图URL
}

// 游戏状态
interface GameState {
  // 游戏基本信息
  currentLevel: number           // 当前关卡
  gridSize: number               // 当前网格大小
  imageUrl: string               // 当前图片URL
  isPlaying: boolean             // 是否正在游戏
  isComplete: boolean            // 是否完成拼图
  isFailed: boolean              // 是否失败
  isLoading: boolean             // 是否加载中
  isGameCompleted: boolean       // 是否通关（完成所有关卡）

  // 图片资源
  imageList: string[]            // 图片列表（预加载的30张图片）
  imagesLoaded: number           // 已加载的图片数量
  isImagesLoading: boolean       // 是否正在加载图片
  isImagesPreloaded: boolean     // 图片是否已预加载并缓存

  // 计时相关
  startTime: number              // 开始时间戳
  countdownTime: number          // 倒计时剩余时间（秒）
  isTimeFrozen: boolean          // 是否时间冻结
  freezeTimeRemaining: number    // 时间冻结剩余时间（秒）

  // 拼图数据
  pieces: PuzzlePiece[]          // 拼图碎片数组
  selectedPiece: PuzzlePiece | null  // 当前选中的碎片

  // 功能状态
  showHint: boolean              // 是否显示提示
  showOriginalImage: boolean     // 是否显示原图

  // 使用次数限制
  hintCount: number              // 提示使用次数（最多3次）
  originalImageCount: number     // 原图查看次数（最多3次）
  freezeCount: number            // 冻结时间使用次数（最多1次）

  // 动作方法
  preloadImages: () => Promise<void>
  startGame: (level: number) => Promise<void>
  resetGame: () => void
  restartGame: () => Promise<void>  // 重新开始游戏（重新加载图片）
  selectPiece: (piece: PuzzlePiece) => void
  movePiece: (piece: PuzzlePiece, targetX: number, targetY: number) => void
  updatePieceIndex: (pieceId: number, newIndex: number) => void
  swapPieces: (piece1: PuzzlePiece, piece2: PuzzlePiece) => void
  toggleHint: () => void
  toggleOriginalImage: () => void
  updateCountdown: () => void
  updateFreezeCountdown: () => void
  freezeTime: () => void
  checkComplete: () => boolean
  checkFailed: () => boolean
  loadNextLevel: () => Promise<void>
}

// 关卡配置生成器
function getLevelConfig(level: number, imageList: string[]): LevelConfig {
  let gridSize: number

  // 关卡难度规则：
  // 第1-3关：3×3
  // 第4-6关：4×4
  // 第7-9关：5×5
  // 第10关：6×6（最终挑战）
  if (level >= 1 && level <= 3) {
    gridSize = 3   // 第1-3关：3×3（入门）
  } else if (level >= 4 && level <= 6) {
    gridSize = 4   // 第4-6关：4×4（进阶）
  } else if (level >= 7 && level <= 9) {
    gridSize = 5   // 第7-9关：5×5（挑战）
  } else {
    gridSize = 6   // 第10关：6×6（最终挑战）
  }

  // 使用预加载的图片列表
  // 根据关卡循环使用不同的图片
  const imageUrl = imageList.length > 0
    ? imageList[(level - 1) % imageList.length]
    : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&h=1440&fit=crop&q=80' // 默认图片

  return {
    level,
    gridSize,
    imageUrl
  }
}

// 创建游戏store
export const useGameStore = create<GameState>((set, get) => ({
  // 初始状态
  currentLevel: 1,
  gridSize: 3,
  imageUrl: '',
  isPlaying: false,
  isComplete: false,
  isFailed: false,
  isLoading: false,
  isGameCompleted: false,
  imageList: [],
  imagesLoaded: 0,
  isImagesLoading: false,
  isImagesPreloaded: false,
  startTime: 0,
  countdownTime: 180,
  isTimeFrozen: false,
  freezeTimeRemaining: 0,
  pieces: [],
  selectedPiece: null,
  showHint: false,
  showOriginalImage: false,
  hintCount: 0,
  originalImageCount: 0,
  freezeCount: 0,

  // 预加载图片（使用 Taro.getImageInfo 真正缓存图片）
  preloadImages: async () => {
    set({ isImagesLoading: true, imagesLoaded: 0, imageList: [], isImagesPreloaded: false })

    try {
      // 从服务器获取随机图片列表
      console.log('🖼️  从服务器获取图片列表...')
      const response = await Network.request({
        url: '/api/images/random',
        method: 'GET'
      })

      if (response.data?.data?.images) {
        const serverImages = response.data.data.images
        console.log(`✅ 从服务器获取到 ${serverImages.length} 张图片`)

        const loadedImages: string[] = []
        let loadedCount = 0

        // 使用 Taro.getImageInfo 预加载每张图片（真正缓存到本地）
        const loadImagePromise = async (url: string, index: number): Promise<void> => {
          try {
            console.log(`📥 正在加载图片 ${index + 1}/${serverImages.length}: ${url.substring(0, 50)}...`)

            // 使用 Taro.getImageInfo 下载并缓存图片
            await Taro.getImageInfo({
              src: url
            })

            // 存储原始 URL（在小程序中可以直接使用，因为已被缓存）
            // 注意：不使用返回的 path，因为 backgroundImage 不支持本地路径
            loadedImages[index] = url
            loadedCount++
            set({ imagesLoaded: loadedCount })
            console.log(`✅ 图片 ${index + 1} 加载完成，已被缓存`)
          } catch (error) {
            console.error(`❌ 图片 ${index + 1} 加载失败:`, error)
            // 加载失败也继续，使用原始 URL
            loadedImages[index] = url
            loadedCount++
            set({ imagesLoaded: loadedCount })
          }
        }

        // 并行加载所有图片
        await Promise.all(serverImages.map((url, index) => loadImagePromise(url, index)))

        console.log(`✅ 所有图片加载完成，成功 ${loadedCount}/${serverImages.length}`)
        set({
          imageList: loadedImages,
          imagesLoaded: serverImages.length,
          isImagesLoading: false,
          isImagesPreloaded: true  // 标记图片已预加载完成
        })
      } else {
        throw new Error('服务器返回数据格式错误')
      }
    } catch (error) {
      console.error('❌ 获取图片列表失败:', error)
      // 失败时使用默认图片
      set({
        imageList: [],
        imagesLoaded: 0,
        isImagesLoading: false,
        isImagesPreloaded: false
      })
    }
  },

  // 开始游戏
  startGame: async (level: number) => {
    const { imageList } = get()
    const config = getLevelConfig(level, imageList)

    console.log('🎮 开始游戏，关卡:', config.level)
    console.log('🖼️  图片 URL:', config.imageUrl)
    console.log('📋 imageList 长度:', imageList.length)
    console.log('📋 imageList 第一张:', imageList[0]?.substring(0, 50) || '空')

    set({
      currentLevel: config.level,
      gridSize: config.gridSize,
      imageUrl: config.imageUrl,
      isPlaying: true,
      isComplete: false,
      isFailed: false,
      isLoading: true,
      startTime: Date.now(),
      countdownTime: 180,
      isTimeFrozen: false,
      freezeTimeRemaining: 0,
      selectedPiece: null,
      showHint: false,
      showOriginalImage: false,
      hintCount: 0,
      originalImageCount: 0,
      freezeCount: 0
    })

    // 生成拼图碎片
    await generatePieces(config.gridSize, config.imageUrl)

    set({ isLoading: false })
  },

  // 重置游戏
  resetGame: () => {
    const { currentLevel } = get()
    get().startGame(currentLevel)
  },

  // 选中碎片
  selectPiece: (piece: PuzzlePiece) => {
    set({ selectedPiece: piece })
  },

  // 移动碎片
  movePiece: (piece: PuzzlePiece, targetX: number, targetY: number) => {
    set(state => ({
      pieces: state.pieces.map(p =>
        p.id === piece.id
          ? { ...p, x: targetX, y: targetY }
          : p
      )
    }))
  },

  // 更新碎片索引
  updatePieceIndex: (pieceId: number, newIndex: number) => {
    set(state => ({
      pieces: state.pieces.map(p =>
        p.id === pieceId
          ? { ...p, currentIndex: newIndex }
          : p
      )
    }))
  },

  // 交换碎片位置
  swapPieces: (piece1: PuzzlePiece, piece2: PuzzlePiece) => {
    set(state => {
      const newPieces = [...state.pieces]
      const piece1Index = newPieces.findIndex(p => p.id === piece1.id)
      const piece2Index = newPieces.findIndex(p => p.id === piece2.id)

      console.log('swapPieces - 交换前：', {
        piece1: { id: piece1.id, currentIndex: newPieces[piece1Index].currentIndex, x: newPieces[piece1Index].x, y: newPieces[piece1Index].y },
        piece2: { id: piece2.id, currentIndex: newPieces[piece2Index].currentIndex, x: newPieces[piece2Index].x, y: newPieces[piece2Index].y }
      })

      // 交换当前位置索引
      const tempCurrentIndex = newPieces[piece1Index].currentIndex
      newPieces[piece1Index].currentIndex = newPieces[piece2Index].currentIndex
      newPieces[piece2Index].currentIndex = tempCurrentIndex

      // 计算新的格子坐标（精确吸附）
      const gridSize = Math.sqrt(newPieces.length)
      const pieceSize = 100 / gridSize

      // 更新 piece1 的坐标（吸附到它的新格子位置）
      const piece1NewRow = Math.floor(newPieces[piece1Index].currentIndex / gridSize)
      const piece1NewCol = newPieces[piece1Index].currentIndex % gridSize
      newPieces[piece1Index].x = Math.round(piece1NewCol * pieceSize * 100) / 100  // 保留2位小数
      newPieces[piece1Index].y = Math.round(piece1NewRow * pieceSize * 100) / 100  // 保留2位小数

      // 更新 piece2 的坐标（吸附到它的新格子位置）
      const piece2NewRow = Math.floor(newPieces[piece2Index].currentIndex / gridSize)
      const piece2NewCol = newPieces[piece2Index].currentIndex % gridSize
      newPieces[piece2Index].x = Math.round(piece2NewCol * pieceSize * 100) / 100  // 保留2位小数
      newPieces[piece2Index].y = Math.round(piece2NewRow * pieceSize * 100) / 100  // 保留2位小数

      console.log('swapPieces - 交换后：', {
        piece1: { id: piece1.id, currentIndex: newPieces[piece1Index].currentIndex, x: newPieces[piece1Index].x, y: newPieces[piece1Index].y },
        piece2: { id: piece2.id, currentIndex: newPieces[piece2Index].currentIndex, x: newPieces[piece2Index].x, y: newPieces[piece2Index].y }
      })

      return { pieces: newPieces }
    })
  },

  // 切换提示显示
  toggleHint: () => {
    set(state => {
      // 如果当前显示提示，则关闭
      if (state.showHint) {
        return { showHint: false }
      }
      // 如果未显示提示，检查使用次数
      if (state.hintCount >= 3) {
        return { showHint: false }
      }
      // 增加使用次数并显示提示
      return { showHint: true, hintCount: state.hintCount + 1 }
    })
  },

  // 切换原图显示
  toggleOriginalImage: () => {
    set(state => {
      // 如果当前显示原图，则关闭
      if (state.showOriginalImage) {
        return { showOriginalImage: false }
      }
      // 如果未显示原图，检查使用次数
      if (state.originalImageCount >= 3) {
        return { showOriginalImage: false }
      }
      // 增加使用次数并显示原图
      return { showOriginalImage: true, originalImageCount: state.originalImageCount + 1 }
    })
  },

  // 更新倒计时
  updateCountdown: () => {
    const { startTime, isPlaying, isComplete, isFailed, isTimeFrozen } = get()
    if (isPlaying && !isComplete && !isFailed && !isTimeFrozen) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, 180 - elapsed)  // 3分钟 = 180秒
      set({ countdownTime: remaining })
    }
  },

  // 更新冻结倒计时
  updateFreezeCountdown: () => {
    const { isTimeFrozen, freezeTimeRemaining } = get()
    if (isTimeFrozen && freezeTimeRemaining > 0) {
      set({ freezeTimeRemaining: freezeTimeRemaining - 1 })
    }
  },

  // 冻结时间
  freezeTime: () => {
    const { isTimeFrozen, freezeTimeRemaining, freezeCount } = get()
    if (!isTimeFrozen && freezeTimeRemaining <= 0 && freezeCount < 1) {
      set({ isTimeFrozen: true, freezeTimeRemaining: 30, freezeCount: 1 })
    }
  },

  // 检查是否失败
  checkFailed: () => {
    const { countdownTime, isPlaying, isComplete } = get()
    if (isPlaying && !isComplete && countdownTime <= 0) {
      set({ isFailed: true, isPlaying: false })
      return true
    }
    return false
  },

  // 检查是否完成
  checkComplete: () => {
    const { pieces } = get()
    const isComplete = pieces.every(piece => piece.currentIndex === piece.correctIndex)
    set({ isComplete })
    return isComplete
  },

  // 进入下一关
  loadNextLevel: async () => {
    const { currentLevel } = get()

    // 检查是否完成第10关（通关）
    if (currentLevel >= 10) {
      console.log('🎉 恭喜通关！')
      set({ isGameCompleted: true, isComplete: false })
    } else {
      await get().startGame(currentLevel + 1)
    }
  },

  // 重新开始游戏（重新加载新图片）
  restartGame: async () => {
    console.log('🔄 重新开始游戏，重新加载图片...')

    // 清空当前游戏状态
    set({
      currentLevel: 1,
      gridSize: 3,
      imageUrl: '',
      isPlaying: false,
      isComplete: false,
      isFailed: false,
      isLoading: false,
      isGameCompleted: false,
      pieces: [],
      selectedPiece: null,
      showHint: false,
      showOriginalImage: false,
      hintCount: 0,
      originalImageCount: 0,
      freezeCount: 0,
      startTime: 0,
      countdownTime: 180,
      isTimeFrozen: false,
      freezeTimeRemaining: 0
    })

    // 重新加载新图片
    await get().preloadImages()

    // 开始第一关
    await get().startGame(1)
  }
}))

// 生成拼图碎片
async function generatePieces(gridSize: number, imageUrl: string): Promise<void> {
  const pieceSize = 100 / gridSize  // 每个碎片的大小（百分比）

  // 生成碎片数组
  const pieces: PuzzlePiece[] = []
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const correctIndex = row * gridSize + col
      pieces.push({
        id: correctIndex,
        correctIndex,
        currentIndex: correctIndex,
        x: col * pieceSize,
        y: row * pieceSize,
        imageSrc: imageUrl  // 临时使用原图，后续用canvas切割
      })
    }
  }

  // 打乱碎片位置
  const shuffledPieces = shuffleArray([...pieces])

  // 更新碎片的当前位置和坐标
  shuffledPieces.forEach((piece, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    piece.currentIndex = index
    piece.x = col * pieceSize
    piece.y = row * pieceSize
  })

  useGameStore.setState({ pieces: shuffledPieces })
}

// 打乱数组（Fisher-Yates算法）
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
