import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsModal from '@/components/settings-modal'
import UserProfileModal from '@/components/user-profile-modal'
import './index.css'

export default function IndexPage() {
  const { userInfo, isLoggedIn, login, logout, updateUserInfo, checkUnlockedLevels, getCurrentLevel } = useUserStore()
  const { initSettings } = useSettingsStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  useEffect(() => {
    // 检查已解锁的关卡
    checkUnlockedLevels()
    // 初始化设置
    initSettings()
    // 依赖登录状态变化时重新检查关卡
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

    // 先调用微信登录
    await login()

    // 登录成功后显示用户信息设置弹窗
    const { isLoggedIn: isNowLoggedIn } = useUserStore.getState()
    if (isNowLoggedIn) {
      setShowUserProfile(true)
    }
  }

  const handleSaveUserProfile = (nickname: string, avatarUrl: string) => {
    updateUserInfo(nickname, avatarUrl)
    console.log('用户信息已保存:', nickname, avatarUrl)
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
      <View className="home-content">
        <Text className="block home-title">海海拼图大作战</Text>
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
          <Button className="home-button primary" onClick={handleStartGame}>
            开始游戏
          </Button>
          <Button
            className="home-button"
            onClick={handleLevelSelect}
          >
            关卡选择
          </Button>
          <Button
            className="home-button"
            onClick={handleRankList}
          >
            排行榜
          </Button>
          {/* 设置按钮 - 在排行榜下面 */}
          <Button
            className="home-button"
            onClick={() => setShowSettings(true)}
          >
            设置
          </Button>
          {isLoggedIn && (
            <Button
              className="home-button logout"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          )}
        </View>
      </View>

      {/* 设置弹窗 */}
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* 用户信息设置弹窗 */}
      <UserProfileModal
        visible={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        onSave={handleSaveUserProfile}
        initialNickname={userInfo?.nickname || ''}
        initialAvatarUrl={userInfo?.avatarUrl || ''}
      />
    </View>
  )
}

