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

  // 关卡难度规则
  if (level === 1) {
    gridSize = 8   // 第1关：8×8
  } else if (level === 2) {
    gridSize = 10  // 第2关：10×10
  } else if (level === 3) {
    gridSize = 12  // 第3关：12×12
  } else {
    gridSize = 12  // 之后保持12×12
  }

  // 生成随机图片URL
  const imageUrl = `https://picsum.photos/800/800?random=${level}`

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
  gridSize: 8,
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

  // 交换碎片位置
  swapPieces: (piece1: PuzzlePiece, piece2: PuzzlePiece) => {
    set(state => {
      const newPieces = [...state.pieces]
      const piece1Index = newPieces.findIndex(p => p.id === piece1.id)
      const piece2Index = newPieces.findIndex(p => p.id === piece2.id)

      // 交换当前位置
      const tempIndex = newPieces[piece1Index].currentIndex
      newPieces[piece1Index].currentIndex = newPieces[piece2Index].currentIndex
      newPieces[piece2Index].currentIndex = tempIndex

      // 交换坐标
      const tempX = newPieces[piece1Index].x
      const tempY = newPieces[piece1Index].y
      newPieces[piece1Index].x = newPieces[piece2Index].x
      newPieces[piece1Index].y = newPieces[piece2Index].y
      newPieces[piece2Index].x = tempX
      newPieces[piece2Index].y = tempY

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
