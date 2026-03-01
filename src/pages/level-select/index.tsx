import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Lock } from 'lucide-react-taro'
import './index.css'

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded } = useGameStore()
  const { userInfo, unlockedLevels, levelImages } = useUserStore()
  const { initSettings } = useSettingsStore()
  const [displayLevels, setDisplayLevels] = useState(20)  // 默认显示20关，最多100关

  useEffect(() => {
    // 初始化设置
    initSettings()
    // 检查已解锁的关卡（确保显示最新的解锁状态）
    const { checkUnlockedLevels } = useUserStore.getState()
    checkUnlockedLevels()

    // 调试信息：检查缩略图数据
    console.log('🖼️  关卡选择页面初始化:')
    console.log('- isImagesPreloaded:', isImagesPreloaded)
    console.log('- levelImageMap length:', Object.keys(levelImageMap).length)
    console.log('- levelImageMap sample:', Object.keys(levelImageMap).slice(0, 3).map(key => `${key}: ${levelImageMap[key]?.url?.substring(0, 50)}...`))
    console.log('- userInfo:', userInfo)
    console.log('- userInfo?.highestLevel:', userInfo?.highestLevel)
    console.log('- unlockedLevels:', unlockedLevels)
    console.log('- levelImages:', levelImages)
    console.log('- levelImages keys:', Object.keys(levelImages))
    console.log('- levelImages values:', Object.values(levelImages).map(url => url?.substring(0, 50)))
    console.log('- 本地存储 levelImages:', Taro.getStorageSync('levelImages'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 开始指定关卡
  const handleStartLevel = async (level: number) => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')

    if (!userInfo) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    // 检查关卡是否已解锁
    if (level > unlockedLevels) {
      Taro.showToast({ title: '该关卡尚未解锁', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '加载中...' })

      // 判断关卡类型
      const isCompleted = level <= userInfo.highestLevel  // 已过关
      const isChallenge = level === userInfo.highestLevel + 1  // 正在挑战

      let isFreeMode = false

      if (isChallenge) {
        // 正在挑战的关卡：正常模式（有倒计时，记录进度）
        isFreeMode = false
      } else if (isCompleted) {
        // 已过关的关卡：自由模式（无倒计时，不记录进度）
        isFreeMode = true
      } else {
        // 其他情况：自由模式
        isFreeMode = true
      }

      // 跳转到游戏页面，并传递 mode 参数
      const url = `/pages/game/index?mode=${isFreeMode ? 'free' : 'normal'}&level=${level}`
      Taro.hideLoading()
      Taro.redirectTo({ url })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '加载失败', icon: 'none' })
      console.error('加载关卡失败:', error)
    }
  }

  // 加载更多关卡
  const handleLoadMore = () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')
    setDisplayLevels(prev => prev + 10)
  }

  // 生成关卡数组
  const levels = Array.from({ length: displayLevels }, (_, i) => i + 1)

  return (
    <View className="level-select-page">
      <View className="level-grid">
        {levels.map((level) => {
          const isLocked = level > unlockedLevels
          const isCompleted = userInfo && level <= userInfo.highestLevel  // 已过关
          const isChallenge = userInfo && level === userInfo.highestLevel + 1  // 正在挑战
          // 优先使用用户保存的关卡图片，否则使用预加载的图片
          const savedImage = levelImages[level]
          const preloadedImage = levelImageMap[level]
          const levelImage = savedImage || (preloadedImage?.url)

          return (
            <View
              key={level}
              className={`level-item ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isLocked && handleStartLevel(level)}
            >
              {isLocked ? (
                // 锁定关卡显示锁图标
                <View className="locked-icon">
                  <Lock size={28} color="#9CA3AF" />
                </View>
              ) : isCompleted && levelImage ? (
                // 已过关显示缩略图（自由模式）
                <>
                  <Image
                    className="level-thumbnail"
                    src={levelImage}
                    mode="aspectFill"
                    lazyLoad  // 启用懒加载
                    onLoad={() => {
                      console.log(`✅ 关卡 ${level} 缩略图加载成功`)
                    }}
                    onError={(err) => {
                      console.error(`❌ 关卡 ${level} 缩略图加载失败:`, err)
                    }}
                  />
                  <View className="level-number-overlay">{level}</View>
                </>
              ) : isCompleted ? (
                // 已过关但没有图片（降级显示）
                <>
                  <Text className="block level-number">{level}</Text>
                  <Text className="block level-hint">自由模式</Text>
                  {console.log(`⚠️  关卡 ${level} 已完成但没有图片，savedImage: ${savedImage}, preloadedImage: ${preloadedImage?.url?.substring(0, 50)}`)}
                </>
              ) : isChallenge ? (
                // 正在挑战的关卡（正常模式，可挑战）
                <>
                  <Text className="block level-number">{level}</Text>
                  <Text className="block level-hint challenge">可挑战</Text>
                </>
              ) : (
                // 其他情况（自由模式）
                <>
                  <Text className="block level-number">{level}</Text>
                  <Text className="block level-hint">自由模式</Text>
                </>
              )}
              {isCompleted && <View className="completed-overlay">✓</View>}
            </View>
          )
        })}
      </View>

      <View className="load-more">
        <Button className="load-more-button" onClick={handleLoadMore}>
          加载更多
        </Button>
      </View>

      <View className="level-footer-hint">
        <Text className="block footer-hint-text">右滑屏幕返回首页</Text>
      </View>
    </View>
  )
}
