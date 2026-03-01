import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 用户信息
export interface UserInfo {
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number  // 最高过关关卡
  points: number        // 积分
}

// 排行榜条目
export interface RankItem {
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number
  rank: number
}

// 用户状态
interface UserState {
  // 用户信息
  userInfo: UserInfo | null
  isLoggedIn: boolean
  isLoading: boolean

  // 排行榜
  rankList: RankItem[]
  myRank: number

  // 解锁的关卡
  unlockedLevels: number  // 已解锁的最大关卡数

  // 关卡图片映射（记住用户过的每一关的图片）
  levelImages: Record<number, string>  // 关卡号 -> 图片URL

  // 动作方法
  login: (nickname?: string, avatarUrl?: string) => Promise<void>
  logout: () => void
  updateUserInfo: (nickname: string, avatarUrl: string) => void
  updateHighestLevel: (level: number, imageUrl?: string) => Promise<void>
  fetchRankList: () => Promise<void>
  checkUnlockedLevels: () => number
  addPoints: (points: number) => void
  consumePoints: (points: number) => boolean
  getPoints: () => number
  getCurrentLevel: () => number
  getLevelImage: (level: number) => string | undefined
}

// 创建用户store
export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  userInfo: null,
  isLoggedIn: false,
  isLoading: false,
  rankList: [],
  myRank: 0,
  unlockedLevels: 1,  // 默认解锁第1关
  levelImages: {},  // 关卡图片映射

  // 微信登录
  login: async (nickname?: string, avatarUrl?: string) => {
    set({ isLoading: true })
    try {
      // 调用微信登录接口
      const loginRes = await Taro.login({
        timeout: 5000
      })

      if (loginRes.code) {
        console.log('微信登录成功，code:', loginRes.code)

        // 使用传入的用户信息（如果有的话）
        const userInfo: UserInfo = {
          openid: loginRes.code,  // 实际应该用code换取openid
          nickname: nickname || '拼图玩家',
          avatarUrl: avatarUrl || '',
          highestLevel: 0,
          points: 0
        }

        // 从本地存储读取最高关卡
        const savedHighestLevel = Taro.getStorageSync('highestLevel')
        if (savedHighestLevel) {
          userInfo.highestLevel = parseInt(savedHighestLevel)
        }

        // 从本地存储读取积分
        const savedPoints = Taro.getStorageSync('points')
        if (savedPoints) {
          userInfo.points = parseInt(savedPoints)
        }

        // 从本地存储读取解锁的关卡
        const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
        const unlockedLevels = savedUnlockedLevels ? parseInt(savedUnlockedLevels) : 1

        // 从本地存储读取关卡图片映射
        const savedLevelImages = Taro.getStorageSync('levelImages')
        const levelImages = savedLevelImages ? JSON.parse(savedLevelImages) : {}

        set({
          userInfo,
          isLoggedIn: true,
          isLoading: false,
          unlockedLevels,
          levelImages
        })

        console.log('用户登录成功:', userInfo)
        console.log('已加载关卡图片映射:', Object.keys(levelImages).length, '个关卡')
      } else {
        throw new Error('登录失败')
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      set({ isLoading: false })
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  // 更新用户信息
  updateUserInfo: async (nickname: string, avatarUrl: string) => {
    const { userInfo } = get()
    if (!userInfo) {
      console.log('用户未登录，无法更新信息')
      return
    }

    const newUserInfo = {
      ...userInfo,
      nickname,
      avatarUrl
    }

    set({ userInfo: newUserInfo })
    console.log('用户信息已更新:', newUserInfo)
  },

  // 退出登录
  logout: () => {
    set({
      userInfo: null,
      isLoggedIn: false,
      rankList: [],
      myRank: 0
    })
    Taro.removeStorageSync('highestLevel')
    Taro.removeStorageSync('unlockedLevels')
    Taro.removeStorageSync('points')
    console.log('用户退出登录')
  },

  // 更新最高关卡
  updateHighestLevel: async (level: number, imageUrl?: string) => {
    const { userInfo, isLoggedIn } = get()

    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法更新最高关卡')
      return
    }

    // 保存关卡图片映射（无论是否更新最高关卡，都要保存图片）
    const newLevelImages = { ...get().levelImages }
    if (imageUrl) {
      newLevelImages[level] = imageUrl
      console.log(`🖼️  关卡 ${level} 图片URL已保存:`, imageUrl.substring(0, 80))
    }

    // 只有当新关卡大于当前最高关卡时才更新
    if (level > userInfo.highestLevel) {
      const newUserInfo = { ...userInfo, highestLevel: level }
      
      set({ 
        userInfo: newUserInfo,
        levelImages: newLevelImages
      })

      // 保存到本地存储
      Taro.setStorageSync('highestLevel', level.toString())
      Taro.setStorageSync('levelImages', JSON.stringify(newLevelImages))

      // 同时更新解锁的关卡（下一关）
      const newUnlockedLevels = Math.max(get().unlockedLevels, level + 1)
      set({ unlockedLevels: newUnlockedLevels })
      Taro.setStorageSync('unlockedLevels', newUnlockedLevels.toString())

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
    } else {
      // 只是保存图片，不更新最高关卡
      set({ levelImages: newLevelImages })
      Taro.setStorageSync('levelImages', JSON.stringify(newLevelImages))
      console.log(`关卡 ${level} 图片已更新，不更新最高关卡`)
    }
  },

  // 获取排行榜（本地模拟）
  fetchRankList: async () => {
    // 这里可以对接真实的后端API
    // 目前使用本地模拟数据
    const mockRankList: RankItem[] = [
      { openid: '1', nickname: '拼图大师', avatarUrl: '', highestLevel: 15, rank: 1 },
      { openid: '2', nickname: '拼图高手', avatarUrl: '', highestLevel: 12, rank: 2 },
      { openid: '3', nickname: '拼图达人', avatarUrl: '', highestLevel: 10, rank: 3 },
      { openid: '4', nickname: '拼图新手', avatarUrl: '', highestLevel: 8, rank: 4 },
      { openid: '5', nickname: '拼图爱好者', avatarUrl: '', highestLevel: 5, rank: 5 },
    ]

    // 添加当前用户到排行榜
    const { userInfo } = get()
    if (userInfo) {
      const myRankItem: RankItem = {
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl,
        highestLevel: userInfo.highestLevel,
        rank: 0
      }

      // 合并并排序
      const allRanks = [...mockRankList, myRankItem]
      allRanks.sort((a, b) => b.highestLevel - a.highestLevel)

      // 更新排名
      allRanks.forEach((item, index) => {
        item.rank = index + 1
      })

      // 找到当前用户的排名
      const myRank = allRanks.find(item => item.openid === userInfo.openid)?.rank || 0

      set({
        rankList: allRanks.slice(0, 10),  // 只显示前10名
        myRank
      })
    } else {
      set({ rankList: mockRankList })
    }
  },

  // 检查已解锁的关卡
  checkUnlockedLevels: () => {
    const { isLoggedIn } = get()
    if (!isLoggedIn) {
      return 1  // 未登录只能玩第1关
    }

    const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
    if (savedUnlockedLevels) {
      const levels = parseInt(savedUnlockedLevels)
      set({ unlockedLevels: levels })
      return levels
    }
    return 1
  },

  // 添加积分
  addPoints: (points: number) => {
    const { userInfo, isLoggedIn } = get()
    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法添加积分')
      return
    }

    const newPoints = userInfo.points + points
    const newUserInfo = { ...userInfo, points: newPoints }
    set({ userInfo: newUserInfo })

    // 保存到本地存储
    Taro.setStorageSync('points', newPoints.toString())
    console.log(`用户积分增加 ${points}，当前积分: ${newPoints}`)
  },

  // 使用积分（扣除积分）
  consumePoints: (points: number) => {
    const { userInfo, isLoggedIn } = get()
    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法使用积分')
      return false
    }

    if (userInfo.points < points) {
      console.log('积分不足')
      return false
    }

    const newPoints = userInfo.points - points
    const newUserInfo = { ...userInfo, points: newPoints }
    set({ userInfo: newUserInfo })

    // 保存到本地存储
    Taro.setStorageSync('points', newPoints.toString())
    console.log(`用户使用积分 ${points}，当前积分: ${newPoints}`)
    return true
  },

  // 获取当前积分
  getPoints: () => {
    const { userInfo } = get()
    return userInfo?.points || 0
  },

  // 获取当前应该开始的关卡（从上次未完成的关卡开始）
  getCurrentLevel: () => {
    const { userInfo, isLoggedIn } = get()
    if (!isLoggedIn || !userInfo) {
      return 1  // 未登录从第1关开始
    }
    
    // 从 highestLevel + 1 开始（即用户未完成的下一关），至少从第1关开始
    const nextLevel = userInfo.highestLevel + 1
    return Math.max(1, nextLevel)
  },

  // 获取指定关卡的图片
  getLevelImage: (level: number) => {
    const { levelImages } = get()
    return levelImages[level]
  }
}))
