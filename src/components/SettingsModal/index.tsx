import { View, Text, Button, Switch } from '@tarojs/components'
import { useSettingsStore } from '@/stores/settingsStore'
import { Volume2, VolumeX, Smartphone, SmartphoneOff, Sparkles, SparklesOff } from 'lucide-react'
import { playSound } from '@/utils/sound'
import './index.css'

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { soundEnabled, vibrationEnabled, effectsEnabled, toggleSound, toggleVibration, toggleEffects } = useSettingsStore()

  const handleClose = () => {
    playSound('button')
    onClose()
  }

  return (
    <View className="settings-overlay" onClick={handleClose}>
      <View className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <View className="settings-header">
          <Text className="block settings-title">游戏设置</Text>
          <Button className="close-button" onClick={handleClose}>✕</Button>
        </View>

        <View className="settings-content">
          {/* 音效开关 */}
          <View className="settings-item">
            <View className="settings-item-left">
              {soundEnabled ? <Volume2 size={32} color="#3B82F6" /> : <VolumeX size={32} color="#9CA3AF" />}
              <View className="settings-item-text">
                <Text className="block settings-item-title">音效</Text>
                <Text className="block settings-item-desc">开启/关闭游戏音效</Text>
              </View>
            </View>
            <Switch
              checked={soundEnabled}
              onChange={toggleSound}
              color="#3B82F6"
              className="settings-switch"
            />
          </View>

          {/* 震动开关 */}
          <View className="settings-item">
            <View className="settings-item-left">
              {vibrationEnabled ? <Smartphone size={32} color="#3B82F6" /> : <SmartphoneOff size={32} color="#9CA3AF" />}
              <View className="settings-item-text">
                <Text className="block settings-item-title">震动</Text>
                <Text className="block settings-item-desc">开启/关闭游戏震动</Text>
              </View>
            </View>
            <Switch
              checked={vibrationEnabled}
              onChange={toggleVibration}
              color="#3B82F6"
              className="settings-switch"
            />
          </View>

          {/* 特效开关 */}
          <View className="settings-item">
            <View className="settings-item-left">
              {effectsEnabled ? <Sparkles size={32} color="#3B82F6" /> : <SparklesOff size={32} color="#9CA3AF" />}
              <View className="settings-item-text">
                <Text className="block settings-item-title">特效</Text>
                <Text className="block settings-item-desc">开启/关闭动画特效</Text>
              </View>
            </View>
            <Switch
              checked={effectsEnabled}
              onChange={toggleEffects}
              color="#3B82F6"
              className="settings-switch"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
