import Taro from '@tarojs/taro'
import { useSettingsStore } from '@/stores/settingsStore'

// 音效类型
export type SoundType = 'pickup' | 'drop' | 'swap' | 'complete' | 'success' | 'fail' | 'button' | 'hint'

// 音效频率和时长配置
const SOUND_CONFIGS: Record<SoundType, { frequency: number; duration: number }> = {
  pickup: { frequency: 440, duration: 100 },      // 拾起碎片
  drop: { frequency: 330, duration: 100 },        // 放下碎片
  swap: { frequency: 523, duration: 150 },        // 交换碎片
  complete: { frequency: 659, duration: 200 },    // 拼图完成
  success: { frequency: 880, duration: 300 },     // 过关成功
  fail: { frequency: 220, duration: 200 },        // 游戏失败
  button: { frequency: 392, duration: 80 },       // 按钮点击
  hint: { frequency: 600, duration: 120 }         // 提示
}

// 播放音效
export const playSound = (type: SoundType) => {
  const { soundEnabled } = useSettingsStore.getState()

  if (!soundEnabled) {
    return
  }

  try {
    const config = SOUND_CONFIGS[type]
    if (!config) {
      return
    }

    // 使用 Taro.createInnerAudioContext 播放音效
    // 这里使用 Web Audio API 生成音效（更灵活）
    if (typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = config.frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + config.duration / 1000)
    }
  } catch (error) {
    console.error('播放音效失败:', error)
  }
}

// 播放震动
export const playVibration = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  const { vibrationEnabled } = useSettingsStore.getState()

  if (!vibrationEnabled) {
    return
  }

  try {
    const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

    if (isWeapp) {
      // 小程序端使用 Taro.vibrateShort
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
          Taro.vibrateShort({ type: 'medium' })
          setTimeout(() => Taro.vibrateShort({ type: 'light' }), 100)
          break
        case 'error':
          Taro.vibrateShort({ type: 'heavy' })
          break
      }
    } else {
      // H5 端使用 navigator.vibrate
      switch (type) {
        case 'light':
          navigator.vibrate(15)
          break
        case 'medium':
          navigator.vibrate(30)
          break
        case 'heavy':
          navigator.vibrate(50)
          break
        case 'success':
          navigator.vibrate([30, 50, 30])
          break
        case 'error':
          navigator.vibrate([50, 30, 50])
          break
      }
    }
  } catch (error) {
    console.error('播放震动失败:', error)
  }
}

// 播放音效和震动（组合）
export const playSoundAndVibration = (soundType: SoundType, vibrationType: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  playSound(soundType)
  playVibration(vibrationType)
}
