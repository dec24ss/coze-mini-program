import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsModal from '@/components/settings-modal'
import {
  PuzzleIcon,
  ShellIcon,
  TrophyIcon,
  SettingsIcon,
  FishIcon,
  BubbleIcon,
  CrabIcon
} from '@/components/ocean-icons'
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

    // 跳转到游戏页面
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
      {/* 背景层 */}
      <View className="home-background">
        {/* 天空渐变 */}
        <View className="home-sky" />

        {/* 海浪动画层 */}
        <View className="home-wave wave-1" />
        <View className="home-wave wave-2" />

        {/* 漂浮装饰元素 */}
        <View className="floating-elements">
          <View className="floating-element element-1">
            <PuzzleIcon size={40} color="#007AFF" opacity={0.3} />
          </View>
          <View className="floating-element element-2">
            <FishIcon size={36} color="#FF9500" opacity={0.4} />
          </View>
          <View className="floating-element element-3">
            <ShellIcon size={32} color="#FFB6C1" opacity={0.35} />
          </View>
          <View className="floating-element element-4">
            <BubbleIcon size={28} color="#007AFF" opacity={0.3} />
          </View>
          <View className="floating-element element-5">
            <CrabIcon size={32} color="#FF9500" opacity={0.35} />
          </View>
          <View className="floating-element element-6">
            <FishIcon size={28} color="#007AFF" opacity={0.3} />
          </View>
          <View className="floating-element element-7">
            <ShellIcon size={24} color="#FF9500" opacity={0.3} />
          </View>
          <View className="floating-element element-8">
            <BubbleIcon size={32} color="#FFB6C1" opacity={0.35} />
          </View>
        </View>

        {/* 底部海浪装饰 */}
        <View className="home-bottom-wave" />
      </View>

      {/* 主内容 */}
      <View className="home-content">
        {/* 标题区 */}
        <View className="home-title-area">
          <Text className="block home-title">海海拼图大作战</Text>
          <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>
        </View>

        {/* 用户信息区域 - 仅登录后显示 */}
        {isLoggedIn && userInfo && (
          <View className="user-info">
            {userInfo.avatarUrl && (
              <Image className="user-avatar" src={userInfo.avatarUrl} mode="aspectFill" />
            )}
            <Text className="block user-name">{userInfo.nickname}</Text>
            <Text className="block user-level">最高关卡：第{userInfo.highestLevel}关</Text>
          </View>
        )}

        {/* 功能按钮 */}
        <View className="button-group">
          {/* 开始游戏 - 橙色渐变 */}
          <Button className="home-button button-primary" onClick={handleStartGame}>
            <View className="button-icon">
              <PuzzleIcon size={48} color="white" />
            </View>
            <Text className="button-text">开始游戏</Text>
          </Button>

          {/* 关卡选择 - 海洋蓝渐变 */}
          <Button className="home-button button-ocean" onClick={handleLevelSelect}>
            <View className="button-icon">
              <ShellIcon size={48} color="white" />
            </View>
            <Text className="button-text">关卡选择</Text>
          </Button>

          {/* 排行榜 - 草绿渐变 */}
          <Button className="home-button button-green" onClick={handleRankList}>
            <View className="button-icon">
              <TrophyIcon size={48} color="white" />
            </View>
            <Text className="button-text">排行榜</Text>
          </Button>

          {/* 设置 - 沙滩黄渐变 */}
          <Button className="home-button button-sand" onClick={() => setShowSettings(true)}>
            <View className="button-icon">
              <SettingsIcon size={48} color="#333333" />
            </View>
            <Text className="button-text button-text-dark">设置</Text>
          </Button>

          {/* 退出登录 - 仅登录后显示 */}
          {isLoggedIn && (
            <Button className="home-button button-logout" onClick={handleLogout}>
              <Text className="button-text">退出登录</Text>
            </Button>
          )}
        </View>
      </View>

      {/* 设置弹窗 */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  )
}
