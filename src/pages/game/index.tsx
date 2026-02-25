import { View, Text, Button, Image } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
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
    isGameCompleted,
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
    loadNextLevel,
    restartGame
  } = useGameStore()

  const [draggingPiece, setDraggingPiece] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })
  const [isImageLoaded, setIsImageLoaded] = useState(true)  // 默认为 true，避免一直显示加载中
  const timerRef = useRef<ReturnType<typeof setTimeout>>()  // 原图查看定时器
  const countdownRef = useRef<ReturnType<typeof setInterval>>()  // 游戏倒计时器
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

  // 监听图片 URL 变化，确认图片已准备就绪
  useEffect(() => {
    if (imageUrl) {
      console.log('🖼️  监听到图片 URL 变化:', imageUrl)
      console.log('🖼️  图片长度:', imageUrl.length)

      // 如果是 base64 数据，立即显示（已经是完整的图片数据）
      if (imageUrl.startsWith('data:image')) {
        console.log('✅ Base64 图片数据，立即显示')
        setIsImageLoaded(true)
        return
      }

      // 如果是本地路径（wxfile://），立即显示
      if (imageUrl.startsWith('wxfile://') || imageUrl.startsWith('/')) {
        console.log('✅ 本地路径图片，立即显示')
        setIsImageLoaded(true)
        return
      }

      // 如果是网络路径，等待图片加载完成
      setIsImageLoaded(false)
      setTimeout(() => {
        setIsImageLoaded(true)
        console.log('✅ 网络路径图片已显示')
      }, 100)  // 100ms延迟
    } else {
      console.log('⚠️  imageUrl 为空')
    }
  }, [imageUrl])

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
    console.log('🎮 GamePage 挂载')

    const initGame = async () => {
      const { isImagesPreloaded, levelImageMap, preloadImages } = useGameStore.getState()

      console.log('📋 isImagesPreloaded:', isImagesPreloaded)
      console.log('📋 levelImageMap 长度:', Object.keys(levelImageMap).length)

      // 如果图片未预加载，先进行预加载
      if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
        console.log('⚠️  图片未预加载，开始预加载...')
        await preloadImages()
        console.log('✅ 图片预加载完成')
      }

      // 开始游戏
      startGame(1)
    }

    initGame()

    return () => {
      console.log('🎮 GamePage 卸载')
      // 清理所有定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = undefined
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame])

  // 计时器 - 查看原图时不会停止
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

  // 原图查看定时器 - 打开原图时10秒自动关闭
  useEffect(() => {
    // 如果正在显示原图，设置10秒定时器
    if (showOriginalImage) {
      timerRef.current = setTimeout(() => {
        toggleOriginalImage()
        Taro.showToast({ title: '原图查看时间已到', icon: 'none' })
        timerRef.current = undefined
      }, 10000)
    } else {
      // 如果原图被关闭，清除定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }

    // 组件卸载时清理定时器
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
  }

  // 原图查看
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

  // 重新开始当前关卡
  const handleRestart = () => {
    startGame(currentLevel)
  }

  // 下一关
  const handleNextLevel = () => {
    loadNextLevel()
  }

  // 通关后重新开始游戏（重新加载图片）
  const handleRestartAll = () => {
    restartGame()
  }

  // 下载原图到相册
  const handleDownloadImage = async () => {
    if (!isWeapp) {
      Taro.showToast({ title: '仅小程序支持保存图片', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '保存中...' })

      // 请求相册权限
      const authResult = await Taro.authorize({
        scope: 'scope.writePhotosAlbum'
      }).catch(() => {
        // 权限被拒绝，引导用户去设置
        Taro.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          confirmText: '去授权',
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting()
            }
          }
        })
        return null
      })

      if (authResult === null) {
        Taro.hideLoading()
        return
      }

      let filePath: string

      // 检查图片类型
      if (imageUrl.startsWith('wxfile://')) {
        // 小程序本地路径，直接使用
        filePath = imageUrl
        console.log('📥 使用本地路径保存:', filePath)
      } else if (imageUrl.startsWith('data:image')) {
        // Base64 数据，需要先下载
        console.log('📥 Base64 数据，先下载到临时文件')
        const downloadRes = await Network.downloadFile({
          url: imageUrl
        })
        if (!downloadRes.tempFilePath) {
          throw new Error('Base64 图片下载失败')
        }
        filePath = downloadRes.tempFilePath
      } else if (imageUrl.startsWith('http')) {
        // 网络路径，先下载
        console.log('📥 网络路径，先下载到临时文件')
        const downloadRes = await Network.downloadFile({
          url: imageUrl
        })
        if (!downloadRes.tempFilePath) {
          throw new Error('网络图片下载失败')
        }
        filePath = downloadRes.tempFilePath
      } else {
        throw new Error('不支持的图片路径格式')
      }

      // 保存到相册
      await Taro.saveImageToPhotosAlbum({
        filePath: filePath
      })

      Taro.hideLoading()
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (error) {
      Taro.hideLoading()
      console.error('保存图片失败:', error)
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
    }
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

    const pieceSize = rect.width / gridSize  // 图块的实际像素尺寸

    setContainerRect(rect)
    setDraggingPiece(piece)

    // 设置偏移为图块尺寸的一半，让触摸点始终在图块中心
    setDragOffset({
      x: pieceSize / 2,
      y: pieceSize / 2
    })

    console.log('开始拖拽碎片：', piece.id, '当前位置:', piece.x, piece.y, '%', '图块尺寸:', pieceSize, '平台:', isWeapp ? '小程序' : 'H5')
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

    movePiece(draggingPiece, newXPercent, newYPercent)

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

      // 交换后立即隐藏提示
      if (showHint) {
        setTimeout(() => {
          toggleHint()
        }, 100)  // 短暂延迟确保动画完成
      }
    } else {
      // 如果目标位置为空（理论上不会发生，因为打乱后所有位置都有碎片）
      // 直接移动到目标格子（精确吸附）
      movePiece(latestDraggingPiece, snapX, snapY)

      // 更新 currentIndex
      updatePieceIndex(latestDraggingPiece.id, clampedTargetIndex)
      console.log('移动碎片到空位：', latestDraggingPiece.id, '->', clampedTargetIndex, `位置：${snapX}%, ${snapY}%`)
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
            {/* 图片加载动画 */}
            {!isImageLoaded && (
              <View className="loading-overlay">
                <Text className="block loading-text">图片加载中...</Text>
              </View>
            )}

            <View
              className="puzzle-board"
              style={{
                opacity: isImageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
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
                      className={`puzzle-piece-outer ${piece.id === draggingPiece?.id ? 'dragging' : ''}`}
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
                      {/* 使用 Image 组件替代 backgroundImage（小程序兼容） */}
                      <View
                        className="puzzle-piece-inner"
                        style={{
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          ...innerBorderStyle,
                          boxSizing: 'border-box'
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
            className={`footer-button ${hintCount >= 3 ? 'used' : ''}`}
            onClick={handleHint}
          >
            提示
          </Button>
          <Button
            className={`footer-button ${originalImageCount >= 3 ? 'used' : ''}`}
            onClick={handleToggleOriginal}
          >
            {showOriginalImage ? '隐藏' : '原图'}
          </Button>
          <Button
            className={`footer-button ${freezeCount >= 1 || isFailed ? 'used' : ''}`}
            onClick={handleFreezeTime}
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
      {isComplete && !isGameCompleted && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title">恭喜通关！</Text>
            <Text className="block victory-time">剩余时间：{formatTime(countdownTime)}</Text>
            <View className="victory-buttons">
              <Button className="victory-button secondary" onClick={handleBackHome}>
                返回首页
              </Button>
              {isWeapp && (
                <Button className="victory-button secondary" onClick={handleDownloadImage}>
                  下载原图
                </Button>
              )}
              <Button className="victory-button primary" onClick={handleNextLevel}>
                下一关
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 通关弹窗（完成所有关卡） */}
      {isGameCompleted && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title" style={{ color: '#F59E0B' }}>🎉 恭喜通关！</Text>
            <Text className="block victory-time">你已经完成了所有10个关卡</Text>
            <Text className="block victory-desc">你真是个拼图高手！</Text>
            <View className="victory-buttons">
              <Button className="victory-button secondary" onClick={handleBackHome}>
                返回首页
              </Button>
              {isWeapp && (
                <Button className="victory-button secondary" onClick={handleDownloadImage}>
                  下载原图
                </Button>
              )}
              <Button className="victory-button primary" onClick={handleRestartAll}>
                重新开始（新图片）
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
