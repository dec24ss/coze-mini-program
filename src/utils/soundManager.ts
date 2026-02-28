// 音效管理器
class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    this.init()
  }

  // 初始化音频上下文
  private init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.log('音频上下文初始化失败:', e)
    }
  }

  // 设置音效开关
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // 播放音效
  play(type: 'move' | 'swap' | 'complete' | 'error' | 'click' | 'levelup') {
    if (!this.enabled || !this.audioContext) {
      return
    }

    // 恢复音频上下文（如果是暂停状态）
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    switch (type) {
      case 'move':
        // 移动音效：短促的音调
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.1)
        break

      case 'swap':
        // 交换音效：清脆的音调
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.15)
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.15)
        break

      case 'complete':
        // 完成音效：欢快的音阶
        this.playNote(523.25, 0)  // C5
        this.playNote(659.25, 0.1)  // E5
        this.playNote(783.99, 0.2)  // G5
        this.playNote(1046.50, 0.3)  // C6
        return

      case 'error':
        // 错误音效：低沉的音调
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.2)
        break

      case 'click':
        // 点击音效：短促的音调
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.05)
        break

      case 'levelup':
        // 升级音效：上升的音阶
        this.playNote(523.25, 0)  // C5
        this.playNote(587.33, 0.1)  // D5
        this.playNote(659.25, 0.2)  // E5
        this.playNote(698.46, 0.3)  // F5
        this.playNote(783.99, 0.4)  // G5
        this.playNote(880.00, 0.5)  // A5
        this.playNote(987.77, 0.6)  // B5
        this.playNote(1046.50, 0.7)  // C6
        return
    }
  }

  // 播放单个音符
  private playNote(frequency: number, delay: number) {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay)
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime + delay)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.3)

    oscillator.start(this.audioContext.currentTime + delay)
    oscillator.stop(this.audioContext.currentTime + delay + 0.3)
  }
}

// 创建单例
export const soundManager = new SoundManager()
