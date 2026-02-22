import { create } from 'zustand'

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
  isLoading: boolean             // 是否加载中

  // 计时相关
  startTime: number              // 开始时间戳
  elapsedTime: number            // 已用时间（秒）

  // 拼图数据
  pieces: PuzzlePiece[]          // 拼图碎片数组
  selectedPiece: PuzzlePiece | null  // 当前选中的碎片

  // 功能状态
  showHint: boolean              // 是否显示提示
  showOriginalImage: boolean     // 是否显示原图

  // 动作方法
  startGame: (level: number) => Promise<void>
  resetGame: () => void
  selectPiece: (piece: PuzzlePiece) => void
  movePiece: (piece: PuzzlePiece, targetX: number, targetY: number) => void
  updatePieceIndex: (pieceId: number, newIndex: number) => void
  swapPieces: (piece1: PuzzlePiece, piece2: PuzzlePiece) => void
  toggleHint: () => void
  toggleOriginalImage: () => void
  updateElapsedTime: () => void
  checkComplete: () => boolean
  loadNextLevel: () => Promise<void>
}

// 关卡配置生成器
function getLevelConfig(level: number): LevelConfig {
  let gridSize: number

  // 关卡难度规则：从 3×3 开始逐步升高
  if (level === 1) {
    gridSize = 3   // 第1关：3×3（简单）
  } else if (level === 2) {
    gridSize = 4   // 第2关：4×4
  } else if (level === 3) {
    gridSize = 5   // 第3关：5×5
  } else if (level === 4) {
    gridSize = 6   // 第4关：6×6
  } else if (level === 5) {
    gridSize = 7   // 第5关：7×7
  } else if (level === 6) {
    gridSize = 8   // 第6关：8×8
  } else if (level === 7) {
    gridSize = 9   // 第7关：9×9
  } else if (level === 8) {
    gridSize = 10  // 第8关：10×10
  } else if (level === 9) {
    gridSize = 11  // 第9关：11×11
  } else {
    gridSize = 12  // 第10关及以后：12×12（最高难度）
  }

  // 使用南湾湖风景图片（竖屏）- 增加分辨率以占满屏幕
  const nanwanLakeImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1440&fit=crop', // 山水风景
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&h=1440&fit=crop', // 湖泊风景
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1080&h=1440&fit=crop', // 自然风光
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&h=1440&fit=crop', // 山峦风景
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1080&h=1440&fit=crop'  // 草原风景
  ]

  // 根据关卡循环使用不同的图片
  const imageUrl = nanwanLakeImages[(level - 1) % nanwanLakeImages.length]

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
  isLoading: false,
  startTime: 0,
  elapsedTime: 0,
  pieces: [],
  selectedPiece: null,
  showHint: false,
  showOriginalImage: false,

  // 开始游戏
  startGame: async (level: number) => {
    const config = getLevelConfig(level)

    set({
      currentLevel: config.level,
      gridSize: config.gridSize,
      imageUrl: config.imageUrl,
      isPlaying: true,
      isComplete: false,
      isLoading: true,
      startTime: Date.now(),
      elapsedTime: 0,
      selectedPiece: null,
      showHint: false,
      showOriginalImage: false
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

      // 计算新的格子坐标（吸附到格子）
      const gridSize = Math.sqrt(newPieces.length)
      const pieceSize = 100 / gridSize

      // 更新 piece1 的坐标（吸附到它的新格子位置）
      const piece1NewRow = Math.floor(newPieces[piece1Index].currentIndex / gridSize)
      const piece1NewCol = newPieces[piece1Index].currentIndex % gridSize
      newPieces[piece1Index].x = piece1NewCol * pieceSize
      newPieces[piece1Index].y = piece1NewRow * pieceSize

      // 更新 piece2 的坐标（吸附到它的新格子位置）
      const piece2NewRow = Math.floor(newPieces[piece2Index].currentIndex / gridSize)
      const piece2NewCol = newPieces[piece2Index].currentIndex % gridSize
      newPieces[piece2Index].x = piece2NewCol * pieceSize
      newPieces[piece2Index].y = piece2NewRow * pieceSize

      console.log('swapPieces - 交换后：', {
        piece1: { id: piece1.id, currentIndex: newPieces[piece1Index].currentIndex, x: newPieces[piece1Index].x, y: newPieces[piece1Index].y },
        piece2: { id: piece2.id, currentIndex: newPieces[piece2Index].currentIndex, x: newPieces[piece2Index].x, y: newPieces[piece2Index].y }
      })

      return { pieces: newPieces }
    })
  },

  // 切换提示显示
  toggleHint: () => {
    set(state => ({ showHint: !state.showHint }))
  },

  // 切换原图显示
  toggleOriginalImage: () => {
    set(state => ({ showOriginalImage: !state.showOriginalImage }))
  },

  // 更新计时
  updateElapsedTime: () => {
    const { startTime, isPlaying, isComplete } = get()
    if (isPlaying && !isComplete) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      set({ elapsedTime: elapsed })
    }
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
    await get().startGame(currentLevel + 1)
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
