import { View, Text, Button, Image } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

export default function GamePage() {
  // 平台检测
  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  const {
    currentLevel,
    gridSize,
    imageUrl,
    isPlaying,
    isComplete,
    isLoading,
    elapsedTime,
    pieces,
    selectedPiece,
    showHint,
    showOriginalImage,
    startGame,
    resetGame,
    selectPiece,
    movePiece,
    updatePieceIndex,
    swapPieces,
    toggleHint,
    toggleOriginalImage,
    updateElapsedTime,
    checkComplete,
    loadNextLevel
  } = useGameStore()

  const [draggingPiece, setDraggingPiece] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const timerRef = useRef<NodeJS.Timeout>()
  const isMountedRef = useRef(false)

  // 组件挂载后获取容器位置
  useEffect(() => {
    isMountedRef.current = true
    // 延迟获取以确保 DOM 已渲染
    setTimeout(() => {
      getContainerRect().then((rect) => {
        if (rect) {
          setContainerRect(rect)
          console.log('容器位置已获取:', rect, '平台:', isWeapp ? '小程序' : 'H5')
        }
      })
    }, 100)

    return () => {
      isMountedRef.current = false
    }
  }, [isWeapp])

  // 获取容器位置信息
  const getContainerRect = () => {
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

  // 页面加载时开始游戏
  useEffect(() => {
    startGame(1)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 计时器
  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerRef.current = setInterval(() => {
        updateElapsedTime()
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isComplete])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 返回首页
  const handleBackHome = () => {
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  // 查看原图
  const handleToggleOriginal = () => {
    toggleOriginalImage()
  }

  // 提示功能
  const handleHint = () => {
    toggleHint()
  }

  // 重置游戏
  const handleReset = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要重新开始本关吗？',
      success: (res) => {
        if (res.confirm) {
          resetGame()
        }
      }
    })
  }

  // 下一关
  const handleNextLevel = () => {
    loadNextLevel()
  }

  // 计算碎片在容器中的实际位置（像素）
  const getPiecePixelPosition = (piece: any, containerWidth: number) => {
    return {
      x: (piece.x / 100) * containerWidth,
      y: (piece.y / 100) * containerWidth
    }
  }

  // 开始拖拽
  const handleTouchStart = async (e: any, piece: any) => {
    e.stopPropagation()
    e.preventDefault()
    if (isComplete || showOriginalImage) return

    const touch = e.touches[0]

    // 获取容器位置
    const rect = await getContainerRect()
    if (!rect) return

    const piecePixelPos = getPiecePixelPosition(piece, rect.width)

    setContainerRect(rect)
    setDraggingPiece(piece)
    setDragOffset({
      x: touch.clientX - rect.left - piecePixelPos.x,
      y: touch.clientY - rect.top - piecePixelPos.y
    })
    selectPiece(piece)

    console.log('开始拖拽碎片：', piece.id, '当前位置:', piece.x, piece.y, '%', '平台:', isWeapp ? '小程序' : 'H5')
  }

  // 拖拽移动
  const handleTouchMove = (_e: any) => {
    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage || containerRect.width === 0) return

    const touch = _e.touches[0]
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const pieceWidth = containerWidth / gridSize
    const pieceHeight = containerHeight / gridSize

    // 计算新的位置
    let newX = touch.clientX - containerRect.left - dragOffset.x
    let newY = touch.clientY - containerRect.top - dragOffset.y

    // 限制在容器范围内
    newX = Math.max(0, Math.min(newX, containerWidth - pieceWidth))
    newY = Math.max(0, Math.min(newY, containerHeight - pieceHeight))

    // 转换为百分比
    const newXPercent = (newX / containerWidth) * 100
    const newYPercent = (newY / containerHeight) * 100

    movePiece(draggingPiece, newXPercent, newYPercent)

    // 同步更新 draggingPiece 的坐标
    setDraggingPiece((prev: any) => ({ ...prev, x: newXPercent, y: newYPercent }))
  }

  // 结束拖拽
  const handleTouchEnd = (_e: any) => {
    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage) return

    // 从 pieces 数组中重新获取最新的 draggingPiece 数据
    const latestDraggingPiece = pieces.find(p => p.id === draggingPiece.id)
    if (!latestDraggingPiece) {
      setDraggingPiece(null)
      setDragOffset({ x: 0, y: 0 })
      setContainerRect({ left: 0, top: 0, width: 0, height: 0 })
      return
    }

    // 计算目标格子位置
    const targetCol = Math.round((latestDraggingPiece.x / 100) * gridSize)
    const targetRow = Math.round((latestDraggingPiece.y / 100) * gridSize)
    const targetIndex = targetRow * gridSize + targetCol

    console.log('拖拽结束：', {
      draggingPieceId: latestDraggingPiece.id,
      draggingPieceX: latestDraggingPiece.x,
      draggingPieceY: latestDraggingPiece.y,
      targetCol,
      targetRow,
      targetIndex,
      totalPieces: pieces.length,
      gridSize,
      platform: isWeapp ? '小程序' : 'H5'
    })

    // 找到目标格子里的碎片
    const targetPiece = pieces.find(p => p.currentIndex === targetIndex && p.id !== latestDraggingPiece.id)

    console.log('目标碎片：', targetPiece ? `id=${targetPiece.id}, currentIndex=${targetPiece.currentIndex}` : 'null')

    if (targetPiece) {
      console.log('交换碎片：', {
        piece1: latestDraggingPiece.id,
        piece2: targetPiece.id,
        piece1OldIndex: latestDraggingPiece.currentIndex,
        piece2OldIndex: targetPiece.currentIndex
      })
      // 如果目标位置有其他碎片，交换位置
      swapPieces(latestDraggingPiece, targetPiece)
    } else {
      // 如果目标位置为空（理论上不会发生，因为打乱后所有位置都有碎片）
      // 直接移动到目标格子（吸附）
      const pieceSize = 100 / gridSize
      const newX = targetCol * pieceSize
      const newY = targetRow * pieceSize
      movePiece(latestDraggingPiece, newX, newY)

      // 更新 currentIndex
      updatePieceIndex(latestDraggingPiece.id, targetIndex)
      console.log('移动碎片到空位：', latestDraggingPiece.id, '->', targetIndex)
    }

    setDraggingPiece(null)
    setDragOffset({ x: 0, y: 0 })
    setContainerRect({ left: 0, top: 0, width: 0, height: 0 })

    // 检查是否完成拼图
    setTimeout(() => {
      const complete = checkComplete()
      if (complete) {
        if (isWeapp) {
          Taro.vibrateShort()
        }
      }
    }, 200)
  }

  if (isLoading) {
    return (
      <View className="game-page">
        <View className="game-loading">
          <Text className="block">加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="game-page">
      {/* 顶部信息栏 */}
      <View className="game-header">
        <View className="header-left">
          <Text className="block header-label">第 {currentLevel} 关</Text>
          <Text className="block header-info">{gridSize}×{gridSize}</Text>
        </View>
        <View className="header-right">
          <Text className="block header-label">用时</Text>
          <Text className="block header-info">{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* 拼图区域 */}
      <View className="game-container">
        {showOriginalImage ? (
          <View className="original-image-container">
            <Image
              className="original-image"
              src={imageUrl}
              mode="aspectFill"
            />
          </View>
        ) : (
          <View className="puzzle-container">
            <View
              className="puzzle-board"
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              catchTouchMove={handleTouchMove}
              catchTouchEnd={handleTouchEnd}
            >
              {/* 拼图碎片将由 JS 动态渲染 */}
              <View className="puzzle-grid">
                {pieces.map((piece) => {
                  const pieceSize = 100 / gridSize
                  return (
                    <View
                      key={piece.id}
                      className={`puzzle-piece ${selectedPiece?.id === piece.id ? 'selected' : ''}`}
                      style={{
                        width: `${pieceSize}%`,
                        height: `${pieceSize}%`,
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${gridSize * 100}%`,
                        backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))}%`
                      }}
                      catchTouchStart={(e) => handleTouchStart(e, piece)}
                    />
                  )
                })}
              </View>
            </View>

            {/* 提示显示正确位置的边框 */}
            {showHint && (
              <View className="hint-overlay">
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                  const piece = pieces.find(p => p.correctIndex === index)
                  const isCorrect = piece?.currentIndex === index
                  return (
                    <View
                      key={index}
                      className={`hint-cell ${isCorrect ? 'correct' : ''}`}
                      style={{
                        width: `${100 / gridSize}%`,
                        height: `${100 / gridSize}%`
                      }}
                    />
                  )
                })}
              </View>
            )}
          </View>
        )}
      </View>

      {/* 底部功能按钮 */}
      <View className="game-footer">
        <Button className="footer-button" onClick={handleHint}>
          {showHint ? '隐藏提示' : '提示'}
        </Button>
        <Button className="footer-button" onClick={handleToggleOriginal}>
          {showOriginalImage ? '隐藏原图' : '查看原图'}
        </Button>
        <Button className="footer-button" onClick={handleReset}>
          重置
        </Button>
      </View>

      {/* 过关弹窗 */}
      {isComplete && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title">恭喜通关！</Text>
            <Text className="block victory-time">用时：{formatTime(elapsedTime)}</Text>
            <View className="victory-buttons">
              <Button className="victory-button secondary" onClick={handleBackHome}>
                返回首页
              </Button>
              <Button className="victory-button primary" onClick={handleNextLevel}>
                下一关
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
