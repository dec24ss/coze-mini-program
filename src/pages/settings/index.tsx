import { View, Text, Button, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { soundManager } from '@/utils/soundManager'
import './index.css'

export default function SettingsPage() {
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration, loadSettings } = useSettingsStore()

  useEffect(() => {
    loadSettings()
    // 同步 soundManager 的状态
    soundManager.setEnabled(soundEnabled)
  }, [loadSettings, soundEnabled])

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleTestSound = () => {
    if (soundEnabled) {
      // 播放测试音效
      soundManager.play('click')
      Taro.showToast({ title: '音效已开启', icon: 'success' })
    } else {
      Taro.showToast({ title: '音效已关闭', icon: 'none' })
    }
  }

  const handleTestVibration = () => {
    if (vibrationEnabled) {
      Taro.vibrateShort()
      Taro.showToast({ title: '震动已开启', icon: 'success' })
    } else {
      Taro.showToast({ title: '震动已关闭', icon: 'none' })
    }
  }

  return (
    <View className="settings-page">
      <View className="settings-header">
        <Text className="block settings-title">游戏设置</Text>
      </View>

      <View className="settings-list">
        {/* 音效设置 */}
        <View className="settings-item">
          <View className="settings-item-content">
            <Text className="block settings-item-label">音效</Text>
            <Text className="block settings-item-desc">开启后播放游戏音效</Text>
          </View>
          <Switch
            checked={soundEnabled}
            onChange={toggleSound}
            color="#3B82F6"
          />
        </View>

        {/* 震动设置 */}
        <View className="settings-item">
          <View className="settings-item-content">
            <Text className="block settings-item-label">震动</Text>
            <Text className="block settings-item-desc">开启后震动反馈</Text>
          </View>
          <Switch
            checked={vibrationEnabled}
            onChange={toggleVibration}
            color="#3B82F6"
          />
        </View>
      </View>

      {/* 测试区域 */}
      <View className="settings-test">
        <Text className="block settings-test-title">测试</Text>
        <View className="test-buttons">
          <Button className="test-button" onClick={handleTestSound}>
            测试音效
          </Button>
          <Button className="test-button" onClick={handleTestVibration}>
            测试震动
          </Button>
        </View>
      </View>

      <View className="settings-footer">
        <Button className="back-button" onClick={handleBack}>
          返回
        </Button>
      </View>
    </View>
  )
}
