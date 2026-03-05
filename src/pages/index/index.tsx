import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { useUserStoreCloudbase } from '@/stores/userStore-cloudbase'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import SettingsModal from '@/components/settings-modal'
import UserProfileModal from '@/components/user-profile-modal'
import './index.css'

export default function IndexPage() {
  const { userInfo, isLoggedIn, login, logout, updateUserInfo, checkUnlockedLevels } = useUserStoreCloudbase()
  const { initSettings } = useSettingsStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  useEffect(() => {
    // 检查已解锁的关卡
    checkUnlockedLevels()
    // 初始化设置
    initSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, checkUnlockedLevels, initSettings])

  // 播放震动（提取公共逻辑）
  const playVibration = () => {
    useSettingsStore.getState().playVibration('light')
  }

  // 显示登录提示（提取公共逻辑）
  const showLoginPrompt = (content: string, callback?: () => void) => {
    Taro.showModal({
      title: '提示',
      content,
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          handleLogin()
        } else if (callback) {
          callback()
        }
      }
    })
  }

  const handleStartGame = async () => {
    playVibration()

    if (!isLoggedIn) {
      showLoginPrompt('微信登录后可赢取积分、使用道具、查看排行榜，是否立即登录？', async () => {
        await startGameWithPreload()
      })
      return
    }

    await startGameWithPreload()
  }

  // 确保图片预加载完成后再跳转
  const startGameWithPreload = async () => {
    const { isImagesPreloaded, preloadImages } = useGameStore.getState()
    const { getCurrentLevel } = useUserStoreCloudbase.getState()

    if (!isImagesPreloaded) {
      console.log('图片未预加载，开始预加载...')
      Taro.showLoading({ title: '加载中...', mask: true })
      try {
        await preloadImages()
        console.log('图片预加载完成')
      } catch (error) {
        console.error('图片预加载失败:', error)
      }
      Taro.hideLoading()
    }

    // 获取当前关卡并传递给游戏页面
    const level = getCurrentLevel()
    console.log(`🎮 从第 ${level} 关开始游戏`)
    Taro.navigateTo({ url: `/pages/game/index?level=${level}` })
  }

  const handleLevelSelect = () => {
    playVibration()

    if (!isLoggedIn) {
      showLoginPrompt('微信登录后可记录关卡进度，是否立即登录？')
      return
    }
    Taro.navigateTo({ url: '/pages/level-select/index' })
  }

  const handleRankList = () => {
    playVibration()

    if (!isLoggedIn) {
      showLoginPrompt('微信登录后可查看排行榜，是否立即登录？')
      return
    }
    Taro.navigateTo({ url: '/pages/rank/index' })
  }

  const handleLogin = async () => {
    playVibration()

    try {
      await login()

      const { isLoggedIn: isNowLoggedIn, userInfo: currentUser } = useUserStoreCloudbase.getState()

      if (isNowLoggedIn && currentUser) {
        const needSetProfile = !currentUser.avatarUrl || 
                              currentUser.nickname === '拼图玩家' || 
                              currentUser.nickname === '微信用户'
        
        if (needSetProfile) {
          setShowUserProfile(true)
        }
      }
    } catch (error) {
      console.error('登录过程出错:', error)
      Taro.showToast({ title: '登录失败，请稍后重试', icon: 'none' })
    }
  }

  const handleSaveUserProfile = (nickname: string, avatarUrl: string) => {
    updateUserInfo(nickname, avatarUrl)
  }

  const handleLogout = () => {
    playVibration()

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

