import { View, Text, Button, Switch } from '@tarojs/components'
import { X, Volume2, VolumeX, Bell, BellOff } from 'lucide-react-taro'
import { useSettingsStore } from '@/stores/settingsStore'
import './index.css'

interface SettingsModalProps {
  visible: boolean
  onClose: () => void
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration } = useSettingsStore()

  if (!visible) return null

  return (
    <View className="settings-modal-overlay" onClick={onClose}>
      <View className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <View className="settings-header">
          <Text className="block settings-title">设置</Text>
          <Button className="settings-close" onClick={onClose}>
            <X size={24} color="#6B7280" />
          </Button>
        </View>

        <View className="settings-content">
          {/* 音效设置 */}
          <View className="settings-item">
            <View className="settings-item-left">
              {soundEnabled ? (
                <Volume2 size={24} color="#3B82F6" />
              ) : (
                <VolumeX size={24} color="#9CA3AF" />
              )}
              <Text className="block settings-item-text">音效</Text>
            </View>
            <Switch
              checked={soundEnabled}
              onChange={() => toggleSound()}
              color="#3B82F6"
            />
          </View>

          {/* 震动设置 */}
          <View className="settings-item">
            <View className="settings-item-left">
              {vibrationEnabled ? (
                <Bell size={24} color="#3B82F6" />
              ) : (
                <BellOff size={24} color="#9CA3AF" />
              )}
              <Text className="block settings-item-text">震动</Text>
            </View>
            <Switch
              checked={vibrationEnabled}
              onChange={() => toggleVibration()}
              color="#3B82F6"
            />
          </View>
        </View>

        <View className="settings-footer">
          <Button className="settings-button" onClick={onClose}>
            关闭
          </Button>
        </View>
      </View>
    </View>
  )
}
