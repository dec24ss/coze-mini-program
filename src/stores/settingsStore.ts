import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 设置状态
interface SettingsState {
  soundEnabled: boolean      // 音效开关
  vibrationEnabled: boolean  // 震动开关
  effectsEnabled: boolean    // 特效开关

  // 动作方法
  toggleSound: () => void
  toggleVibration: () => void
  toggleEffects: () => void
  setSoundEnabled: (enabled: boolean) => void
  setVibrationEnabled: (enabled: boolean) => void
  setEffectsEnabled: (enabled: boolean) => void
}

// 从本地存储加载设置
const loadSettings = () => {
  try {
    const soundEnabled = Taro.getStorageSync('soundEnabled')
    const vibrationEnabled = Taro.getStorageSync('vibrationEnabled')
    const effectsEnabled = Taro.getStorageSync('effectsEnabled')

    return {
      soundEnabled: soundEnabled === '' ? true : soundEnabled === 'true',
      vibrationEnabled: vibrationEnabled === '' ? true : vibrationEnabled === 'true',
      effectsEnabled: effectsEnabled === '' ? true : effectsEnabled === 'true'
    }
  } catch (error) {
    return {
      soundEnabled: true,
      vibrationEnabled: true,
      effectsEnabled: true
    }
  }
}

// 创建设置store
export const useSettingsStore = create<SettingsState>((set) => {
  const savedSettings = loadSettings()

  return {
    ...savedSettings,

    toggleSound: () => {
      set((state) => {
        const newValue = !state.soundEnabled
        Taro.setStorageSync('soundEnabled', newValue.toString())
        return { soundEnabled: newValue }
      })
    },

    toggleVibration: () => {
      set((state) => {
        const newValue = !state.vibrationEnabled
        Taro.setStorageSync('vibrationEnabled', newValue.toString())
        return { vibrationEnabled: newValue }
      })
    },

    toggleEffects: () => {
      set((state) => {
        const newValue = !state.effectsEnabled
        Taro.setStorageSync('effectsEnabled', newValue.toString())
        return { effectsEnabled: newValue }
      })
    },

    setSoundEnabled: (enabled: boolean) => {
      set({ soundEnabled: enabled })
      Taro.setStorageSync('soundEnabled', enabled.toString())
    },

    setVibrationEnabled: (enabled: boolean) => {
      set({ vibrationEnabled: enabled })
      Taro.setStorageSync('vibrationEnabled', enabled.toString())
    },

    setEffectsEnabled: (enabled: boolean) => {
      set({ effectsEnabled: enabled })
      Taro.setStorageSync('effectsEnabled', enabled.toString())
    }
  }
})
