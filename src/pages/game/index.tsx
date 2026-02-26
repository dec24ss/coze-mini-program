import { View, Text, Image } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { ChevronLeft, Lightbulb, Image as ImageIcon, Snowflake, Download, RotateCcw, Play, Trophy, Clock, Sparkles } from 'lucide-react'
import { Network } from '@/network'
import { useGameStore } from '@/stores/gameStore'
import { playSound } from '@/utils/sound'
import './index.css'

// 装饰星星组件
const StarDecoration = ({ delay = 0, top, left, size = 'small' }: { delay?: number; top: string; left: string; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClass = size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
  const delayClass = delay === 0 ? '' : delay === 1 ? 'delay-300' : 'delay-700'

  return (
    <View
      className={`absolute rounded-full bg-amber-200 animate-twinkle ${sizeClass} ${delayClass}`}
      style={{ top, left, boxShadow: '0 0 10px rgba(232, 184, 109, 0.8)' }}
    />
  )
}

// 粒子效果组件
const ParticleEffect = ({ show }: { show: boolean }) => {
  if (!show) return null

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (360 / 20) * i,
    distance: 50 + Math.random() * 50,
    delay: Math.random() * 0.5,
  }))

  return (
    <View className="particle-container">
      {particles.map((p) => (
        <View
          key={p.id}
          className="particle"
          style={{
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            animationDelay: `${p.delay}s`,
          } as any}
        />
      ))}
    </View>
  )
}

export default function GamePage() {
  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  const {
    currentLevel,
    gridSize,
    imageUrl,
    isPlaying,
    isComplete,
    isFailed,
    isLoading,
    isGameCompleted,
    countdownTime,
    totalTimeSpent,
    isFreePlayMode,
    isTimeFrozen,
    freezeTimeRemaining,
    pieces,
    showHint,
    showOriginalImage,
    hintCount,
    originalImageCount,
    freezeCount,
    startGame,
    movePiece,
    updatePieceIndex,
    swapPieces,
    toggleHint,
    toggleOriginalImage,
    updateCountdown,
    updateFreezeCountdown,
    freezeTime,
    checkComplete,
    checkFailed,
    loadNextLevel
  } = useGameStore()

  const [draggingPiece, setDraggingPiece] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })
  const [isImageLoaded, setIsImageLoaded] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const countdownRef = useRef<ReturnType<typeof setInterval>>()
  const isMountedRef = useRef(false)

  // 获取容器位置信息
  const getContainerRect = (): Promise<{ left: number; top: number; width: number; height: number } | null> => {
    return new Promise((resolve) => {
      const query = Taro.createSelectorQuery()
      query.select('.puzzle-board').boundingClientRect()
      query.exec((res) => {
        if (res && res[0]) {
          resolve({
            left: res[0].left,
            top: res[0].top,
            width: res[0].width,
            height: res[0].height
          })
        } else {
          resolve(null)
        }
      })
    })
  }

  // 组件挂载
  useEffect(() => {
    isMountedRef.current = true
    setTimeout(() => setShowContent(true), 100)

    setTimeout(() => {
      getContainerRect().then((rect) => {
        if (rect) setContainerRect(rect)
      })
    }, 100)

    return () => {
      isMountedRef.current = false
    }
  }, [isWeapp])

  // 监听图片 URL 变化
  useEffect(() => {
    if (imageUrl) {
      if (imageUrl.startsWith('data:image') || imageUrl.startsWith('wxfile://') || imageUrl.startsWith('/')) {
        setIsImageLoaded(true)
      } else {
        setIsImageLoaded(false)
        setTimeout(() => setIsImageLoaded(true), 100)
      }
    }
  }, [imageUrl])

  // 页面加载时开始游戏
  useEffect(() => {
    const initGame = async () => {
      const { isImagesPreloaded, levelImageMap, preloadImages } = useGameStore.getState()

      if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
        await preloadImages()
      }

      startGame(1)
    }

    initGame()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [startGame])

  // 计时器
  useEffect(() => {
    if (isPlaying && !isComplete && !isFailed) {
      countdownRef.current = setInterval(() => {
        updateCountdown()
        checkFailed()
      }, 1000)
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = undefined
      }
    }
  }, [isPlaying, isComplete, isFailed, checkFailed, updateCountdown])

  // 时间冻结倒计时
  useEffect(() => {
    if (isTimeFrozen && freezeTimeRemaining > 0) {
      const freezeTimer = setInterval(() => {
        updateFreezeCountdown()
      }, 1000)
      return () => clearInterval(freezeTimer)
    }
  }, [isTimeFrozen, freezeTimeRemaining, updateFreezeCountdown])

  // 原图查看定时器
  useEffect(() => {
    if (showOriginalImage) {
      timerRef.current = setTimeout(() => {
        toggleOriginalImage()
        Taro.showToast({ title: '原图查看时间已到', icon: 'none' })
      }, 10000)
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [showOriginalImage, toggleOriginalImage])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 返回首页
  const handleBackHome = () => {
    playSound('click')
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  // 提示功能
  const handleHint = () => {
    if (hintCount >= 3) {
      Taro.showToast({ title: '提示次数已用完', icon: 'none' })
      return
    }
    playSound('click')
    toggleHint()
  }

  // 原图查看
  const handleToggleOriginal = () => {
    if (originalImageCount >= 3 && !showOriginalImage) {
      Taro.showToast({ title: '原图查看次数已用完', icon: 'none' })
      return
    }
    playSound('click')
    toggleOriginalImage()
  }

  // 冻结时间
  const handleFreezeTime = () => {
    if (freezeCount >= 1) {
      Taro.showToast({ title: '冻结次数已用完', icon: 'none' })
      return
    }
    playSound('click')
    freezeTime()
  }

  // 重新开始当前关卡
  const handleRestart = () => {
    playSound('click')
    startGame(currentLevel)
  }

  // 下一关
  const handleNextLevel = () => {
    playSound('click')
    loadNextLevel()
  }

  // 通关后重新开始游戏
  const handleRestartAll = () => {
    playSound('click')
    Taro.setStorageSync('totalTimeSpent', totalTimeSpent.toString())
    Taro.navigateTo({ url: '/pages/level-select/index' })
  }

  // 下载原图到相册
  const handleDownloadImage = async () => {
    if (!isWeapp) {
      Taro.showToast({ title: '仅小程序支持保存图片', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '保存中...' })

      const authResult = await Taro.authorize({
        scope: 'scope.writePhotosAlbum'
      }).catch(() => null)

      if (authResult === null) {
        Taro.hideLoading()
        return
      }

      let filePath: string

      if (imageUrl.startsWith('wxfile://')) {
        filePath = imageUrl
      } else if (imageUrl.startsWith('data:image')) {
        const downloadRes = await Network.downloadFile({ url: imageUrl })
        if (!downloadRes.tempFilePath) throw new Error('Base64 图片下载失败')
        filePath = downloadRes.tempFilePath
      } else if (imageUrl.startsWith('http')) {
        const downloadRes = await Network.downloadFile({ url: imageUrl })
        if (!downloadRes.tempFilePath) throw new Error('网络图片下载失败')
        filePath = downloadRes.tempFilePath
      } else {
        throw new Error('不支持的图片路径格式')
      }

      await Taro.saveImageToPhotosAlbum({ filePath })

      Taro.hideLoading()
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
    }
  }

  // 获取需要交换的两个图块
  const getNextSwapPieces = () => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces.find(p => p.currentIndex === i)
      if (piece && piece.correctIndex !== i) {
        const targetPiece = pieces.find(p => p.currentIndex === piece.correctIndex)
        if (targetPiece && targetPiece.id !== piece.id) {
          return { piece1: piece, piece2: targetPiece }
        }
      }
    }
    return null
  }

  // 开始拖拽
  const handleTouchStart = async (e: any, piece: any) => {
    e.stopPropagation()
    e.preventDefault()
    if (isComplete || showOriginalImage) return

    // const touch = e.touches ? e.touches[0] : e.detail.touches[0]
    const rect = await getContainerRect()

    if (!rect) return

    const pieceSize = rect.width / gridSize

    setContainerRect(rect)
    setDraggingPiece(piece)
    setDragOffset({ x: pieceSize / 2, y: pieceSize / 2 })

    playSound('drag')
  }

  // 拖拽移动
  const handleTouchMove = (_e: any) => {
    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage || containerRect.width === 0) return

    const touch = _e.touches ? _e.touches[0] : _e.detail.touches[0]
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    let newX = touch.clientX - containerRect.left - dragOffset.x
    let newY = touch.clientY - containerRect.top - dragOffset.y

    const pieceSizePercent = 100 / gridSize
    const maxXPercent = 100 - pieceSizePercent
    const maxYPercent = 100 - pieceSizePercent

    let newXPercent = (newX / containerWidth) * 100
    let newYPercent = (newY / containerHeight) * 100

    newXPercent = Math.max(0, Math.min(newXPercent, maxXPercent))
    newYPercent = Math.max(0, Math.min(newYPercent, maxYPercent))

    movePiece(draggingPiece, newXPercent, newYPercent)
    setDraggingPiece((prev: any) => ({ ...prev, x: newXPercent, y: newYPercent }))
  }

  // 结束拖拽
  const handleTouchEnd = (_e: any) => {
    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage) {
      setDraggingPiece(null)
      return
    }

    const latestDraggingPiece = pieces.find(p => p.id === draggingPiece.id)
    if (!latestDraggingPiece) {
      setDraggingPiece(null)
      setDragOffset({ x: 0, y: 0 })
      return
    }

    const pieceSize = 100 / gridSize
    const targetCol = Math.round(latestDraggingPiece.x / pieceSize)
    const targetRow = Math.round(latestDraggingPiece.y / pieceSize)

    const clampedCol = Math.max(0, Math.min(targetCol, gridSize - 1))
    const clampedRow = Math.max(0, Math.min(targetRow, gridSize - 1))
    const clampedTargetIndex = clampedRow * gridSize + clampedCol

    const snapX = clampedCol * pieceSize
    const snapY = clampedRow * pieceSize

    const targetPiece = pieces.find(p => p.currentIndex === clampedTargetIndex && p.id !== latestDraggingPiece.id)

    if (targetPiece) {
      swapPieces(latestDraggingPiece, targetPiece)
      playSound('swap')
      if (showHint) {
        setTimeout(() => toggleHint(), 100)
      }
    } else {
      movePiece(latestDraggingPiece, snapX, snapY)
      updatePieceIndex(latestDraggingPiece.id, clampedTargetIndex)
    }

    setDraggingPiece(null)
    setDragOffset({ x: 0, y: 0 })

    setTimeout(() => {
      const complete = checkComplete()
      if (complete) {
        setShowParticles(true)
        playSound('win')
        if (isWeapp) Taro.vibrateShort()
        setTimeout(() => setShowParticles(false), 2000)
      } else {
        playSound('correct')
      }
    }, 200)
  }

  // 判断是否倒计时警告
  const isCountdownWarning = countdownTime <= 10 && !isFreePlayMode

  if (isLoading) {
    return (
      <View className="game-page">
        <View className="game-loading">
          <View className="game-loading-ring" />
          <Text className="block game-loading-text">加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={`game-page ${showContent ? 'game-page-active' : ''}`}>
      {/* 背景装饰星星 */}
      <StarDecoration top="5%" left="10%" delay={0} size="small" />
      <StarDecoration top="12%" left="88%" delay={1} size="medium" />
      <StarDecoration top="25%" left="5%" delay={2} size="small" />
      <StarDecoration top="50%" left="92%" delay={0} size="large" />
      <StarDecoration top="70%" left="8%" delay={1} size="medium" />
      <StarDecoration top="88%" left="85%" delay={2} size="small" />

      {/* 顶部信息栏 */}
      <View className="game-header">
        <View className="game-header-back" onClick={handleBackHome}>
          <ChevronLeft size={22} color="rgba(245, 245, 240, 0.8)" />
        </View>

        <View className="game-header-center">
          <View className="game-level-badge">
            <Sparkles size={14} color="#e8b86d" />
            <Text className="block game-level-text">第 {currentLevel} 关</Text>
          </View>

          {isFreePlayMode ? (
            <View className="game-mode-badge free">
              <Text className="block game-mode-text">自由模式</Text>
            </View>
          ) : (
            <View className={`game-timer-badge ${isCountdownWarning ? 'warning' : ''} ${isTimeFrozen ? 'frozen' : ''}`}>
              <Clock size={14} color={isCountdownWarning ? '#f87171' : isTimeFrozen ? '#60a5fa' : '#e8b86d'} />
              <Text className="block game-timer-text">
                {formatTime(countdownTime)}
              </Text>
            </View>
          )}
        </View>

        {/* 占位保持居中 */}
        <View className="w-10" />
      </View>

      {/* 拼图区域 */}
      <View className="game-board-container">
        {showOriginalImage ? (
          <View className="original-image-wrapper">
            <View className="original-image-header">
              <Text className="block original-image-title">原图预览</Text>
              <Text className="block original-image-hint">10秒后自动关闭</Text>
            </View>
            <View className="original-image-frame">
              <Image
                className="original-image"
                src={imageUrl}
                mode="aspectFill"
              />
            </View>
          </View>
        ) : (
          <View className="puzzle-wrapper">
            {/* 图片加载动画 */}
            {!isImageLoaded && (
              <View className="puzzle-loading">
                <View className="puzzle-loading-ring" />
                <Text className="block puzzle-loading-text">图片加载中...</Text>
              </View>
            )}

            <View
              className="puzzle-board"
              style={{ opacity: isImageLoaded ? 1 : 0 }}
            >
              <View className="puzzle-grid">
                {pieces.map((piece) => {
                  const pieceSize = 100 / gridSize

                  const rightPos = piece.currentIndex + 1
                  const isRightSameRow = Math.floor(piece.currentIndex / gridSize) === Math.floor(rightPos / gridSize)
                  const rightNeighbor = isRightSameRow ? pieces.find(p => p.currentIndex === rightPos) : null
                  const isRightNeighborCorrectRelationship = rightNeighbor?.correctIndex === rightPos && piece.correctIndex === rightPos - 1

                  const leftPos = piece.currentIndex - 1
                  const isLeftSameRow = Math.floor(piece.currentIndex / gridSize) === Math.floor(leftPos / gridSize)
                  const leftNeighbor = isLeftSameRow && leftPos >= 0 ? pieces.find(p => p.currentIndex === leftPos) : null
                  const isLeftNeighborCorrectRelationship = leftNeighbor?.correctIndex === leftPos && piece.correctIndex === leftPos + 1

                  const topPos = piece.currentIndex - gridSize
                  const topNeighbor = topPos >= 0 ? pieces.find(p => p.currentIndex === topPos) : null
                  const isTopNeighborCorrectRelationship = topNeighbor?.correctIndex === topPos && piece.correctIndex === topPos + gridSize

                  const bottomPos = piece.currentIndex + gridSize
                  const bottomNeighbor = pieces.find(p => p.currentIndex === bottomPos)
                  const isBottomNeighborCorrectRelationship = bottomNeighbor?.correctIndex === bottomPos && piece.correctIndex === bottomPos - gridSize

                  const outerBorderStyle: any = {}
                  if (!isTopNeighborCorrectRelationship) outerBorderStyle.borderTop = '1px solid rgba(0, 0, 0, 0.6)'
                  if (!isLeftNeighborCorrectRelationship) outerBorderStyle.borderLeft = '1px solid rgba(0, 0, 0, 0.6)'
                  if (!isBottomNeighborCorrectRelationship) outerBorderStyle.borderBottom = '1px solid rgba(0, 0, 0, 0.6)'
                  if (!isRightNeighborCorrectRelationship) outerBorderStyle.borderRight = '1px solid rgba(0, 0, 0, 0.6)'

                  const innerBorderStyle: any = {}
                  if (!isTopNeighborCorrectRelationship) innerBorderStyle.borderTop = '1px solid rgba(255, 255, 255, 0.8)'
                  if (!isLeftNeighborCorrectRelationship) innerBorderStyle.borderLeft = '1px solid rgba(255, 255, 255, 0.8)'
                  if (!isBottomNeighborCorrectRelationship) innerBorderStyle.borderBottom = '1px solid rgba(255, 255, 255, 0.8)'
                  if (!isRightNeighborCorrectRelationship) innerBorderStyle.borderRight = '1px solid rgba(255, 255, 255, 0.8)'

                  return (
                    <View
                      key={piece.id}
                      className={`puzzle-piece-outer ${piece.id === draggingPiece?.id ? 'dragging' : ''}`}
                      style={{
                        width: `${pieceSize}%`,
                        height: `${pieceSize}%`,
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        ...outerBorderStyle,
                      }}
                      onTouchStart={(e) => handleTouchStart(e, piece)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <View
                        className="puzzle-piece-inner"
                        style={{
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          ...innerBorderStyle,
                        }}
                      >
                        <Image
                          src={imageUrl}
                          mode="aspectFill"
                          style={{
                            width: `${gridSize * 100}%`,
                            height: `${gridSize * 100}%`,
                            position: 'absolute',
                            left: `-${(piece.correctIndex % gridSize) * 100}%`,
                            top: `-${Math.floor(piece.correctIndex / gridSize) * 100}%`,
                          }}
                        />
                      </View>
                    </View>
                  )
                })}
              </View>

              {/* 提示层 */}
              {showHint && (
                <View className="hint-overlay">
                  {pieces.map((piece) => {
                    const nextSwapPieces = getNextSwapPieces()
                    const isPiece1Hint = nextSwapPieces?.piece1?.id === piece.id
                    const isPiece2Hint = nextSwapPieces?.piece2?.id === piece.id
                    const isCorrect = piece.correctIndex === piece.currentIndex

                    const currentX = draggingPiece?.id === piece.id ? draggingPiece.x : piece.x
                    const currentY = draggingPiece?.id === piece.id ? draggingPiece.y : piece.y

                    return (
                      <View
                        key={piece.id}
                        className={`hint-cell ${isCorrect ? 'correct' : ''} ${isPiece1Hint || isPiece2Hint ? 'swap-hint' : ''}`}
                        style={{
                          width: `${100 / gridSize}%`,
                          height: `${100 / gridSize}%`,
                          left: `${currentX}%`,
                          top: `${currentY}%`
                        }}
                      />
                    )
                  })}
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* 底部功能按钮 */}
      <View className="game-footer">
        <View className="game-tools">
          {/* 提示按钮 */}
          <View
            className={`game-tool-btn ${hintCount >= 3 ? 'used' : ''}`}
            onClick={handleHint}
          >
            <View className="game-tool-icon">
              <Lightbulb size={20} color={hintCount >= 3 ? '#9ca3af' : '#e8b86d'} />
            </View>
            <Text className="block game-tool-text">提示</Text>
            <Text className="block game-tool-count">{hintCount}/3</Text>
          </View>

          {/* 原图按钮 */}
          <View
            className={`game-tool-btn ${originalImageCount >= 3 ? 'used' : ''}`}
            onClick={handleToggleOriginal}
          >
            <View className="game-tool-icon">
              <ImageIcon size={20} color={originalImageCount >= 3 ? '#9ca3af' : '#60a5fa'} />
            </View>
            <Text className="block game-tool-text">{showOriginalImage ? '隐藏' : '原图'}</Text>
            <Text className="block game-tool-count">{originalImageCount}/3</Text>
          </View>

          {/* 冻结按钮 */}
          <View
            className={`game-tool-btn ${freezeCount >= 1 || isFailed ? 'used' : ''}`}
            onClick={handleFreezeTime}
          >
            <View className="game-tool-icon">
              <Snowflake size={20} color={freezeCount >= 1 ? '#9ca3af' : '#60a5fa'} />
            </View>
            <Text className="block game-tool-text">{isTimeFrozen ? `${freezeTimeRemaining}s` : '冻结'}</Text>
            <Text className="block game-tool-count">{freezeCount}/1</Text>
          </View>
        </View>
      </View>

      {/* 失败弹窗 */}
      {isFailed && (
        <View className="modal-overlay">
          <View className="modal-content fail">
            <View className="modal-icon">
              <Text className="text-4xl">⏰</Text>
            </View>
            <Text className="block modal-title fail">时间到！</Text>
            <Text className="block modal-desc">很遗憾，未能完成拼图</Text>
            <View className="modal-buttons">
              <View className="modal-btn secondary" onClick={handleBackHome}>
                <Text className="block modal-btn-text">返回首页</Text>
              </View>
              <View className="modal-btn primary" onClick={handleRestart}>
                <RotateCcw size={16} color="#1a1b2f" />
                <Text className="block modal-btn-text">重新开始</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 过关弹窗（1-9关） */}
      {isComplete && !isGameCompleted && (
        <View className="modal-overlay">
          <ParticleEffect show={showParticles} />
          <View className="modal-content success">
            <View className="modal-icon">
              <Trophy size={48} color="#e8b86d" />
            </View>
            <Text className="block modal-title success">恭喜过关！</Text>
            <Text className="block modal-time">花费时间：{formatTime(180 - countdownTime)}</Text>
            <View className="modal-buttons">
              {isWeapp && (
                <View className="modal-btn secondary" onClick={handleDownloadImage}>
                  <Download size={16} color="#f5f5f0" />
                  <Text className="block modal-btn-text">保存图片</Text>
                </View>
              )}
              <View className="modal-btn primary" onClick={handleNextLevel}>
                <Play size={16} color="#1a1b2f" />
                <Text className="block modal-btn-text">下一关</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 通关弹窗（完成所有关卡） */}
      {isGameCompleted && (
        <View className="modal-overlay">
          <ParticleEffect show />
          <View className="modal-content victory">
            <View className="modal-icon victory">
              <Text className="text-5xl">🏆</Text>
            </View>
            <Text className="block modal-title victory">恭喜通关！</Text>
            <Text className="block modal-subtitle">你完成了所有挑战</Text>
            <View className="modal-stats">
              <Text className="block modal-stats-label">总花费时间</Text>
              <Text className="block modal-stats-value">{formatTime(totalTimeSpent)}</Text>
            </View>
            <View className="modal-buttons">
              {isWeapp && (
                <View className="modal-btn secondary" onClick={handleDownloadImage}>
                  <Download size={16} color="#f5f5f0" />
                  <Text className="block modal-btn-text">保存图片</Text>
                </View>
              )}
              <View className="modal-btn primary" onClick={handleRestartAll}>
                <RotateCcw size={16} color="#1a1b2f" />
                <Text className="block modal-btn-text">重新来过</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
