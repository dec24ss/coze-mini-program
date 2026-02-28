import { View, Text, Button, Image } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Network } from '@/network'
import './index.css'

export default function GamePage() {
  // 平台检测
  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
  const { playSound, playVibration, initSettings } = useSettingsStore()

  // 初始化设置
  useEffect(() => {
    initSettings()
  }, [initSettings])

  const {
    currentLevel,
    gridSize,
    imageUrl,
    originalImageUrl,
    isPlaying,
    isComplete,
    isFailed,
    isLoading,
    countdownTime,
    isFreePlayMode,
    isTimeFrozen,
    freezeTimeRemaining,
    pieces,
    showHint,
    showOriginalImage,
    originalImageTimeRemaining,
    startGame,
    movePiece,
    updatePieceIndex,
    swapPieces,
    toggleHint,
    toggleOriginalImage,
    updateCountdown,
    updateFreezeCountdown,
    updateOriginalImageCountdown,
    freezeTime,
    checkComplete,
    checkFailed,
    loadNextLevel
  } = useGameStore()

  const { updateHighestLevel, addPoints, consumePoints, getPoints } = useUserStore()

  const [draggingPiece, setDraggingPiece] = useState<any>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState<{ left: number; top: number; width: number; height: number }>({ left: 0, top: 0, width: 0, height: 0 })
  const [isImageLoaded, setIsImageLoaded] = useState(true)  // 默认为 true，避免一直显示加载中
  const [showFreePlayComplete, setShowFreePlayComplete] = useState(false)  // 自由模式完成弹窗
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
      const { getCurrentLevel } = useUserStore.getState()

      console.log('📋 isImagesPreloaded:', isImagesPreloaded)
      console.log('📋 levelImageMap 长度:', Object.keys(levelImageMap).length)

      // 如果图片未预加载，先进行预加载
      if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
        console.log('⚠️  图片未预加载，开始预加载...')
        await preloadImages()
        console.log('✅ 图片预加载完成')
      }

      // 获取当前应该开始的关卡（从最后未完成关卡开始）
      const level = getCurrentLevel()
      console.log(`🎮 从第 ${level} 关开始游戏（正常模式）`)

      // 开始游戏（正常模式）
      startGame(level, false)
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

  // 原图查看定时器 - 打开原图时5秒自动关闭
  useEffect(() => {
    // 如果正在显示原图，设置每秒更新倒计时的定时器
    if (showOriginalImage) {
      const intervalTimer = setInterval(() => {
        updateOriginalImageCountdown()
      }, 1000)

      // 5秒后自动关闭的定时器
      timerRef.current = setTimeout(() => {
        toggleOriginalImage()
        Taro.showToast({ title: '原图查看时间已到', icon: 'none' })
        timerRef.current = undefined
      }, 5000)

      return () => {
        clearInterval(intervalTimer)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = undefined
        }
      }
    } else {
      // 如果原图被关闭，清除定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [showOriginalImage, toggleOriginalImage, updateOriginalImageCountdown])

  // 自动进入下一关
  const handleNextLevelAuto = async () => {
    // 自由模式不记录进度，但也要获得积分
    if (isFreePlayMode) {
      // 过关获得1积分
      addPoints(1)
      Taro.showToast({ title: '获得 1 积分！', icon: 'none' })
      setShowFreePlayComplete(true)
      return
    }
    
    // 正式模式：更新进度和积分
    // 保存当前关卡对应的图片
    await updateHighestLevel(currentLevel, imageUrl)
    // 过关获得1积分
    addPoints(1)
    Taro.showToast({ title: '获得 1 积分！', icon: 'none' })
    
    // 自动进入下一关
    loadNextLevel()
  }

  // 过关后自动进入下一关（延迟1.5秒，让玩家看到完成效果）
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        handleNextLevelAuto()
      }, 1500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 返回首页
  const handleBackHome = () => {
    // 播放轻微震动
    playVibration('light')
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  // 返回关卡选择页面
  const handleBackToLevels = () => {
    // 播放轻微震动
    playVibration('light')
    Taro.redirectTo({ url: '/pages/level-select/index' })
  }

  // 下载原图（消耗1积分，失败不扣积分）
  const handleDownloadImage = () => {
    // 检查积分
    const currentPoints = getPoints()
    if (currentPoints < 1) {
      Taro.showModal({
        title: '积分不足',
        content: '下载原图需要1积分，过关可获得积分，是否继续游戏赚取积分？',
        showCancel: true,
        confirmText: '继续游戏',
        cancelText: '取消'
      })
      return
    }
    
    // 使用原始网络图片URL下载
    const downloadUrl = originalImageUrl || imageUrl
    
    if (!downloadUrl || downloadUrl.startsWith('wxfile://') || downloadUrl.startsWith('data:')) {
      Taro.showToast({ title: '无法下载此图片', icon: 'none' })
      return
    }
    
    Taro.showLoading({ title: '下载中...' })
    
    Network.downloadFile({
      url: downloadUrl,
      success: (res) => {
        Taro.hideLoading()
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            // 下载成功后才扣除积分
            consumePoints(1)
            Taro.showToast({ title: '保存成功，消耗1积分', icon: 'success' })
          },
          fail: (err) => {
            console.error('保存到相册失败:', err)
            Taro.showToast({ title: '保存失败，请授权相册权限', icon: 'none' })
          }
        })
      },
      fail: (err) => {
        Taro.hideLoading()
        console.error('下载图片失败:', err)
        Taro.showToast({ title: '下载失败，请重试', icon: 'none' })
      }
    })
  }

  // 提示功能
  const handleHint = () => {
    // 播放轻微震动
    playVibration('light')

    // 检查是否已显示提示，如果是则关闭
    if (showHint) {
      toggleHint()
      return
    }
    // 使用1积分兑换提示
    if (!consumePoints(1)) {
      Taro.showModal({
        title: '积分不足',
        content: '提示需要1积分，过关可获得积分，是否继续游戏赚取积分？',
        showCancel: true,
        confirmText: '继续游戏',
        cancelText: '取消'
      })
      return
    }
    // 显示提示
    toggleHint()
    Taro.showToast({ title: '使用1积分兑换提示', icon: 'none' })
  }

  // 原图查看
  const handleToggleOriginal = () => {
    // 播放轻微震动
    playVibration('light')

    // 如果正在显示原图，直接关闭（不消耗积分）
    if (showOriginalImage) {
      toggleOriginalImage()
      return
    }
    // 使用1积分兑换原图查看
    if (!consumePoints(1)) {
      Taro.showModal({
        title: '积分不足',
        content: '查看原图需要1积分，过关可获得积分，是否继续游戏赚取积分？',
        showCancel: true,
        confirmText: '继续游戏',
        cancelText: '取消'
      })
      return
    }
    toggleOriginalImage()
    Taro.showToast({ title: '使用1积分兑换原图查看', icon: 'none' })
  }

  // 冻结时间
  const handleFreezeTime = () => {
    // 播放轻微震动
    playVibration('light')

    // 使用时间已经冻结，则不允许再次使用
    if (isTimeFrozen) {
      return
    }
    // 使用1积分兑换冻结时间
    if (!consumePoints(1)) {
      Taro.showModal({
        title: '积分不足',
        content: '冻结时间需要1积分，过关可获得积分，是否继续游戏赚取积分？',
        showCancel: true,
        confirmText: '继续游戏',
        cancelText: '取消'
      })
      return
    }
    freezeTime()
    Taro.showToast({ title: '使用1积分兑换冻结时间', icon: 'none' })
  }

  // 重新开始当前关卡
  const handleRestart = () => {
    // 播放轻微震动
    playVibration('light')
    startGame(currentLevel)
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

  // 检查图块是否在正确位置（基于四周白线是否消除）
  const isPieceInCorrectPosition = (piece: any, allPieces: any[]): boolean => {
    const { currentIndex, correctIndex } = piece
    const currentRow = Math.floor(currentIndex / gridSize)
    const currentCol = currentIndex % gridSize

    // 检查四个方向的白线是否消除

    // 上方
    if (currentRow > 0) {
      const aboveIndex = currentIndex - gridSize
      const abovePiece = allPieces.find(p => p.currentIndex === aboveIndex)
      if (abovePiece) {
        // 上方邻居在原图中是否在正确位置的上方
        const isAboveCorrect = abovePiece.correctIndex === correctIndex - gridSize
        if (!isAboveCorrect) {
          return false // 上方白线未消除
        }
      }
    }

    // 下方
    if (currentRow < gridSize - 1) {
      const belowIndex = currentIndex + gridSize
      const belowPiece = allPieces.find(p => p.currentIndex === belowIndex)
      if (belowPiece) {
        // 下方邻居在原图中是否在正确位置的下方
        const isBelowCorrect = belowPiece.correctIndex === correctIndex + gridSize
        if (!isBelowCorrect) {
          return false // 下方白线未消除
        }
      }
    }

    // 左侧
    if (currentCol > 0) {
      const leftIndex = currentIndex - 1
      const leftPiece = allPieces.find(p => p.currentIndex === leftIndex)
      if (leftPiece) {
        // 左侧邻居在原图中是否在正确位置的左侧
        const isLeftCorrect = leftPiece.correctIndex === correctIndex - 1
        // 还要检查它们是否在同一行
        const isSameRow = Math.floor(leftPiece.currentIndex / gridSize) === currentRow
        if (!isLeftCorrect || !isSameRow) {
          return false // 左侧白线未消除
        }
      }
    }

    // 右侧
    if (currentCol < gridSize - 1) {
      const rightIndex = currentIndex + 1
      const rightPiece = allPieces.find(p => p.currentIndex === rightIndex)
      if (rightPiece) {
        // 右侧邻居在原图中是否在正确位置的右侧
        const isRightCorrect = rightPiece.correctIndex === correctIndex + 1
        // 还要检查它们是否在同一行
        const isSameRow = Math.floor(rightPiece.currentIndex / gridSize) === currentRow
        if (!isRightCorrect || !isSameRow) {
          return false // 右侧白线未消除
        }
      }
    }

    return true // 所有白线都消除
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

      // 获取最新的 pieces 数据（交换后的）
      const latestPieces = useGameStore.getState().pieces

      // 添加交换动画（通过临时修改图块的样式）
      const animPiece1 = latestPieces.find(p => p.id === latestDraggingPiece.id)
      const animPiece2 = latestPieces.find(p => p.id === targetPiece.id)

      if (animPiece1 && animPiece2) {
        // 使用 setTimeout 在 DOM 更新后添加动画类
        setTimeout(() => {
          const piece1El = document.querySelector(`[data-piece-id="${animPiece1.id}"]`)
          const piece2El = document.querySelector(`[data-piece-id="${animPiece2.id}"]`)
          if (piece1El) {
            piece1El.classList.add('swap-anim')
            setTimeout(() => piece1El.classList.remove('swap-anim'), 300)
          }
          if (piece2El) {
            piece2El.classList.add('swap-anim')
            setTimeout(() => piece2El.classList.remove('swap-anim'), 300)
          }
        }, 50)
      }

      // 播放吸附震动（中等震动），不播放音效
      playVibration('medium')

      // 检查交换后的图块是否在正确位置（基于四周白线是否消除）
      setTimeout(() => {
        // 检查 piece1 是否在正确位置
        if (animPiece1) {
          const isPiece1Correct = isPieceInCorrectPosition(animPiece1, latestPieces)
          if (isPiece1Correct) {
            console.log('图块', animPiece1.id, '四周白线已消除')
            // 播放成功音效
            playSound('success')
            // 震动反馈（重震动）
            playVibration('heavy')

            // 添加边框闪烁动画
            const piece1El = document.querySelector(`[data-piece-id="${animPiece1.id}"]`)
            if (piece1El) {
              piece1El.classList.add('correct-flash')
              setTimeout(() => piece1El.classList.remove('correct-flash'), 600)
            }
          }
        }

        // 检查 piece2 是否在正确位置
        if (animPiece2) {
          const isPiece2Correct = isPieceInCorrectPosition(animPiece2, latestPieces)
          if (isPiece2Correct) {
            console.log('图块', animPiece2.id, '四周白线已消除')
            // 播放成功音效
            playSound('success')
            // 震动反馈（重震动）
            playVibration('heavy')

            // 添加边框闪烁动画
            const piece2El = document.querySelector(`[data-piece-id="${animPiece2.id}"]`)
            if (piece2El) {
              piece2El.classList.add('correct-flash')
              setTimeout(() => piece2El.classList.remove('correct-flash'), 600)
            }
          }
        }
      }, 50)

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
      // 播放吸附震动（中等震动），不播放音效
      playVibration('medium')
    }

    setDraggingPiece(null)
    setDragOffset({ x: 0, y: 0 })
    setContainerRect({ left: 0, top: 0, width: 0, height: 0 })

    // 检查是否完成拼图
    setTimeout(() => {
      const complete = checkComplete()
      if (complete) {
        // 播放成功音效和重震动
        playSound('success')
        playVibration('heavy')

        // 添加完成动画（所有图块闪烁）
        pieces.forEach((piece) => {
          setTimeout(() => {
            const pieceEl = document.querySelector(`[data-piece-id="${piece.id}"]`)
            if (pieceEl) {
              pieceEl.classList.add('complete-anim')
              setTimeout(() => pieceEl.classList.remove('complete-anim'), 600)
            }
          }, piece.id * 50) // 每个图块延迟 50ms，形成波浪效果
        })
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
        {showOriginalImage ? (
          <Text className="block header-text" style={{ color: '#10B981' }}>
            原图查看 {originalImageTimeRemaining}s
          </Text>
        ) : isFreePlayMode ? (
          <Text className="block header-text" style={{ color: '#F59E0B' }}>
            自由模式
          </Text>
        ) : (
          <Text className="block header-text">
            {formatTime(countdownTime)}
          </Text>
        )}
        {isTimeFrozen && !isFreePlayMode && (
          <Text className="block header-text">
            {freezeTimeRemaining}秒后恢复
          </Text>
        )}
      </View>

      {/* 拼图区域 */}
      <View className="game-container">
        {showOriginalImage ? (
          <View className="original-image-container">
            <View className="original-image-timer">
              <Text className="block timer-text">{originalImageTimeRemaining}s</Text>
            </View>
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
                  const outerBorderStyle: any = {}
                  if (!isTopNeighborCorrectRelationship) outerBorderStyle.borderTop = '1px solid rgba(0, 0, 0, 0.8)'
                  if (!isLeftNeighborCorrectRelationship) outerBorderStyle.borderLeft = '1px solid rgba(0, 0, 0, 0.8)'
                  if (!isBottomNeighborCorrectRelationship) outerBorderStyle.borderBottom = '1px solid rgba(0, 0, 0, 0.8)'
                  if (!isRightNeighborCorrectRelationship) outerBorderStyle.borderRight = '1px solid rgba(0, 0, 0, 0.8)'

                  // 设置内层白边样式：如果相邻图块是正确的相邻关系，则隐藏对应白边
                  const innerBorderStyle: any = {}
                  if (!isTopNeighborCorrectRelationship) innerBorderStyle.borderTop = '2px solid rgba(255, 255, 255, 0.9)'
                  if (!isLeftNeighborCorrectRelationship) innerBorderStyle.borderLeft = '2px solid rgba(255, 255, 255, 0.9)'
                  if (!isBottomNeighborCorrectRelationship) innerBorderStyle.borderBottom = '2px solid rgba(255, 255, 255, 0.9)'
                  if (!isRightNeighborCorrectRelationship) innerBorderStyle.borderRight = '2px solid rgba(255, 255, 255, 0.9)'

                  return (
                    <View
                      key={piece.id}
                      data-piece-id={piece.id}
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
                            display: 'block',
                            margin: 0,
                            padding: 0
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
          {/* 提示按钮 */}
          <View className="footer-button-wrapper">
            <Button
              className={`footer-button ${showHint ? 'active' : ''}`}
              onClick={handleHint}
            >
              提示
            </Button>
            <View className="points-badge">{getPoints()}</View>
          </View>
          {/* 原图按钮 */}
          <View className="footer-button-wrapper">
            <Button
              className={`footer-button ${showOriginalImage ? 'active' : ''}`}
              onClick={handleToggleOriginal}
            >
              {showOriginalImage ? `${originalImageTimeRemaining}s` : '原图'}
            </Button>
            <View className="points-badge">{getPoints()}</View>
          </View>
          {/* 冻结按钮 */}
          <View className="footer-button-wrapper">
            <Button
              className={`footer-button ${isTimeFrozen ? 'active' : ''}`}
              onClick={handleFreezeTime}
            >
              {isTimeFrozen ? `${freezeTimeRemaining}s` : '冻结'}
            </Button>
            <View className="points-badge">{getPoints()}</View>
          </View>
        </View>
      </View>

      {/* 自由模式完成弹窗 */}
      {showFreePlayComplete && (
        <View className="victory-modal">
          <View className="victory-content">
            <Text className="block victory-title">拼图完成！</Text>
            <Text className="block victory-time">恭喜你完成了自由模式拼图</Text>
            <View className="victory-buttons">
              <Button className="victory-button secondary" onClick={handleBackToLevels}>
                返回关卡选择
              </Button>
              <View className="footer-button-wrapper" style={{ flex: 1 }}>
                <Button className="victory-button primary" onClick={handleDownloadImage}>
                  下载原图
                </Button>
                <View className="points-badge">1</View>
              </View>
            </View>
          </View>
        </View>
      )}

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

    </View>
  )
}
