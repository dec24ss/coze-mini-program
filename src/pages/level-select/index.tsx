import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Lock, Star, ChevronDown, Trophy, Sparkles, ArrowLeft } from 'lucide-react-taro'
import './index.css'

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded } = useGameStore()
  const { userInfo, isLoggedIn, unlockedLevels, levelImages } = useUserStore()
  const { initSettings } = useSettingsStore()
  const [displayLevels, setDisplayLevels] = useState(20)  // 默认显示20关

  useEffect(() => {
    // 如果图片未预加载，跳回首页
    if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
      Taro.showToast({ title: '请先开始游戏', icon: 'none' })
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 1500)
    }
    // 初始化设置
    initSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImagesPreloaded, levelImageMap])

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

  // 返回首页
  const handleBackHome = () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')
    Taro.redirectTo({ url: '/pages/index/index' })
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
      <View className="level-header">
        <View className="header-icon"><Trophy size={48} color="#F59E0B" /></View>
        <Text className="block level-title">选择关卡</Text>
        {isLoggedIn && userInfo && (
          <View className="level-subtitle-wrapper">
            <View className="subtitle-item">
              <Star size={16} color="#FCD34D" />
              <Text className="block level-subtitle">
                最高：第{userInfo.highestLevel}关
              </Text>
            </View>
            <View className="subtitle-item">
              <Sparkles size={16} color="#60A5FA" />
              <Text className="block level-subtitle">
                已解锁：第{unlockedLevels}关
              </Text>
            </View>
          </View>
        )}
      </View>

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
                  <Lock size={32} color="#D1D5DB" />
                </View>
              ) : isCompleted && levelImage ? (
                // 已过关显示缩略图（自由模式）
                <>
                  <Image
                    className="level-thumbnail"
                    src={levelImage}
                    mode="aspectFill"
                  />
                  <View className="level-number-overlay">
                    <Star size={24} color="#FCD34D" />
                    <Text className="block">{level}</Text>
                  </View>
                  <View className="completed-badge"><Star size={20} color="#FCD34D" /></View>
                </>
              ) : isChallenge ? (
                // 正在挑战的关卡（正常模式，可挑战）
                <>
                  <Text className="block level-number challenge">{level}</Text>
                  <View className="level-hint-wrapper challenge">
                    <Sparkles size={20} color="#F59E0B" />
                    <Text className="block level-hint challenge">可挑战</Text>
                  </View>
                </>
              ) : (
                // 其他情况（自由模式）
                <>
                  <Text className="block level-number">{level}</Text>
                  <View className="level-hint-wrapper">
                    <Sparkles size={16} color="#60A5FA" />
                    <Text className="block level-hint">自由模式</Text>
                  </View>
                </>
              )}
            </View>
          )
        })}
      </View>

      <View className="load-more">
        <Button className="load-more-button" onClick={handleLoadMore}>
          <View className="button-content">
            <ChevronDown size={24} color="white" />
            <Text className="block">加载更多</Text>
          </View>
        </Button>
      </View>

      <View className="level-footer">
        <Button className="footer-button" onClick={handleBackHome}>
          <View className="button-content">
            <ArrowLeft size={24} color="white" />
            <Text className="block">返回首页</Text>
          </View>
        </Button>
      </View>
    </View>
  )
}
