import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 设置状态
interface SettingsState {
  soundEnabled: boolean    // 音效开关
  vibrationEnabled: boolean  // 震动开关

  // 方法
  initSettings: () => void
  toggleSound: () => void
  toggleVibration: () => void
  playSound: (type: 'success' | 'error' | 'click' | 'swap') => void
  playVibration: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void
}

// 创建设置 store
export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  vibrationEnabled: true,

  // 初始化设置
  initSettings: () => {
    const soundEnabled = Taro.getStorageSync('soundEnabled')
    const vibrationEnabled = Taro.getStorageSync('vibrationEnabled')

    set({
      soundEnabled: soundEnabled === '' ? true : soundEnabled !== 'false',
      vibrationEnabled: vibrationEnabled === '' ? true : vibrationEnabled !== 'false'
    })
  },

  // 切换音效
  toggleSound: () => {
    const newValue = !get().soundEnabled
    set({ soundEnabled: newValue })
    Taro.setStorageSync('soundEnabled', newValue.toString())
  },

  // 切换震动
  toggleVibration: () => {
    const newValue = !get().vibrationEnabled
    set({ vibrationEnabled: newValue })
    Taro.setStorageSync('vibrationEnabled', newValue.toString())
  },

  // 播放音效（使用系统提示音模拟）
  playSound: (type: 'success' | 'error' | 'click' | 'swap') => {
    const { soundEnabled } = get()
    if (!soundEnabled) return

    // 尝试播放系统音效
    try {
      // 使用小程序震动反馈作为音效替代
      // 实际项目中可以使用 Taro.createInnerAudioContext 播放自定义音效
      switch (type) {
        case 'success':
          Taro.vibrateShort({ type: 'light' })
          break
        case 'error':
          Taro.vibrateShort({ type: 'heavy' })
          break
        case 'click':
          Taro.vibrateShort({ type: 'light' })
          break
        case 'swap':
          Taro.vibrateShort({ type: 'medium' })
          break
      }
    } catch (e) {
      console.log('播放音效失败:', e)
    }
  },

  // 播放震动
  playVibration: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    const { vibrationEnabled } = get()
    if (!vibrationEnabled) return

    try {
      switch (type) {
        case 'light':
          Taro.vibrateShort({ type: 'light' })
          break
        case 'medium':
          Taro.vibrateShort({ type: 'medium' })
          break
        case 'heavy':
          Taro.vibrateShort({ type: 'heavy' })
          break
        case 'success':
          Taro.vibrateShort()
          break
        case 'error':
          Taro.vibrateShort({ type: 'heavy' })
          break
      }
    } catch (e) {
      console.log('震动失败:', e)
    }
  }
}))
