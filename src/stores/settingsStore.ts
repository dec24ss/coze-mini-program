import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 设置状态
interface SettingsState {
  soundEnabled: boolean    // 音效开关
  vibrationEnabled: boolean  // 震动开关
  audioCache: Record<string, Taro.InnerAudioContext>  // 音效缓存

  // 方法
  initSettings: () => void
  toggleSound: () => void
  toggleVibration: () => void
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => void
  playVibration: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void
  preloadSounds: () => void  // 预加载音效
}

// 创建设置 store
export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  vibrationEnabled: true,
  audioCache: {},  // 音效缓存

  // 初始化设置
  initSettings: () => {
    const soundEnabled = Taro.getStorageSync('soundEnabled')
    const vibrationEnabled = Taro.getStorageSync('vibrationEnabled')

    set({
      soundEnabled: soundEnabled === '' ? true : soundEnabled !== 'false',
      vibrationEnabled: vibrationEnabled === '' ? true : vibrationEnabled !== 'false'
    })

    // 预加载音效
    get().preloadSounds()
  },

  // 预加载音效（减少播放延迟）
  preloadSounds: () => {
    const soundUrls: Record<string, string> = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2821/2821-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
      error: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
      swap: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
      whoosh: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
      snap: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3'
    }

    Object.keys(soundUrls).forEach(type => {
      const audioContext = Taro.createInnerAudioContext()
      audioContext.src = soundUrls[type]
      audioContext.volume = 0.6

      // 错误处理
      audioContext.onError((err) => {
        console.log(`预加载音效失败 (${type}):`, err)
        audioContext.destroy()
      })

      // 将音效缓存起来
      set(state => ({
        audioCache: {
          ...state.audioCache,
          [type]: audioContext
        }
      }))
    })

    console.log('🔊 音效预加载完成')
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

  // 播放音效（使用缓存的音效，减少延迟）
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => {
    const { soundEnabled, audioCache } = get()
    if (!soundEnabled) return

    // 使用在线音效文件（更活泼的风格）
    const soundUrls: Record<string, string> = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2821/2821-preview.mp3', // 清脆的点击声
      success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // 活泼的成功音效
      error: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // 可爱的错误音效
      swap: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // 轻快的交换音效
      whoosh: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // 活泼的嗖声
      snap: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3' // 可爱的啪嗒声
    }

    const soundUrl = soundUrls[type] || soundUrls.click

    try {
      // 优先使用缓存的音效
      let audioContext = audioCache[type]

      if (!audioContext) {
        // 如果缓存中没有，创建新的
        audioContext = Taro.createInnerAudioContext()
        audioContext.src = soundUrl
        audioContext.volume = 0.6

        // 缓存音效
        set(state => ({
          audioCache: {
            ...state.audioCache,
            [type]: audioContext
          }
        }))
      }

      // 播放音效
      audioContext.play()
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
