import { View, Text, Button, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { getEnvInfo, logEnvInfo } from '@/config/env'
import { clearAllCache, clearAppCache, logCacheInfo, formatCacheSize, getCacheSize, CACHE_KEYS } from '@/utils/cache'
import './index.css'

export default function DevToolsPage() {
  const [envInfo, setEnvInfo] = useState(getEnvInfo())
  const [cacheSize, setCacheSize] = useState(getCacheSize())

  // 刷新环境信息
  const handleRefresh = () => {
    setEnvInfo(getEnvInfo())
    setCacheSize(getCacheSize())
    logEnvInfo()
    logCacheInfo()
    Taro.showToast({ title: '已刷新', icon: 'success' })
  }

  // 清除所有缓存
  const handleClearAllCache = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存吗？这将清除所有数据包括用户进度！',
      success: (res) => {
        if (res.confirm) {
          clearAllCache()
          setCacheSize(getCacheSize())
          Taro.showToast({ title: '所有缓存已清除', icon: 'success' })
        }
      }
    })
  }

  // 清除应用缓存（保留用户数据）
  const handleClearAppCache = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除应用缓存吗？这将清除图片和设置，但保留用户进度。',
      success: (res) => {
        if (res.confirm) {
          clearAppCache(true)
          setCacheSize(getCacheSize())
          Taro.showToast({ title: '应用缓存已清除', icon: 'success' })
        }
      }
    })
  }

  // 清除图片缓存
  const handleClearImageCache = () => {
    Taro.removeStorageSync(CACHE_KEYS.IMAGE_LIST)
    Taro.removeStorageSync(CACHE_KEYS.LEVEL_IMAGE_MAP)
    Taro.removeStorageSync(CACHE_KEYS.IMAGE_VERSION)
    setCacheSize(getCacheSize())
    Taro.showToast({ title: '图片缓存已清除', icon: 'success' })
  }

  // 清除用户数据
  const handleClearUserData = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除用户数据吗？这将清除登录信息和游戏进度！',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync(CACHE_KEYS.OPENID)
          Taro.removeStorageSync(CACHE_KEYS.USER_INFO)
          Taro.removeStorageSync(CACHE_KEYS.HIGHEST_LEVEL)
          Taro.removeStorageSync(CACHE_KEYS.UNLOCKED_LEVELS)
          Taro.removeStorageSync(CACHE_KEYS.POINTS)
          Taro.removeStorageSync(CACHE_KEYS.LEVEL_IMAGES)
          setCacheSize(getCacheSize())
          Taro.showToast({ title: '用户数据已清除', icon: 'success' })
        }
      }
    })
  }

  // 查看日志
  const handleViewLogs = () => {
    Taro.showModal({
      title: '提示',
      content: '请在微信开发者工具的控制台查看详细日志',
      showCancel: false
    })
  }

  // 返回首页
  const handleBackHome = () => {
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  // 环境类型颜色映射
  const getEnvTypeColor = (type: string) => {
    switch (type) {
      case 'development':
        return '#52c41a'  // 绿色
      case 'preview':
        return '#faad14'  // 橙色
      case 'production':
        return '#f5222d'  // 红色
      default:
        return '#999'
    }
  }

  return (
    <ScrollView scrollY className="dev-tools-page">
      <View className="dev-tools-container">
        {/* 环境信息卡片 */}
        <View className="info-card">
          <Text className="block card-title">📦 环境信息</Text>

          <View className="info-row">
            <Text className="block info-label">环境类型</Text>
            <Text
              className="block info-value"
              style={{ color: getEnvTypeColor(envInfo.type) }}
            >
              {envInfo.type.toUpperCase()}
            </Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">应用版本</Text>
            <Text className="block info-value">{envInfo.version}</Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">构建时间</Text>
            <Text className="block info-value">{envInfo.buildTime}</Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">API 地址</Text>
            <Text className="block info-value text-sm">{envInfo.apiBaseUrl}</Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">调试模式</Text>
            <Text className="block info-value">{envInfo.enableDebug ? '✅ 开启' : '❌ 关闭'}</Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">本地开发</Text>
            <Text className="block info-value">{envInfo.isLocalDev ? '✅ 是' : '❌ 否'}</Text>
          </View>
        </View>

        {/* 缓存信息卡片 */}
        <View className="info-card">
          <Text className="block card-title">💾 缓存信息</Text>

          <View className="info-row">
            <Text className="block info-label">缓存大小</Text>
            <Text className="block info-value">{formatCacheSize(cacheSize)}</Text>
          </View>

          <View className="info-row">
            <Text className="block info-label">缓存状态</Text>
            <Text className="block info-value">
              {cacheSize > 10 * 1024 * 1024 ? '⚠️ 较大' : '✅ 正常'}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="action-section">
          <Text className="block section-title">🛠️  缓存管理</Text>

          <Button
            className="action-button secondary"
            onClick={handleClearImageCache}
          >
            清除图片缓存
          </Button>

          <Button
            className="action-button secondary"
            onClick={handleClearAppCache}
          >
            清除应用缓存（保留用户数据）
          </Button>

          <Button
            className="action-button warning"
            onClick={handleClearUserData}
          >
            清除用户数据
          </Button>

          <Button
            className="action-button danger"
            onClick={handleClearAllCache}
          >
            清除所有缓存（危险操作）
          </Button>

          <Text className="block section-title mt-6">🔍  调试工具</Text>

          <Button
            className="action-button primary"
            onClick={handleRefresh}
          >
            刷新信息
          </Button>

          <Button
            className="action-button primary"
            onClick={handleViewLogs}
          >
            查看日志（开发者工具）
          </Button>

          <Button
            className="action-button primary"
            onClick={handleBackHome}
          >
            返回首页
          </Button>
        </View>

        {/* 提示信息 */}
        <View className="tips-section">
          <Text className="block tips-title">💡 使用提示</Text>
          <Text className="block tips-text">
            1. 部署后请先清除缓存，确保使用最新代码
          </Text>
          <Text className="block tips-text">
            2. 遇到问题时，先查看日志和缓存信息
          </Text>
          <Text className="block tips-text">
            3. 环境类型：development（开发）、preview（预览）、production（正式）
          </Text>
          <Text className="block tips-text">
            4. 本地开发时，真机预览使用的是本地代码
          </Text>
          <Text className="block tips-text">
            5. 部署后，开发版使用的是构建后的代码
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
