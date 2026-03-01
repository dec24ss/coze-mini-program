import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsModal from '@/components/settings-modal'
import { Play, Grid3x3, Trophy, Settings, LogOut, Star, Sparkles, Heart } from 'lucide-react-taro'
import './index.css'

export default function IndexPage() {
  const { userInfo, isLoggedIn, login, logout, checkUnlockedLevels, getCurrentLevel } = useUserStore()
  const { initSettings } = useSettingsStore()
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // 检查已解锁的关卡
    checkUnlockedLevels()
    // 初始化设置
    initSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const handleStartGame = async () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')

    if (!isLoggedIn) {
      Taro.showModal({
        title: '提示',
        content: '微信登录后可赢取积分、使用道具、查看排行榜，是否立即登录？',
        confirmText: '去登录',
        cancelText: '先玩玩',
        success: (res) => {
          if (res.confirm) {
            handleLogin()
          } else {
            Taro.navigateTo({ url: '/pages/game/index' })
          }
        }
      })
      return
    }

    // 获取当前应该开始的关卡（从上次未完成的关卡开始）
    const level = getCurrentLevel()
    console.log(`从第 ${level} 关开始游戏`)

    // 跳转到游戏页面（游戏页面会自动初始化并从最后未完成关卡开始）
    Taro.navigateTo({ url: '/pages/game/index' })
  }

  const handleLevelSelect = () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')

    if (!isLoggedIn) {
      Taro.showModal({
        title: '提示',
        content: '微信登录后可记录关卡进度，是否立即登录？',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            handleLogin()
          }
        }
      })
      return
    }
    Taro.navigateTo({ url: '/pages/level-select/index' })
  }

  const handleRankList = () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')

    if (!isLoggedIn) {
      Taro.showModal({
        title: '提示',
        content: '微信登录后可查看排行榜，是否立即登录？',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            handleLogin()
          }
        }
      })
      return
    }
    Taro.navigateTo({ url: '/pages/rank/index' })
  }

  const handleLogin = async () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')
    await login()
  }

  const handleLogout = () => {
    // 播放轻微震动
    const { playVibration } = useSettingsStore.getState()
    playVibration('light')

    Taro.showModal({
      title: '确认退出',
      content: '退出登录后将清除游戏进度，是否继续？',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }

  return (
    <View className="home-page">
      {/* 背景装饰元素 */}
      <View className="decoration decoration-star-1"><Star size={24} color="#FCD34D" /></View>
      <View className="decoration decoration-star-2"><Star size={20} color="#F472B6" /></View>
      <View className="decoration decoration-star-3"><Star size={28} color="#60A5FA" /></View>
      <View className="decoration decoration-sparkle-1"><Sparkles size={32} color="#FCD34D" /></View>
      <View className="decoration decoration-sparkle-2"><Sparkles size={24} color="#F472B6" /></View>
      <View className="decoration decoration-heart"><Heart size={28} color="#EF4444" /></View>

      <View className="home-content">
        {/* Logo 区域 */}
        <View className="logo-container">
          <View className="logo-icon">
            <Sparkles size={80} color="#3B82F6" />
          </View>
          <Text className="block home-title">海海拼图大作战</Text>
          <Text className="block home-subtitle">✨ 拖拽碎片，完成拼图 ✨</Text>
        </View>

        {/* 用户信息区域 - 仅登录后显示 */}
        {isLoggedIn && userInfo && (
          <View className="user-info">
            <View className="avatar-wrapper">
              {userInfo.avatarUrl && (
                <Image className="user-avatar" src={userInfo.avatarUrl} mode="aspectFill" />
              )}
              <View className="avatar-badge"><Star size={16} color="#FCD34D" /></View>
            </View>
            <Text className="block user-name">{userInfo.nickname}</Text>
            <Text className="block user-level">🏆 最高关卡：第{userInfo.highestLevel}关</Text>
          </View>
        )}

        {/* 功能按钮 */}
        <View className="button-group">
          <Button className="home-button primary" onClick={handleStartGame}>
            <View className="button-content">
              <Play size={32} color="white" />
              <Text className="block button-text">开始游戏</Text>
            </View>
          </Button>

          <Button className="home-button secondary" onClick={handleLevelSelect}>
            <View className="button-content">
              <Grid3x3 size={28} color="white" />
              <Text className="block button-text">关卡选择</Text>
            </View>
          </Button>

          <Button className="home-button tertiary" onClick={handleRankList}>
            <View className="button-content">
              <Trophy size={28} color="white" />
              <Text className="block button-text">排行榜</Text>
            </View>
          </Button>

          <Button className="home-button quaternary" onClick={() => setShowSettings(true)}>
            <View className="button-content">
              <Settings size={28} color="white" />
              <Text className="block button-text">设置</Text>
            </View>
          </Button>

          {isLoggedIn && (
            <Button className="home-button logout" onClick={handleLogout}>
              <View className="button-content">
                <LogOut size={28} color="white" />
                <Text className="block button-text">退出登录</Text>
              </View>
            </Button>
          )}
        </View>
      </View>

      {/* 设置弹窗 */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  )
}

