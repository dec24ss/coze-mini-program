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
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => void
  playVibration: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void
}

// 创建设置 store
export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: false,  // 默认关闭音效（在线音效不可用）
  vibrationEnabled: true,

  // 初始化设置
  initSettings: () => {
    const soundEnabled = Taro.getStorageSync('soundEnabled')
    const vibrationEnabled = Taro.getStorageSync('vibrationEnabled')

    set({
      soundEnabled: soundEnabled === 'true',  // 默认关闭
      vibrationEnabled: vibrationEnabled === '' ? true : vibrationEnabled !== 'false'
    })
  },

  // 切换音效
  toggleSound: () => {
    const newValue = !get().soundEnabled
    if (newValue) {
      // 用户尝试开启音效时提示
      Taro.showToast({
        title: '音效暂不可用',
        icon: 'none',
        duration: 2000
      })
      return  // 不允许开启
    }
    set({ soundEnabled: newValue })
    Taro.setStorageSync('soundEnabled', newValue.toString())
  },

  // 切换震动
  toggleVibration: () => {
    const newValue = !get().vibrationEnabled
    set({ vibrationEnabled: newValue })
    Taro.setStorageSync('vibrationEnabled', newValue.toString())
    
    // 切换时震动反馈
    if (newValue) {
      Taro.vibrateShort({ type: 'light' })
    }
  },

  // 播放音效（暂时禁用）
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => {
    const { soundEnabled } = get()
    if (!soundEnabled) return
    
    // 音效功能暂时禁用，使用震动替代
    const { vibrationEnabled } = get()
    if (vibrationEnabled) {
      switch (type) {
        case 'success':
          Taro.vibrateShort({ type: 'medium' })
          break
        case 'error':
          Taro.vibrateShort({ type: 'heavy' })
          break
        case 'click':
        case 'swap':
        case 'snap':
          Taro.vibrateShort({ type: 'light' })
          break
        default:
          Taro.vibrateShort({ type: 'light' })
      }
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
