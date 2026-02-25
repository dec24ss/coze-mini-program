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
    isFailed,
    isLoading,
    countdownTime,
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
  const [draggingPiecesGroup, setDraggingPiecesGroup] = useState<any[]>([])  // 拖拽的图块组
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
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
    if (isPlaying && !isComplete && !isFailed) {
      timerRef.current = setInterval(() => {
        updateCountdown()
        checkFailed()
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isComplete, isFailed])

  // 时间冻结倒计时
  useEffect(() => {
    if (isTimeFrozen && freezeTimeRemaining > 0) {
      const freezeTimer = setInterval(() => {
        updateFreezeCountdown()
      }, 1000)
      return () => clearInterval(freezeTimer)
    }
  }, [isTimeFrozen, freezeTimeRemaining, updateFreezeCountdown])

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

  // 提示功能
  const handleHint = () => {
    if (hintCount >= 3) {
      Taro.showToast({ title: '提示次数已用完', icon: 'none' })
      return
    }
    // 显示提示
    toggleHint()
    // 3秒后自动隐藏
    setTimeout(() => {
      toggleHint()
    }, 3000)
  }

  // 查看原图
  const handleToggleOriginal = () => {
    if (originalImageCount >= 3 && !showOriginalImage) {
      Taro.showToast({ title: '原图查看次数已用完', icon: 'none' })
      return
    }
    toggleOriginalImage()
  }

  // 冻结时间
  const handleFreezeTime = () => {
    if (freezeCount >= 1) {
      Taro.showToast({ title: '冻结次数已用完', icon: 'none' })
      return
    }
    freezeTime()
  }

  // 重新开始
  const handleRestart = () => {
    startGame(currentLevel)
  }

  // 下一关
  const handleNextLevel = () => {
    loadNextLevel()
  }

  // 查找所有相邻且正确的图块（用于整体拖动）
  const getConnectedCorrectPieces = (startPiece: any, visited: Set<number> = new Set()): any[] => {
    if (visited.has(startPiece.id)) return []

    visited.add(startPiece.id)
    const connectedPieces = [startPiece]

    const currentIndex = startPiece.currentIndex
    const correctIndex = startPiece.correctIndex

    // 如果这个图块不在正确位置，不查找相邻图块
    if (currentIndex !== correctIndex) {
      return connectedPieces
    }

    // 检查四个方向的相邻图块
    const directions = [
      { dx: -1, dy: 0 },  // 左
      { dx: 1, dy: 0 },   // 右
      { dx: 0, dy: -1 },  // 上
      { dx: 0, dy: 1 }    // 下
    ]

    const currentRow = Math.floor(currentIndex / gridSize)
    const currentCol = currentIndex % gridSize

    for (const { dx, dy } of directions) {
      const newRow = currentRow + dy
      const newCol = currentCol + dx

      // 检查是否在网格范围内
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        const neighborIndex = newRow * gridSize + newCol
        const neighborPiece = pieces.find(p => p.currentIndex === neighborIndex)

        // 如果相邻图块也在正确位置，递归查找它的相邻图块
        if (neighborPiece && neighborPiece.correctIndex === neighborIndex && !visited.has(neighborPiece.id)) {
          const neighborConnected = getConnectedCorrectPieces(neighborPiece, visited)
          connectedPieces.push(...neighborConnected)
        }
      }
    }

    return connectedPieces
  }

  // 获取需要交换的两个图块
  const getNextSwapPieces = () => {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces.find(p => p.currentIndex === i)
      if (piece && piece.correctIndex !== i) {
        // 找到这个图块正确位置上的图块
        const targetPiece = pieces.find(p => p.currentIndex === piece.correctIndex)
        if (targetPiece && targetPiece.id !== piece.id) {
          return { piece1: piece, piece2: targetPiece }
        }
      }
    }
    return null
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
    console.log('handleTouchStart 被调用', { e, piece, isWeapp, isComplete, showOriginalImage })

    e.stopPropagation()
    e.preventDefault()
    if (isComplete || showOriginalImage) {
      console.log('触摸被阻止：游戏已完成或正在显示原图')
      return
    }

    // 获取触摸点位置（兼容 H5 和小程序）
    const touch = e.touches ? e.touches[0] : e.detail.touches[0]
    console.log('触摸点位置:', touch)

    // 获取容器位置
    const rect = await getContainerRect()
    console.log('容器位置:', rect)

    if (!rect) {
      console.log('无法获取容器位置')
      return
    }

    const piecePixelPos = getPiecePixelPosition(piece, rect.width)

    setContainerRect(rect)
    setDraggingPiece(piece)
    setDragOffset({
      x: touch.clientX - rect.left - piecePixelPos.x,
      y: touch.clientY - rect.top - piecePixelPos.y
    })

    // 查找所有相邻且正确的图块（用于整体拖动）
    const connectedPieces = getConnectedCorrectPieces(piece)
    console.log('相邻的正确图块组:', connectedPieces)
    setDraggingPiecesGroup(connectedPieces)

    console.log('开始拖拽碎片：', piece.id, '当前位置:', piece.x, piece.y, '%', '平台:', isWeapp ? '小程序' : 'H5', '拖拽组大小:', connectedPieces.length)
  }

  // 拖拽移动
  const handleTouchMove = (_e: any) => {
    console.log('handleTouchMove 被调用', { draggingPiece, containerRect })

    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage || containerRect.width === 0) {
      console.log('拖拽被阻止')
      return
    }

    // 获取触摸点位置（兼容 H5 和小程序）
    const touch = _e.touches ? _e.touches[0] : _e.detail.touches[0]
    console.log('触摸点位置:', touch)

    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // 计算新的位置（更灵敏的拖动）
    let newX = touch.clientX - containerRect.left - dragOffset.x
    let newY = touch.clientY - containerRect.top - dragOffset.y

    // 限制在容器范围内（严格限制，确保图块始终在有效范围内）
    const pieceSizePercent = 100 / gridSize
    const maxXPercent = 100 - pieceSizePercent
    const maxYPercent = 100 - pieceSizePercent

    // 转换为百分比
    let newXPercent = (newX / containerWidth) * 100
    let newYPercent = (newY / containerHeight) * 100

    // 严格限制在有效范围内
    newXPercent = Math.max(0, Math.min(newXPercent, maxXPercent))
    newYPercent = Math.max(0, Math.min(newYPercent, maxYPercent))

    console.log('新位置:', { newXPercent, newYPercent })

    // 移动主图块
    movePiece(draggingPiece, newXPercent, newYPercent)

    // 如果有相邻的正确图块，同时移动它们
    if (draggingPiecesGroup.length > 1) {
      draggingPiecesGroup.forEach(p => {
        if (p.id !== draggingPiece.id) {
          // 计算相对位置偏移
          const offsetX = p.x - draggingPiece.x
          const offsetY = p.y - draggingPiece.y

          // 移动相邻图块
          const targetX = newXPercent + offsetX
          const targetY = newYPercent + offsetY

          // 限制在有效范围内
          const clampedX = Math.max(0, Math.min(targetX, maxXPercent))
          const clampedY = Math.max(0, Math.min(targetY, maxYPercent))

          movePiece(p, clampedX, clampedY)
        }
      })
    }

    // 同步更新 draggingPiece 的坐标
    setDraggingPiece((prev: any) => ({ ...prev, x: newXPercent, y: newYPercent }))
  }

  // 结束拖拽
  const handleTouchEnd = (_e: any) => {
    console.log('handleTouchEnd 被调用', { draggingPiece })

    _e.stopPropagation()
    _e.preventDefault()
    if (!draggingPiece || isComplete || showOriginalImage) {
      console.log('拖拽结束被阻止')
      return
    }

    // 从 pieces 数组中重新获取最新的 draggingPiece 数据
    const latestDraggingPiece = pieces.find(p => p.id === draggingPiece.id)
    if (!latestDraggingPiece) {
      console.log('无法找到最新的拖拽碎片')
      setDraggingPiece(null)
      setDraggingPiecesGroup([])
      setDragOffset({ x: 0, y: 0 })
      setContainerRect({ left: 0, top: 0, width: 0, height: 0 })
      return
    }

    // 计算目标格子位置（精确吸附）
    const pieceSize = 100 / gridSize
    const targetCol = Math.round(latestDraggingPiece.x / pieceSize)
    const targetRow = Math.round(latestDraggingPiece.y / pieceSize)
    const targetIndex = targetRow * gridSize + targetCol

    // 确保目标位置在有效范围内（严格限制）
    const clampedCol = Math.max(0, Math.min(targetCol, gridSize - 1))
    const clampedRow = Math.max(0, Math.min(targetRow, gridSize - 1))
    const clampedTargetIndex = clampedRow * gridSize + clampedCol

    // 精确吸附到格子（确保对齐）
    const snapX = clampedCol * pieceSize
    const snapY = clampedRow * pieceSize

    console.log('拖拽结束：', {
      draggingPieceId: latestDraggingPiece.id,
      draggingPieceX: latestDraggingPiece.x,
      draggingPieceY: latestDraggingPiece.y,
      targetCol,
      targetRow,
      clampedCol,
      clampedRow,
      targetIndex,
      clampedTargetIndex,
      totalPieces: pieces.length,
      gridSize,
      platform: isWeapp ? '小程序' : 'H5'
    })

    // 找到目标格子里的碎片
    const targetPiece = pieces.find(p => p.currentIndex === clampedTargetIndex && p.id !== latestDraggingPiece.id)

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
      // 直接移动到目标格子（精确吸附）
      movePiece(latestDraggingPiece, snapX, snapY)

      // 更新 currentIndex
      updatePieceIndex(latestDraggingPiece.id, clampedTargetIndex)
      console.log('移动碎片到空位：', latestDraggingPiece.id, '->', clampedTargetIndex, `位置：${snapX}%, ${snapY}%`)
    }

    setDraggingPiece(null)
    setDraggingPiecesGroup([])
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
        <Text className="block header-text">
          第{currentLevel}关
        </Text>
        <Text className="block header-text">
          {formatTime(countdownTime)}
        </Text>
        {isTimeFrozen && (
          <Text className="block header-text">
            {freezeTimeRemaining}秒后恢复
          </Text>
        )}
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
            <View className="puzzle-board">
              {/* 拼图碎片将由 JS 动态渲染 */}
              <View className="puzzle-grid">
                {pieces.map((piece) => {
                  const pieceSize = 100 / gridSize

                  // 检查相邻图块的正确关系
                  // 右侧位置
                  const rightPos = piece.currentIndex + 1
                  const isRightSameRow = Math.floor(piece.currentIndex / gridSize) === Math.floor(rightPos / gridSize)
                  const rightNeighbor = isRightSameRow ? pieces.find(p => p.currentIndex === rightPos) : null
                  const isRightNeighborCorrectRelationship = rightNeighbor?.correctIndex === rightPos && piece.correctIndex === rightPos - 1

                  // 左侧位置
                  const leftPos = piece.currentIndex - 1
                  const isLeftSameRow = Math.floor(piece.currentIndex / gridSize) === Math.floor(leftPos / gridSize)
                  const leftNeighbor = isLeftSameRow && leftPos >= 0 ? pieces.find(p => p.currentIndex === leftPos) : null
                  const isLeftNeighborCorrectRelationship = leftNeighbor?.correctIndex === leftPos && piece.correctIndex === leftPos + 1

                  // 上方位置
                  const topPos = piece.currentIndex - gridSize
                  const topNeighbor = topPos >= 0 ? pieces.find(p => p.currentIndex === topPos) : null
                  const isTopNeighborCorrectRelationship = topNeighbor?.correctIndex === topPos && piece.correctIndex === topPos + gridSize

                  // 下方位置
                  const bottomPos = piece.currentIndex + gridSize
                  const bottomNeighbor = pieces.find(p => p.currentIndex === bottomPos)
                  const isBottomNeighborCorrectRelationship = bottomNeighbor?.correctIndex === bottomPos && piece.correctIndex === bottomPos - gridSize

                  // 设置外层黑线样式：如果相邻图块是正确的相邻关系，则隐藏对应边框
                  const outerBorderStyle = {
                    borderTop: isTopNeighborCorrectRelationship ? '0 solid transparent' : '1px solid rgba(0, 0, 0, 0.8)',
                    borderLeft: isLeftNeighborCorrectRelationship ? '0 solid transparent' : '1px solid rgba(0, 0, 0, 0.8)',
                    borderBottom: isBottomNeighborCorrectRelationship ? '0 solid transparent' : '1px solid rgba(0, 0, 0, 0.8)',
                    borderRight: isRightNeighborCorrectRelationship ? '0 solid transparent' : '1px solid rgba(0, 0, 0, 0.8)'
                  }

                  // 设置内层白边样式：如果相邻图块是正确的相邻关系，则隐藏对应白边
                  const innerBorderStyle = {
                    borderTop: isTopNeighborCorrectRelationship ? '0 solid transparent' : '2px solid rgba(255, 255, 255, 0.9)',
                    borderLeft: isLeftNeighborCorrectRelationship ? '0 solid transparent' : '2px solid rgba(255, 255, 255, 0.9)',
                    borderBottom: isBottomNeighborCorrectRelationship ? '0 solid transparent' : '2px solid rgba(255, 255, 255, 0.9)',
                    borderRight: isRightNeighborCorrectRelationship ? '0 solid transparent' : '2px solid rgba(255, 255, 255, 0.9)'
                  }

                  return (
                    <View
                      key={piece.id}
                      className="puzzle-piece-outer"
                      style={{
                        width: `${pieceSize}%`,
                        height: `${pieceSize}%`,
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        ...outerBorderStyle,
                        boxSizing: 'border-box'
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
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: `${gridSize * 100}%`,
                          backgroundPosition: `${(piece.correctIndex % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctIndex / gridSize) * (100 / (gridSize - 1))}%`,
                          ...innerBorderStyle,
                          boxSizing: 'border-box'
                        }}
                      />
                    </View>
                  )
                })}
              </View>
            </View>

            {/* 提示显示需要交换的两个图块 */}
            {showHint && (
              <View className="hint-overlay">
                {pieces.map((piece) => {
                  const nextSwapPieces = getNextSwapPieces()
                  const isPiece1Hint = nextSwapPieces?.piece1?.id === piece.id
                  const isPiece2Hint = nextSwapPieces?.piece2?.id === piece.id
                  const isCorrect = piece.correctIndex === piece.currentIndex

                  // 如果正在拖动该图块，使用 draggingPiece 的实时位置，否则使用 piece 的位置
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
        )}
      </View>

      {/* 底部功能按钮 */}
      <View className="game-footer">
        <View className="footer-buttons-row">
          <Button
            className="footer-button"
            onClick={handleHint}
            disabled={hintCount >= 3}
          >
            提示
          </Button>
          <Button
            className="footer-button"
            onClick={handleToggleOriginal}
          >
            {showOriginalImage ? '隐藏' : '原图'}
          </Button>
          <Button
            className="footer-button"
            onClick={handleFreezeTime}
            disabled={isTimeFrozen || freezeCount >= 1 || isFailed}
          >
            {isTimeFrozen ? `${freezeTimeRemaining}s` : '冻结'}
          </Button>
        </View>
        <View className="footer-rules">
          <Text className="block footer-rule">
            已用 {hintCount}/3 次
          </Text>
          <Text className="block footer-rule">
            已用 {originalImageCount}/3 次
          </Text>
          <Text className="block footer-rule">
            {freezeCount >= 1 ? '已用 1/1 次' : '可用 1 次'}
          </Text>
        </View>
      </View>

      {/* 失败弹窗 */}
      {isFailed && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title" style={{ color: '#EF4444' }}>时间到！</Text>
            <Text className="block victory-time">很遗憾，未能完成拼图</Text>
            <View className="victory-buttons">
              <Button className="victory-button secondary" onClick={handleBackHome}>
                返回首页
              </Button>
              <Button className="victory-button primary" onClick={handleRestart}>
                重新开始
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 过关弹窗 */}
      {isComplete && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title">恭喜通关！</Text>
            <Text className="block victory-time">剩余时间：{formatTime(countdownTime)}</Text>
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
