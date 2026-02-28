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

  // 播放音效（使用在线音效文件）
  playSound: (type: 'success' | 'error' | 'click' | 'swap' | 'whoosh' | 'snap') => {
    const { soundEnabled } = get()
    if (!soundEnabled) return

    // 使用在线音效文件
    const soundUrls: Record<string, string> = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      error: 'https://assets.mixkit.co/active_storage/sfx/1436/1436-preview.mp3',
      swap: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      whoosh: 'https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3', // 嗖的声音（类似翻牌）
      snap: 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fmixkit-arcade-game-jump-coin-216.wav&nonce=9a0fd158-da10-41b8-b499-a45b578a4d07&project_id=7609528567227056143&sign=78195543683867f65a338c1d5f27cefca9cb241cbcd22958f11b8a1498ac50a0' // 吸附音效（金币声）
    }

    const soundUrl = soundUrls[type] || soundUrls.click

    try {
      const audioContext = Taro.createInnerAudioContext()
      audioContext.src = soundUrl
      audioContext.volume = 0.5

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
