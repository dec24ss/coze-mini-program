import { create } from 'zustand'
import Taro from '@tarojs/taro'

// 用户信息
export interface UserInfo {
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number  // 最高过关关卡
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

  // 动作方法
  login: () => Promise<void>
  logout: () => void
  updateHighestLevel: (level: number) => Promise<void>
  fetchRankList: () => Promise<void>
  checkUnlockedLevels: () => number
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

  // 微信登录
  login: async () => {
    set({ isLoading: true })
    try {
      // 调用微信登录接口
      const loginRes = await Taro.login({
        timeout: 5000
      })

      if (loginRes.code) {
        console.log('微信登录成功，code:', loginRes.code)

        // 获取用户信息（需要用户授权）
        try {
          const userProfile = await Taro.getUserProfile({
            desc: '用于完善用户资料',
          })

          const userInfo: UserInfo = {
            openid: loginRes.code,  // 实际应该用code换取openid
            nickname: userProfile.userInfo.nickName,
            avatarUrl: userProfile.userInfo.avatarUrl,
            highestLevel: 0
          }

          // 从本地存储读取最高关卡
          const savedHighestLevel = Taro.getStorageSync('highestLevel')
          if (savedHighestLevel) {
            userInfo.highestLevel = parseInt(savedHighestLevel)
          }

          // 从本地存储读取解锁的关卡
          const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
          const unlockedLevels = savedUnlockedLevels ? parseInt(savedUnlockedLevels) : 1

          set({
            userInfo,
            isLoggedIn: true,
            isLoading: false,
            unlockedLevels
          })

          console.log('用户登录成功:', userInfo)
        } catch (profileError) {
          // 用户拒绝授权，仍然可以登录，但使用默认信息
          console.log('获取用户信息失败:', profileError)

          const userInfo: UserInfo = {
            openid: loginRes.code,
            nickname: '匿名用户',
            avatarUrl: '',
            highestLevel: 0
          }

          const savedHighestLevel = Taro.getStorageSync('highestLevel')
          if (savedHighestLevel) {
            userInfo.highestLevel = parseInt(savedHighestLevel)
          }

          const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
          const unlockedLevels = savedUnlockedLevels ? parseInt(savedUnlockedLevels) : 1

          set({
            userInfo,
            isLoggedIn: true,
            isLoading: false,
            unlockedLevels
          })
        }
      } else {
        throw new Error('登录失败')
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      set({ isLoading: false })
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
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
    console.log('用户退出登录')
  },

  // 更新最高关卡
  updateHighestLevel: async (level: number) => {
    const { userInfo, isLoggedIn } = get()

    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法更新最高关卡')
      return
    }

    // 只有当新关卡大于当前最高关卡时才更新
    if (level > userInfo.highestLevel) {
      const newUserInfo = { ...userInfo, highestLevel: level }
      set({ userInfo: newUserInfo })

      // 保存到本地存储
      Taro.setStorageSync('highestLevel', level.toString())

      // 同时更新解锁的关卡（下一关）
      const newUnlockedLevels = Math.max(get().unlockedLevels, level + 1)
      set({ unlockedLevels: newUnlockedLevels })
      Taro.setStorageSync('unlockedLevels', newUnlockedLevels.toString())

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
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
  }
}))
