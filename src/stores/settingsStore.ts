import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 设置状态
interface SettingsState {
  soundEnabled: boolean    // 音效开关
  vibrationEnabled: boolean  // 震动开关
  soundsLoaded: boolean    // 音效是否已预加载
  soundsLoadProgress: number // 音效加载进度（0-100）

  // 方法
  initSettings: () => void
  preloadSounds: () => Promise<void>  // 预加载音效
  toggleSound: () => void
  toggleVibration: () => void
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => void
  playVibration: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void
}

// 音效URL配置
const SOUND_URLS: Record<string, string> = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2821/2821-preview.mp3', // 清脆的点击声
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // 活泼的成功音效
  error: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // 可爱的错误音效
  swap: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // 轻快的交换音效
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // 活泼的嗖声
  snap: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3' // 可爱的啪嗒声
}

// 创建设置 store
export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  vibrationEnabled: true,
  soundsLoaded: false,
  soundsLoadProgress: 0,

  // 初始化设置
  initSettings: () => {
    const soundEnabled = Taro.getStorageSync('soundEnabled')
    const vibrationEnabled = Taro.getStorageSync('vibrationEnabled')

    set({
      soundEnabled: soundEnabled === '' ? true : soundEnabled !== 'false',
      vibrationEnabled: vibrationEnabled === '' ? true : vibrationEnabled !== 'false'
    })
  },

  // 预加载音效
  preloadSounds: async () => {
    console.log('🔊 开始预加载音效...')
    const soundTypes = Object.keys(SOUND_URLS)
    let loadedCount = 0

    const loadSound = (type: string): Promise<void> => {
      return new Promise((resolve) => {
        const audioContext = Taro.createInnerAudioContext()
        audioContext.src = SOUND_URLS[type]
        audioContext.volume = 0.6

        audioContext.onCanplay(() => {
          loadedCount++
          const progress = Math.round((loadedCount / soundTypes.length) * 100)
          set({ soundsLoadProgress: progress })
          console.log(`✅ 音效 ${type} 加载完成 (${loadedCount}/${soundTypes.length})`)
          audioContext.destroy()
          resolve()
        })

        audioContext.onError((err) => {
          console.error(`❌ 音效 ${type} 加载失败:`, err)
          loadedCount++
          const progress = Math.round((loadedCount / soundTypes.length) * 100)
          set({ soundsLoadProgress: progress })
          audioContext.destroy()
          resolve() // 即使失败也继续
        })

        // 播放一次以触发加载
        audioContext.play()
        // 立即停止，避免发出声音
        setTimeout(() => {
          audioContext.stop()
        }, 50)
      })
    }

    // 并行加载所有音效
    await Promise.all(soundTypes.map(type => loadSound(type)))
    set({ soundsLoaded: true })
    console.log('✅ 所有音效预加载完成')
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

  // 播放音效（使用在线音效文件 - 活泼风格）
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => {
    const { soundEnabled } = get()
    if (!soundEnabled) return

    const soundUrl = SOUND_URLS[type] || SOUND_URLS.click

    try {
      const audioContext = Taro.createInnerAudioContext()
      audioContext.src = soundUrl
      audioContext.volume = 0.6

      audioContext.onEnded(() => {
        audioContext.destroy()
      })

      audioContext.onError((err) => {
        console.log('播放音效失败:', err)
        audioContext.destroy()
      })

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
