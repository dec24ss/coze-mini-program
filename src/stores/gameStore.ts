import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

// 拼图碎片类型
export interface PuzzlePiece {
  id: number
  correctIndex: number
  currentIndex: number
  x: number
  y: number
  imageSrc: string
}

// 关卡配置
interface LevelConfig {
  level: number
  gridSize: number
  imageUrl: string
}

// 游戏状态
interface GameState {
  // 游戏基本信息
  currentLevel: number
  gridSize: number
  imageUrl: string
  isPlaying: boolean
  isComplete: boolean
  isFailed: boolean
  isLoading: boolean
  isGameCompleted: boolean
  isFreePlayMode: boolean

  // 图片资源
  imageList: string[]
  imagePaths: string[]
  imagesLoaded: number
  isImagesLoading: boolean
  isImagesPreloaded: boolean
  levelImageMap: Record<number, { url: string; path: string }>

  // 计时相关
  startTime: number
  countdownTime: number
  initialCountdownTime: number
  isTimeFrozen: boolean
  freezeTimeRemaining: number
  totalTimeSpent: number
  levelStartTime: number

  // 拼图数据
  pieces: PuzzlePiece[]
  selectedPiece: PuzzlePiece | null

  // 功能状态
  showHint: boolean
  showOriginalImage: boolean

  // 使用次数限制
  hintCount: number
  originalImageCount: number
  freezeCount: number

  // 动作方法
  preloadImages: () => Promise<void>
  startGame: (level: number) => Promise<void>
  resetGame: () => void
  restartGame: () => Promise<void>
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
  startFreePlayMode: (level: number) => Promise<void>
  getLevelConfig: (level: number) => { level: number; gridSize: number; imageUrl: string }
}

// 关卡配置生成器
function getLevelConfig(level: number, imageList: string[], levelImageMap: Record<number, { url: string; path: string }>): LevelConfig {
  let gridSize: number

  if (level >= 1 && level <= 3) {
    gridSize = 3
  } else if (level >= 4 && level <= 6) {
    gridSize = 4
  } else if (level >= 7 && level <= 9) {
    gridSize = 5
  } else {
    gridSize = 6
  }

  let imageUrl: string
  if (levelImageMap[level]) {
    imageUrl = levelImageMap[level].path
  } else {
    imageUrl = imageList.length > 0
      ? imageList[(level - 1) % imageList.length]
      : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&h=1440&fit=crop&q=80'
  }

  return {
    level,
    gridSize,
    imageUrl
  }
}

// 生成拼图碎片
async function generatePieces(gridSize: number, imageUrl: string): Promise<void> {
  const pieceSize = 100 / gridSize

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
        imageSrc: imageUrl
      })
    }
  }

  const shuffledPieces = shuffleArray([...pieces])

  shuffledPieces.forEach((piece, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    piece.currentIndex = index
    piece.x = col * pieceSize
    piece.y = row * pieceSize
  })

  useGameStore.setState({ pieces: shuffledPieces })
}

// 打乱数组
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
  isFreePlayMode: false,
  imageList: [],
  imagePaths: [],
  imagesLoaded: 0,
  isImagesLoading: false,
  isImagesPreloaded: false,
  levelImageMap: {},
  startTime: 0,
  countdownTime: 180,
  initialCountdownTime: 180,
  isTimeFrozen: false,
  freezeTimeRemaining: 0,
  totalTimeSpent: 0,
  levelStartTime: 0,
  pieces: [],
  selectedPiece: null,
  showHint: false,
  showOriginalImage: false,
  hintCount: 0,
  originalImageCount: 0,
  freezeCount: 0,

  // 预加载图片
  preloadImages: async () => {
    set({ isImagesLoading: true, imagesLoaded: 0, imageList: [], isImagesPreloaded: false })

    try {
      const response = await Network.request({
        url: '/api/images/random',
        method: 'GET'
      })

      if (response.data?.data?.images) {
        const serverImages = response.data.data.images
        const loadedImages: string[] = []
        const loadedPaths: string[] = []
        let loadedCount = 0

        const loadImagePromise = async (url: string, index: number): Promise<void> => {
          try {
            const res = await Taro.getImageInfo({ src: url })
            loadedImages[index] = url
            loadedPaths[index] = res.path
            loadedCount++
            set({ imagesLoaded: loadedCount })
          } catch (error) {
            console.error(`图片 ${index + 1} 加载失败:`, error)
            loadedImages[index] = url
            loadedPaths[index] = url
            loadedCount++
            set({ imagesLoaded: loadedCount })
          }
        }

        await Promise.all(serverImages.map((url, index) => loadImagePromise(url, index)))

        const levelImageMap: Record<number, { url: string; path: string }> = {}
        for (let i = 0; i < 10; i++) {
          const imageIndex = i % loadedImages.length
          levelImageMap[i + 1] = {
            url: loadedImages[imageIndex],
            path: loadedPaths[imageIndex]
          }
        }

        set({
          imageList: loadedImages,
          imagePaths: loadedPaths,
          imagesLoaded: serverImages.length,
          isImagesLoading: false,
          isImagesPreloaded: true,
          levelImageMap
        })
      } else {
        throw new Error('服务器返回数据格式错误')
      }
    } catch (error) {
      console.error('获取图片列表失败:', error)
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
    const { imageList, levelImageMap } = get()
    const config = getLevelConfig(level, imageList, levelImageMap)

    let countdownTime = 180
    if (config.level >= 1 && config.level <= 3) {
      countdownTime = 30
    } else if (config.level >= 4 && config.level <= 6) {
      countdownTime = 60
    } else if (config.level >= 7 && config.level <= 9) {
      countdownTime = 90
    } else {
      countdownTime = 180
    }

    set({
      currentLevel: config.level,
      gridSize: config.gridSize,
      imageUrl: config.imageUrl,
      isPlaying: true,
      isComplete: false,
      isFailed: false,
      isLoading: true,
      startTime: Date.now(),
      countdownTime,
      initialCountdownTime: countdownTime,
      isTimeFrozen: false,
      freezeTimeRemaining: 0,
      selectedPiece: null,
      showHint: false,
      showOriginalImage: false,
      hintCount: 0,
      originalImageCount: 0,
      freezeCount: 0,
      levelStartTime: Date.now()
    })

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
        p.id === piece.id ? { ...p, x: targetX, y: targetY } : p
      )
    }))
  },

  // 更新碎片索引
  updatePieceIndex: (pieceId: number, newIndex: number) => {
    set(state => ({
      pieces: state.pieces.map(p =>
        p.id === pieceId ? { ...p, currentIndex: newIndex } : p
      )
    }))
  },

  // 交换碎片
  swapPieces: (piece1: PuzzlePiece, piece2: PuzzlePiece) => {
    set(state => {
      const newPieces = [...state.pieces]
      const piece1Index = newPieces.findIndex(p => p.id === piece1.id)
      const piece2Index = newPieces.findIndex(p => p.id === piece2.id)

      const tempCurrentIndex = newPieces[piece1Index].currentIndex
      newPieces[piece1Index].currentIndex = newPieces[piece2Index].currentIndex
      newPieces[piece2Index].currentIndex = tempCurrentIndex

      const gridSize = Math.sqrt(newPieces.length)
      const pieceSize = 100 / gridSize

      const piece1NewRow = Math.floor(newPieces[piece1Index].currentIndex / gridSize)
      const piece1NewCol = newPieces[piece1Index].currentIndex % gridSize
      newPieces[piece1Index].x = Math.round(piece1NewCol * pieceSize * 100) / 100
      newPieces[piece1Index].y = Math.round(piece1NewRow * pieceSize * 100) / 100

      const piece2NewRow = Math.floor(newPieces[piece2Index].currentIndex / gridSize)
      const piece2NewCol = newPieces[piece2Index].currentIndex % gridSize
      newPieces[piece2Index].x = Math.round(piece2NewCol * pieceSize * 100) / 100
      newPieces[piece2Index].y = Math.round(piece2NewRow * pieceSize * 100) / 100

      return { pieces: newPieces }
    })
  },

  // 切换提示
  toggleHint: () => {
    set(state => {
      if (state.showHint) {
        return { showHint: false }
      }
      if (state.hintCount >= 3) {
        return { showHint: false }
      }
      return { showHint: true, hintCount: state.hintCount + 1 }
    })
  },

  // 切换原图
  toggleOriginalImage: () => {
    set(state => {
      if (state.showOriginalImage) {
        return { showOriginalImage: false }
      }
      if (state.originalImageCount >= 3) {
        return { showOriginalImage: false }
      }
      return { showOriginalImage: true, originalImageCount: state.originalImageCount + 1 }
    })
  },

  // 更新倒计时
  updateCountdown: () => {
    const { startTime, isPlaying, isComplete, isFailed, isTimeFrozen, isFreePlayMode, initialCountdownTime } = get()
    if (!isFreePlayMode && isPlaying && !isComplete && !isFailed && !isTimeFrozen) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, initialCountdownTime - elapsed)
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
    const { currentLevel, levelStartTime, totalTimeSpent } = get()

    const currentTime = Date.now()
    const timeSpentThisLevel = Math.floor((currentTime - levelStartTime) / 1000)
    const newTotalTimeSpent = totalTimeSpent + timeSpentThisLevel

    set({ totalTimeSpent: newTotalTimeSpent })

    if (currentLevel >= 10) {
      set({ isGameCompleted: true, isComplete: false })
    } else {
      await get().startGame(currentLevel + 1)
    }
  },

  // 自由游玩模式
  startFreePlayMode: async (level: number) => {
    const { imageList, levelImageMap } = get()
    const config = getLevelConfig(level, imageList, levelImageMap)

    let imageUrl: string
    if (levelImageMap[level]) {
      imageUrl = levelImageMap[level].path
    } else {
      imageUrl = imageList.length > 0
        ? imageList[(level - 1) % imageList.length]
        : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&h=1440&fit=crop&q=80'
    }

    set({
      currentLevel: config.level,
      gridSize: config.gridSize,
      imageUrl,
      isPlaying: true,
      isComplete: false,
      isFailed: false,
      isLoading: true,
      isFreePlayMode: true,
      startTime: Date.now(),
      countdownTime: 9999,
      initialCountdownTime: 9999,
      isTimeFrozen: false,
      freezeTimeRemaining: 0,
      selectedPiece: null,
      showHint: false,
      showOriginalImage: false,
      hintCount: 0,
      originalImageCount: 0,
      freezeCount: 0,
      levelStartTime: Date.now()
    })

    await generatePieces(config.gridSize, imageUrl)
    set({ isLoading: false })
  },

  // 重新开始游戏
  restartGame: async () => {
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
      initialCountdownTime: 180,
      isTimeFrozen: false,
      freezeTimeRemaining: 0,
      totalTimeSpent: 0,
      levelStartTime: 0,
      levelImageMap: {}
    })

    await get().preloadImages()
    await get().startGame(1)
  },

  // 获取关卡配置
  getLevelConfig: (level: number) => {
    const { imageList, levelImageMap } = get()
    let gridSize: number

    if (level >= 1 && level <= 3) {
      gridSize = 3
    } else if (level >= 4 && level <= 6) {
      gridSize = 4
    } else if (level >= 7 && level <= 9) {
      gridSize = 5
    } else {
      gridSize = 6
    }

    let imageUrl: string
    if (levelImageMap[level]) {
      imageUrl = levelImageMap[level].path
    } else {
      imageUrl = imageList.length > 0
        ? imageList[(level - 1) % imageList.length]
        : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&h=1440&fit=crop&q=80'
    }

    return {
      level,
      gridSize,
      imageUrl
    }
  }
}))
