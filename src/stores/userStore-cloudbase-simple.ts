import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { getCloudbaseDB, isCloudbaseEnabled } from '@/cloudbase'

// 用户信息
export interface UserInfo {
  _id?: string
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number
  points: number
  hasSetProfile?: boolean
}

// 排行榜条目
export interface RankItem {
  _id?: string
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number
  rank: number
}

// 用户状态
interface UserState {
  userInfo: UserInfo | null
  isLoggedIn: boolean
  isLoading: boolean
  rankList: RankItem[]
  myRank: number
  unlockedLevels: number
  levelImages: Record<number, string>

  login: (nickname?: string, avatarUrl?: string) => Promise<void>
  logout: () => void
  updateUserInfo: (nickname: string, avatarUrl: string) => Promise<void>
  updateHighestLevel: (level: number, imageUrl?: string) => Promise<void>
  fetchRankList: () => Promise<void>
  checkUnlockedLevels: () => number
  addPoints: (points: number) => Promise<void>
  consumePoints: (points: number) => Promise<boolean>
  getPoints: () => number
  getCurrentLevel: () => number
  getLevelImage: (level: number) => string | undefined
}

// 创建用户store
export const useUserStoreCloudbase = create<UserState>((set, get) => ({
  userInfo: null,
  isLoggedIn: false,
  isLoading: false,
  rankList: [],
  myRank: 0,
  unlockedLevels: 1,
  levelImages: {},

  // 登录
  login: async (nickname?: string, avatarUrl?: string) => {
    set({ isLoading: true })
    try {
      const userNickname = nickname || '拼图玩家'
      const userAvatarUrl = avatarUrl || ''

      // 生成一个模拟的 openid
      const openid = 'local_user_' + Date.now()

      // 从本地存储读取数据
      const savedLevelImages = Taro.getStorageSync('levelImages')
      const levelImages = savedLevelImages ? JSON.parse(savedLevelImages) : {}
      
      const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
      const unlockedLevels = savedUnlockedLevels ? Math.max(parseInt(savedUnlockedLevels), 1) : 1
      
      const savedHighestLevel = Taro.getStorageSync('highestLevel')
      const highestLevel = savedHighestLevel ? parseInt(savedHighestLevel) : 0
      
      const savedPoints = Taro.getStorageSync('points')
      const points = savedPoints ? parseInt(savedPoints) : 0

      const userInfo: UserInfo = {
        openid,
        nickname: userNickname,
        avatarUrl: userAvatarUrl,
        highestLevel,
        points
      }

      Taro.setStorageSync('openid', openid)

      set({
        userInfo,
        isLoggedIn: true,
        isLoading: false,
        unlockedLevels,
        levelImages
      })

      console.log('用户登录成功（本地模式）:', userInfo)
    } catch (error) {
      console.error('登录失败:', error)
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
      avatarUrl,
      hasSetProfile: true
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
      myRank: 0,
      levelImages: {}
    })
    Taro.removeStorageSync('highestLevel')
    Taro.removeStorageSync('unlockedLevels')
    Taro.removeStorageSync('points')
    Taro.removeStorageSync('levelImages')
    Taro.removeStorageSync('openid')
    console.log('用户退出登录')
  },

  // 更新最高关卡
  updateHighestLevel: async (level: number, imageUrl?: string) => {
    const { userInfo, isLoggedIn } = get()

    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法更新最高关卡')
      return
    }

    if (level > userInfo.highestLevel) {
      const newUserInfo = { ...userInfo, highestLevel: level }

      const newLevelImages = { ...get().levelImages }
      if (imageUrl) {
        newLevelImages[level] = imageUrl
      }

      set({
        userInfo: newUserInfo,
        levelImages: newLevelImages
      })

      Taro.setStorageSync('highestLevel', level.toString())
      Taro.setStorageSync('levelImages', JSON.stringify(newLevelImages))

      const newUnlockedLevels = Math.max(get().unlockedLevels, level + 1)
      set({ unlockedLevels: newUnlockedLevels })
      Taro.setStorageSync('unlockedLevels', newUnlockedLevels.toString())

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
    }
  },

  // 获取排行榜（本地模拟数据）
  fetchRankList: async () => {
    try {
      // 生成模拟排行榜数据
      const mockRankList: RankItem[] = [
        { openid: 'user1', nickname: '拼图达人', avatarUrl: '', highestLevel: 20, rank: 1 },
        { openid: 'user2', nickname: '超级玩家', avatarUrl: '', highestLevel: 15, rank: 2 },
        { openid: 'user3', nickname: '新手玩家', avatarUrl: '', highestLevel: 10, rank: 3 },
      ]

      const { userInfo } = get()
      let myRank = 0

      if (userInfo) {
        mockRankList.push({
          openid: userInfo.openid,
          nickname: userInfo.nickname,
          avatarUrl: userInfo.avatarUrl,
          highestLevel: userInfo.highestLevel,
          rank: mockRankList.length + 1
        })
        myRank = mockRankList.length
      }

      set({ rankList: mockRankList, myRank })
      console.log('排行榜数据加载成功（本地模拟），共', mockRankList.length, '名玩家')
    } catch (error) {
      console.error('获取排行榜失败:', error)
      set({ rankList: [], myRank: 0 })
    }
  },

  // 检查已解锁的关卡
  checkUnlockedLevels: () => {
    const { isLoggedIn } = get()
    if (!isLoggedIn) {
      return 1
    }
    return get().unlockedLevels
  },

  // 增加积分
  addPoints: async (points: number) => {
    const { userInfo } = get()
    if (!userInfo) return

    const newPoints = userInfo.points + points
    const newUserInfo = { ...userInfo, points: newPoints }

    set({ userInfo: newUserInfo })
    Taro.setStorageSync('points', newPoints.toString())
    console.log(`积分增加: +${points}，当前积分: ${newPoints}`)
  },

  // 消耗积分
  consumePoints: async (points: number): Promise<boolean> => {
    const { userInfo } = get()
    if (!userInfo || userInfo.points < points) {
      return false
    }

    const newPoints = userInfo.points - points
    const newUserInfo = { ...userInfo, points: newPoints }

    set({ userInfo: newUserInfo })
    Taro.setStorageSync('points', newPoints.toString())
    console.log(`积分消耗: -${points}，当前积分: ${newPoints}`)
    return true
  },

  // 获取当前积分
  getPoints: () => {
    return get().userInfo?.points || 0
  },

  // 获取当前关卡
  getCurrentLevel: () => {
    return get().userInfo?.highestLevel || 0
  },

  // 获取关卡图片
  getLevelImage: (level: number) => {
    return get().levelImages[level]
  }
}))
