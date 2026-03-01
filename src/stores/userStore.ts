import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { Network } from '@/network'

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
  addPoints: (points: number) => Promise<void>
  consumePoints: (points: number) => Promise<boolean>
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
      // 如果没有传入昵称和头像，尝试获取用户信息
      let userNickname = nickname
      let userAvatarUrl = avatarUrl

      if (!userNickname || !userAvatarUrl) {
        // 检查是否在小程序环境
        const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

        if (isWeapp) {
          try {
            // 获取用户信息（需要用户授权）
            const profileRes = await Taro.getUserProfile({
              desc: '用于完善用户资料'
            })

            if (profileRes.userInfo) {
              userNickname = profileRes.userInfo.nickName || '拼图玩家'
              userAvatarUrl = profileRes.userInfo.avatarUrl || ''
              console.log('获取用户信息成功:', userNickname, userAvatarUrl)
            }
          } catch (error) {
            console.warn('获取用户信息失败，使用默认值:', error)
            userNickname = userNickname || '拼图玩家'
            userAvatarUrl = userAvatarUrl || ''
          }
        } else {
          // H5 环境，使用默认值或传入的值
          userNickname = userNickname || '拼图玩家'
          userAvatarUrl = userAvatarUrl || ''
        }
      }

      // 调用微信登录接口
      const loginRes = await Taro.login({
        timeout: 5000
      })

      if (loginRes.code) {
        console.log('微信登录成功，code:', loginRes.code)

        // 调用后端登录 API
        const response = await Network.request({
          url: '/api/users/login',
          method: 'POST',
          data: {
            openid: loginRes.code,
            nickname: userNickname,
            avatar_url: userAvatarUrl
          }
        })

        if (response.data?.data) {
          const apiUser = response.data.data
          const userInfo: UserInfo = {
            openid: apiUser.openid,
            nickname: apiUser.nickname || '拼图玩家',
            avatarUrl: apiUser.avatar_url || '',
            highestLevel: apiUser.highest_level || 0,
            points: apiUser.points || 0
          }

          // 从本地存储读取关卡图片映射（本地缓存）
          const savedLevelImages = Taro.getStorageSync('levelImages')
          const levelImages = savedLevelImages ? JSON.parse(savedLevelImages) : {}

          // 从本地存储读取解锁的关卡（优先使用本地数据，确保游戏进度不会丢失）
          const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
          const unlockedLevels = savedUnlockedLevels ? Math.max(parseInt(savedUnlockedLevels), 1) : 1

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
          throw new Error('登录失败：服务器返回数据格式错误')
        }
      } else {
        throw new Error('登录失败：未获取到微信登录 code')
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
      myRank: 0,
      levelImages: {}  // 清除关卡图片缓存
    })
    Taro.removeStorageSync('highestLevel')
    Taro.removeStorageSync('unlockedLevels')
    Taro.removeStorageSync('points')
    Taro.removeStorageSync('levelImages')  // 清除关卡图片缓存
    console.log('用户退出登录，已清除关卡图片缓存')
  },

  // 更新最高关卡
  updateHighestLevel: async (level: number, imageUrl?: string) => {
    const { userInfo, isLoggedIn } = get()

    if (!isLoggedIn || !userInfo) {
      console.log('用户未登录，无法更新最高关卡')
      return
    }

    // 只有当新关卡大于当前最高关卡时才更新
    if (level > userInfo.highestLevel) {
      const newUserInfo = { ...userInfo, highestLevel: level }

      // 保存关卡图片映射
      const newLevelImages = { ...get().levelImages }
      if (imageUrl) {
        newLevelImages[level] = imageUrl
      }

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

      // 同步更新到后端数据库
      try {
        await Network.request({
          url: '/api/users/update-level',
          method: 'POST',
          data: {
            openid: userInfo.openid,
            highest_level: level
          }
        })
        console.log(`最高关卡已同步到数据库: ${level}`)
      } catch (error) {
        console.error('同步最高关卡到数据库失败:', error)
        // 失败不影响本地更新
      }

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
      if (imageUrl) {
        console.log(`关卡 ${level} 图片已保存`)
      }
    }
  },

  // 获取排行榜（从 Supabase 获取真实数据）
  fetchRankList: async () => {
    try {
      const response = await Network.request({
        url: '/api/users/rank/list',
        method: 'GET'
      })

      if (response.data?.data) {
        const rankList: RankItem[] = response.data.data.map((item: any) => ({
          openid: item.openid,
          nickname: item.nickname || '匿名用户',
          avatarUrl: item.avatar_url || '',
          highestLevel: item.highest_level || 0,
          rank: item.rank || 0
        }))

        const { userInfo } = get()
        let myRank = 0

        // 找到当前用户的排名
        if (userInfo) {
          const myRankItem = rankList.find(item => item.openid === userInfo.openid)
          myRank = myRankItem?.rank || 0
        }

        set({ rankList, myRank })
        console.log('排行榜数据加载成功，共', rankList.length, '名玩家')
      } else {
        throw new Error('获取排行榜失败：服务器返回数据格式错误')
      }
    } catch (error) {
      console.error('获取排行榜失败:', error)
      Taro.showToast({ title: '获取排行榜失败', icon: 'none' })

      // 失败时使用空数据
      set({ rankList: [], myRank: 0 })
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
  addPoints: async (points: number) => {
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

    // 同步更新到后端数据库
    try {
      await Network.request({
        url: '/api/users/add-points',
        method: 'POST',
        data: {
          openid: userInfo.openid,
          points: points
        }
      })
      console.log(`积分已同步到数据库`)
    } catch (error) {
      console.error('同步积分到数据库失败:', error)
      // 失败不影响本地更新
    }
  },

  // 使用积分（扣除积分）
  consumePoints: async (points: number) => {
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

    // 同步更新到后端数据库
    try {
      await Network.request({
        url: '/api/users/consume-points',
        method: 'POST',
        data: {
          openid: userInfo.openid,
          points: points
        }
      })
      console.log(`积分已同步到数据库`)
    } catch (error) {
      console.error('同步积分到数据库失败:', error)
      // 失败不影响本地更新
    }

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
