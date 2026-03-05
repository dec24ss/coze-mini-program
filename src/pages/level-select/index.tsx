import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useGameStore } from '@/stores/gameStore'
import { useUserStoreCloudbase } from '@/stores/userStore-cloudbase'
import { ChevronRight, Play } from 'lucide-react-taro'
import './index.css'

// 难度配置
interface DifficultyConfig {
  id: string
  name: string
  gridSize: number
  description: string
  timeLimit?: number  // 倒计时（秒），undefined表示不倒计时
  color: string
  bgColor: string
}

const DIFFICULTIES: DifficultyConfig[] = [
  {
    id: 'easy',
    name: '简单模式',
    gridSize: 3,
    description: '3×3 网格，适合新手',
    timeLimit: 60,
    color: '#93C5FD',
    bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)'
  },
  {
    id: 'beginner',
    name: '入门模式',
    gridSize: 4,
    description: '4×4 网格，轻松挑战',
    timeLimit: 120,
    color: '#60A5FA',
    bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
  },
  {
    id: 'normal',
    name: '普通模式',
    gridSize: 5,
    description: '5×5 网格，挑战性适中',
    timeLimit: 180,
    color: '#3B82F6',
    bgColor: 'linear-gradient(135deg, #BFDBFE 0%, #93C5FD 100%)'
  },
  {
    id: 'hard',
    name: '困难模式',
    gridSize: 6,
    description: '6×6 网格，考验观察力',
    timeLimit: 240,
    color: '#2563EB',
    bgColor: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)'
  },
  {
    id: 'expert',
    name: '专家模式',
    gridSize: 7,
    description: '7×7 网格，大师级挑战',
    timeLimit: 300,
    color: '#1D4ED8',
    bgColor: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
  },
  {
    id: 'master',
    name: '大师模式',
    gridSize: 8,
    description: '8×8 网格，极限挑战',
    timeLimit: 360,
    color: '#1E40AF',
    bgColor: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  }
]

export default function DifficultySelectPage() {
  const { initSettings, playVibration } = useSettingsStore()
  const { isImagesPreloaded, preloadImages, startFreePlayMode } = useGameStore()
  const { isLoggedIn } = useUserStoreCloudbase()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 初始化设置
    initSettings()
  }, [initSettings])

  // 确保图片预加载完成
  const ensurePreloaded = async () => {
    if (!isImagesPreloaded) {
      console.log('图片未预加载，开始预加载...')
      setIsLoading(true)
      try {
        await preloadImages()
        console.log('图片预加载完成')
      } catch (error) {
        console.error('图片预加载失败:', error)
        Taro.showToast({ title: '图片加载失败', icon: 'none' })
        return false
      } finally {
        setIsLoading(false)
      }
    }
    return true
  }

  // 开始游戏
  const handleStartGame = async (difficulty: DifficultyConfig) => {
    playVibration('light')

    // 检查是否登录（可选，自由模式可以不登录）
    if (!isLoggedIn) {
      Taro.showModal({
        title: '提示',
        content: '登录后可记录游戏进度，是否立即登录？',
        confirmText: '去登录',
        cancelText: '直接开始',
        success: (res) => {
          if (res.confirm) {
            // 跳转到首页登录
            Taro.switchTab({ url: '/pages/index/index' })
          } else {
            // 直接开始游戏
            startGame(difficulty)
          }
        }
      })
      return
    }

    // 直接开始游戏
    startGame(difficulty)
  }

  const startGame = async (difficulty: DifficultyConfig) => {
    // 确保图片已预加载
    const preloaded = await ensurePreloaded()
    if (!preloaded) return

    try {
      Taro.showLoading({ title: '加载中...', mask: true })

      // 随机选择一个关卡号（1-100）
      const randomLevel = Math.floor(Math.random() * 100) + 1

      // 使用自由游玩模式（不倒计时）
      await startFreePlayMode(randomLevel)

      // 临时修改难度配置
      const state = useGameStore.getState()
      state.gridSize = difficulty.gridSize

      Taro.hideLoading()
      Taro.showToast({ title: '开始游戏！', icon: 'success', duration: 1000 })
    } catch (error) {
      Taro.hideLoading()
      console.error('开始游戏失败:', error)
      Taro.showToast({ title: '启动失败，请重试', icon: 'none' })
    }
  }

  return (
    <View className="difficulty-select-page">
      <View className="difficulty-header">
        <Text className="block header-title">选择难度</Text>
        <Text className="block header-subtitle">自由模式，无倒计时，畅享拼图乐趣</Text>
      </View>

      <ScrollView className="difficulty-scroll" scrollY>
        <View className="difficulty-list">
          {DIFFICULTIES.map((difficulty) => (
            <View
              key={difficulty.id}
              className="difficulty-item"
              style={{ background: difficulty.bgColor }}
              onClick={() => handleStartGame(difficulty)}
            >
              <View className="difficulty-content">
                <View className="difficulty-icon">
                  <Play size={32} color={difficulty.color} />
                </View>
                <View className="difficulty-info">
                  <Text className="block difficulty-name">{difficulty.name}</Text>
                  <Text className="block difficulty-description">{difficulty.description}</Text>
                  <Text className="block difficulty-grid-size">
                    网格：{difficulty.gridSize}×{difficulty.gridSize}
                  </Text>
                </View>
                <View className="difficulty-arrow">
                  <ChevronRight size={24} color={difficulty.color} />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="difficulty-footer">
          <Text className="block footer-hint-text">右滑屏幕返回首页</Text>
        </View>
      </ScrollView>

      {isLoading && (
        <View className="loading-overlay">
          <Text className="block loading-text">加载图片中...</Text>
        </View>
      )}
    </View>
  )
}
