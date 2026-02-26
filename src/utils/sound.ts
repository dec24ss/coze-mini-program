/**
 * 游戏音效系统
 * 支持背景音乐、音效播放、音量控制等功能
 */

import Taro from '@tarojs/taro'

// 音效类型定义
export type SoundType =
  | 'click'      // 点击按钮
  | 'drag'       // 拖拽碎片
  | 'swap'       // 交换碎片
  | 'correct'    // 正确归位
  | 'win'        // 关卡胜利
  | 'lose'       // 游戏失败
  | 'countdown'  // 倒计时警告
  | 'powerup'    // 使用道具
  | 'bgm'        // 背景音乐

// 音效配置
interface SoundConfig {
  src: string
  volume: number
  loop: boolean
}

// 在线音效资源（使用免费的 CDN 资源）
const SOUND_RESOURCES: Record<SoundType, SoundConfig> = {
  click: {
    src: 'https://cdn.freesound.org/previews/542/542629_11996261-lq.mp3',
    volume: 0.5,
    loop: false,
  },
  drag: {
    src: 'https://cdn.freesound.org/previews/542/542635_11996261-lq.mp3',
    volume: 0.3,
    loop: false,
  },
  swap: {
    src: 'https://cdn.freesound.org/previews/542/542634_11996261-lq.mp3',
    volume: 0.4,
    loop: false,
  },
  correct: {
    src: 'https://cdn.freesound.org/previews/542/542633_11996261-lq.mp3',
    volume: 0.5,
    loop: false,
  },
  win: {
    src: 'https://cdn.freesound.org/previews/542/542632_11996261-lq.mp3',
    volume: 0.6,
    loop: false,
  },
  lose: {
    src: 'https://cdn.freesound.org/previews/542/542631_11996261-lq.mp3',
    volume: 0.4,
    loop: false,
  },
  countdown: {
    src: 'https://cdn.freesound.org/previews/542/542630_11996261-lq.mp3',
    volume: 0.5,
    loop: false,
  },
  powerup: {
    src: 'https://cdn.freesound.org/previews/542/542628_11996261-lq.mp3',
    volume: 0.5,
    loop: false,
  },
  bgm: {
    src: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3',
    volume: 0.2,
    loop: true,
  },
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private bgmAudio: Taro.InnerAudioContext | null = null
  private isMuted = false
  private isInitialized = false
  private isWeapp = false

  constructor() {
    this.isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
  }

  /**
   * 初始化音效系统
   */
  async init(): Promise<void> {
    if (this.isInitialized) return

    try {
      if (this.isWeapp) {
        // 小程序端初始化背景音乐
        this.initBGM()
      }
      this.isInitialized = true
      console.log('🔊 音效系统初始化完成')
    } catch (error) {
      console.error('音效系统初始化失败:', error)
    }
  }

  /**
   * 初始化背景音乐
   */
  private initBGM(): void {
    const bgm = Taro.createInnerAudioContext()
    bgm.src = SOUND_RESOURCES.bgm.src
    bgm.loop = SOUND_RESOURCES.bgm.loop
    bgm.volume = SOUND_RESOURCES.bgm.volume
    this.bgmAudio = bgm
  }

  /**
   * 播放背景音乐
   */
  playBGM(): void {
    if (this.isMuted || !this.bgmAudio) return
    this.bgmAudio.play()
  }

  /**
   * 暂停背景音乐
   */
  pauseBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
  }

  /**
   * 停止背景音乐
   */
  stopBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.stop()
    }
  }

  /**
   * 播放音效
   */
  async play(type: SoundType): Promise<void> {
    if (this.isMuted || type === 'bgm') return

    try {
      if (this.isWeapp) {
        // 小程序端使用 InnerAudioContext
        const audio = Taro.createInnerAudioContext()
        const config = SOUND_RESOURCES[type]
        audio.src = config.src
        audio.volume = config.volume

        // 播放完成后自动销毁
        audio.onEnded(() => {
          audio.destroy()
        })

        audio.onError((err) => {
          console.error(`音效播放错误 (${type}):`, err)
          audio.destroy()
        })

        audio.play()
      } else {
        // H5 端使用 Web Audio API
        await this.playWebAudio(type)
      }
    } catch (error) {
      console.error(`播放音效失败 (${type}):`, error)
    }
  }

  /**
   * H5 端使用 Web Audio API 播放音效
   */
  private async playWebAudio(type: SoundType): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const config = SOUND_RESOURCES[type]

    try {
      const response = await fetch(config.src)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer

      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = config.volume

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start(0)
    } catch (error) {
      console.error('Web Audio 播放失败:', error)
      // 降级使用 Audio 元素
      this.playAudioElement(type)
    }
  }

  /**
   * 使用 Audio 元素播放（降级方案）
   */
  private playAudioElement(type: SoundType): void {
    const config = SOUND_RESOURCES[type]
    const audio = new Audio(config.src)
    audio.volume = config.volume
    audio.play().catch((err) => {
      console.error('Audio 元素播放失败:', err)
    })
  }

  /**
   * 静音/取消静音
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted

    if (this.isMuted) {
      this.pauseBGM()
    } else {
      this.playBGM()
    }

    // 保存静音状态到本地存储
    Taro.setStorageSync('soundMuted', this.isMuted)

    return this.isMuted
  }

  /**
   * 设置静音状态
   */
  setMute(muted: boolean): void {
    this.isMuted = muted
    if (muted) {
      this.pauseBGM()
    } else {
      this.playBGM()
    }
    Taro.setStorageSync('soundMuted', muted)
  }

  /**
   * 获取静音状态
   */
  getMuteStatus(): boolean {
    return this.isMuted
  }

  /**
   * 从本地存储恢复设置
   */
  loadSettings(): void {
    const muted = Taro.getStorageSync('soundMuted')
    if (typeof muted === 'boolean') {
      this.isMuted = muted
    }
  }
}

// 导出单例
export const soundManager = new SoundManager()

// 导出便捷的播放函数
export const playSound = (type: SoundType) => soundManager.play(type)
export const playBGM = () => soundManager.playBGM()
export const pauseBGM = () => soundManager.pauseBGM()
export const toggleMute = () => soundManager.toggleMute()
export const initSound = () => soundManager.init()
