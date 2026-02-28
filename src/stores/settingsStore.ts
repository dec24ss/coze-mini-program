import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 设置状态
interface SettingsState {
  soundEnabled: boolean      // 音效开关
  vibrationEnabled: boolean  // 震动开关

  // 动作方法
  toggleSound: () => void
  toggleVibration: () => void
  loadSettings: () => void
}

// 创建设置 store
export const useSettingsStore = create<SettingsState>((set) => ({
  // 初始状态
  soundEnabled: true,
  vibrationEnabled: true,

  // 切换音效
  toggleSound: () => {
    const newSoundEnabled = !useSettingsStore.getState().soundEnabled
    set({ soundEnabled: newSoundEnabled })
    // 保存到本地存储
    Taro.setStorageSync('soundEnabled', newSoundEnabled.toString())
  },

  // 切换震动
  toggleVibration: () => {
    const newVibrationEnabled = !useSettingsStore.getState().vibrationEnabled
    set({ vibrationEnabled: newVibrationEnabled })
    // 保存到本地存储
    Taro.setStorageSync('vibrationEnabled', newVibrationEnabled.toString())
  },

  // 加载设置
  loadSettings: () => {
    const savedSoundEnabled = Taro.getStorageSync('soundEnabled')
    const savedVibrationEnabled = Taro.getStorageSync('vibrationEnabled')

    set({
      soundEnabled: savedSoundEnabled ? savedSoundEnabled === 'true' : true,
      vibrationEnabled: savedVibrationEnabled ? savedVibrationEnabled === 'true' : true
    })
  }
}))
