import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsModal from '@/components/settings-modal'
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
    <View className="home-page page-enter">
      {/* 背景层：海洋渐变 */}
      <View className="home-background" />

      {/* 海浪动画层 */}
      <View className="wave wave-back" />
      <View className="wave wave-front" />

      {/* 漂浮装饰 */}
      <View className="floating-decorations">
        {/* 拼图块装饰 */}
        <View className="decoration puzzle-decoration-1 float-animation" />
        <View className="decoration puzzle-decoration-2 float-animation" style={{ animationDelay: '0.5s' }} />
        <View className="decoration puzzle-decoration-3 float-animation" style={{ animationDelay: '1s' }} />

        {/* 小鱼装饰 */}
        <View className="decoration fish-decoration-1 float-animation" style={{ animationDelay: '0.3s' }} />
        <View className="decoration fish-decoration-2 float-animation" style={{ animationDelay: '0.8s' }} />

        {/* 贝壳装饰 */}
        <View className="decoration shell-decoration-1 float-animation" style={{ animationDelay: '0.6s' }} />
        <View className="decoration shell-decoration-2 float-animation" style={{ animationDelay: '1.2s' }} />
      </View>

      {/* 主内容区 */}
      <View className="home-content">
        {/* 卡通标题 */}
        <Text className="block home-title">🌊 海海拼图大作战</Text>
        <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>

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
          {/* 开始游戏按钮 */}
          <Button
            className="home-button home-button-start"
            onClick={handleStartGame}
          >
            <View className="button-icon button-icon-puzzle" />
            <Text className="block button-text">开始游戏</Text>
          </Button>

          {/* 关卡选择按钮 */}
          <Button
            className="home-button home-button-level"
            onClick={handleLevelSelect}
          >
            <View className="button-icon button-icon-shell" />
            <Text className="block button-text">关卡选择</Text>
          </Button>

          {/* 排行榜按钮 */}
          <Button
            className="home-button home-button-rank"
            onClick={handleRankList}
          >
            <View className="button-icon button-icon-trophy" />
            <Text className="block button-text">排行榜</Text>
          </Button>

          {/* 设置按钮 */}
          <Button
            className="home-button home-button-settings"
            onClick={() => setShowSettings(true)}
          >
            <View className="button-icon button-icon-gear" />
            <Text className="block button-text">设置</Text>
          </Button>

          {/* 退出登录按钮 - 仅登录后显示 */}
          {isLoggedIn && (
            <Button
              className="home-button home-button-logout"
              onClick={handleLogout}
            >
              <View className="button-icon button-icon-logout" />
              <Text className="block button-text">退出登录</Text>
            </Button>
          )}
        </View>
      </View>

      {/* 设置弹窗 */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  )
}
