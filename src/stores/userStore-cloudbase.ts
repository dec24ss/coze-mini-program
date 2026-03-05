import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { getCloudbaseDB, USE_CLOUDBASE } from '@/cloudbase'

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
  fetchRankList: (forceRefresh?: boolean) => Promise<void>
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

      let openid = ''

      if (USE_CLOUDBASE) {
        // 云开发模式
        const db = await getCloudbaseDB()
        if (!db) {
          throw new Error('云开发数据库未初始化')
        }

        const loginRes = await Taro.login({ timeout: 5000 })
        if (!loginRes.code) {
          throw new Error('未获取到微信登录 code')
        }
        openid = loginRes.code

        // 查询用户是否存在
        const { data: existingUsers } = await db
          .collection('users')
          .where({ openid: db.command.eq(openid) })
          .get()

        if (existingUsers && existingUsers.length > 0) {
          const existingUser = existingUsers[0]
          let needUpdate = false
          const updateData: any = {}

          if (userNickname && userNickname !== existingUser.nickname) {
            updateData.nickname = userNickname
            needUpdate = true
          }

          if (userAvatarUrl && userAvatarUrl !== existingUser.avatarUrl) {
            updateData.avatarUrl = userAvatarUrl
            needUpdate = true
          }

          let currentUser = existingUser
          
          if (needUpdate) {
            updateData.updatedAt = new Date()
            await db
              .collection('users')
              .doc(existingUser._id)
              .update({ data: updateData })

            const { data: updatedUsers } = await db
              .collection('users')
              .where({ openid: db.command.eq(openid) })
              .get()

            if (updatedUsers && updatedUsers.length > 0) {
              currentUser = updatedUsers[0]
            }
          }

          const userInfo: UserInfo = {
            _id: currentUser._id,
            openid: currentUser.openid,
            nickname: currentUser.nickname || '拼图玩家',
            avatarUrl: currentUser.avatarUrl || '',
            highestLevel: currentUser.highestLevel || 0,
            points: currentUser.points || 0
          }

          const savedLevelImages = Taro.getStorageSync('levelImages')
          const levelImages = savedLevelImages ? JSON.parse(savedLevelImages) : {}
          
          const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
          const unlockedLevels = savedUnlockedLevels ? Math.max(parseInt(savedUnlockedLevels), 1) : 1

          Taro.setStorageSync('openid', openid)

          set({
            userInfo,
            isLoggedIn: true,
            isLoading: false,
            unlockedLevels,
            levelImages
          })

          console.log('用户登录成功（云开发模式）:', userInfo)
        } else {
          // 创建新用户
          const newUser = {
            openid,
            nickname: userNickname,
            avatarUrl: userAvatarUrl,
            highestLevel: 0,
            points: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          const { _id } = await db.collection('users').add({ data: newUser })

          const userInfo: UserInfo = {
            _id,
            openid,
            nickname: userNickname,
            avatarUrl: userAvatarUrl,
            highestLevel: 0,
            points: 0
          }

          const savedLevelImages = Taro.getStorageSync('levelImages')
          const levelImages = savedLevelImages ? JSON.parse(savedLevelImages) : {}
          
          const savedUnlockedLevels = Taro.getStorageSync('unlockedLevels')
          const unlockedLevels = savedUnlockedLevels ? Math.max(parseInt(savedUnlockedLevels), 1) : 1

          Taro.setStorageSync('openid', openid)

          set({
            userInfo,
            isLoggedIn: true,
            isLoading: false,
            unlockedLevels,
            levelImages
          })

          console.log('新用户创建成功（云开发模式）:', userInfo)
        }
      } else {
        // 本地模式（Coze 环境）
        openid = 'local_user_' + Date.now()

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
      }
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

    if (USE_CLOUDBASE) {
      try {
        const db = await getCloudbaseDB()
        if (db && userInfo._id) {
          await db
            .collection('users')
            .doc(userInfo._id)
            .update({
              data: {
                nickname,
                avatarUrl,
                updatedAt: new Date()
              }
            })
          console.log('用户信息已同步到云开发数据库')
        }
      } catch (error) {
        console.error('同步用户信息失败:', error)
      }
    }

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

      if (USE_CLOUDBASE) {
        try {
          const db = await getCloudbaseDB()
          if (db && userInfo._id) {
            await db
              .collection('users')
              .doc(userInfo._id)
              .update({
                data: {
                  highestLevel: level,
                  updatedAt: new Date()
                }
              })
            console.log(`最高关卡已同步到云开发数据库: ${level}`)
          }
        } catch (error) {
          console.error('同步最高关卡失败:', error)
        }
      }

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
    }
  },

  // 获取排行榜
  fetchRankList: async (forceRefresh = false) => {
    try {
      // 如果不是强制刷新，首先尝试从本地缓存读取
      if (!forceRefresh) {
        const cachedRankList = Taro.getStorageSync('rankList')
        const cachedMyRank = Taro.getStorageSync('myRank')
        const cachedRankTime = Taro.getStorageSync('rankCacheTime')
        
        // 如果缓存存在且在5分钟内，直接使用缓存
        if (cachedRankList && cachedRankList.length > 0) {
          const now = Date.now()
          const cacheAge = cachedRankTime ? now - parseInt(cachedRankTime) : Infinity
          
          if (cacheAge < 5 * 60 * 1000) { // 5分钟缓存
            console.log('使用本地缓存的排行榜数据，缓存年龄:', Math.round(cacheAge / 1000), '秒')
            set({ 
              rankList: cachedRankList, 
              myRank: cachedMyRank ? parseInt(cachedMyRank) : 0 
            })
            return
          }
        }
      } else {
        console.log('强制刷新排行榜，跳过本地缓存')
      }

      if (USE_CLOUDBASE) {
        const db = await getCloudbaseDB()
        if (!db) {
          throw new Error('云开发数据库未初始化')
        }

        const { data: rankData } = await db
          .collection('users')
          .orderBy('highestLevel', 'desc')
          .orderBy('points', 'desc')
          .limit(100)
          .get()

        if (rankData) {
          const rankList: RankItem[] = rankData.map((item: any, index: number) => ({
            _id: item._id,
            openid: item.openid,
            nickname: item.nickname || '匿名用户',
            avatarUrl: item.avatarUrl || '',
            highestLevel: item.highestLevel || 0,
            rank: index + 1
          }))

          const { userInfo } = get()
          let myRank = 0

          if (userInfo) {
            const myRankItem = rankList.find(item => item.openid === userInfo.openid)
            myRank = myRankItem?.rank || 0
          }

          // 保存到本地缓存
          Taro.setStorageSync('rankList', rankList)
          Taro.setStorageSync('myRank', myRank.toString())
          Taro.setStorageSync('rankCacheTime', Date.now().toString())

          set({ rankList, myRank })
          console.log('排行榜数据加载成功（云开发），共', rankList.length, '名玩家，已缓存到本地')
        }
      } else {
        // 本地模式：生成模拟数据
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

        // 保存到本地缓存
        Taro.setStorageSync('rankList', mockRankList)
        Taro.setStorageSync('myRank', myRank.toString())
        Taro.setStorageSync('rankCacheTime', Date.now().toString())

        set({ rankList: mockRankList, myRank })
        console.log('排行榜数据加载成功（本地模拟），共', mockRankList.length, '名玩家，已缓存到本地')
      }
    } catch (error) {
      console.error('获取排行榜失败:', error)
      
      // 失败时尝试使用本地缓存
      const cachedRankList = Taro.getStorageSync('rankList')
      const cachedMyRank = Taro.getStorageSync('myRank')
      
      if (cachedRankList && cachedRankList.length > 0) {
        console.log('网络失败，使用本地缓存的排行榜数据')
        set({ 
          rankList: cachedRankList, 
          myRank: cachedMyRank ? parseInt(cachedMyRank) : 0 
        })
      } else {
        set({ rankList: [], myRank: 0 })
      }
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

    if (USE_CLOUDBASE) {
      try {
        const db = await getCloudbaseDB()
        if (db && userInfo._id) {
          await db
            .collection('users')
            .doc(userInfo._id)
            .update({
              data: {
                points: newPoints,
                updatedAt: new Date()
              }
            })
        }
      } catch (error) {
        console.error('同步积分失败:', error)
      }
    }

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

    if (USE_CLOUDBASE) {
      try {
        const db = await getCloudbaseDB()
        if (db && userInfo._id) {
          await db
            .collection('users')
            .doc(userInfo._id)
            .update({
              data: {
                points: newPoints,
                updatedAt: new Date()
              }
            })
        }
      } catch (error) {
        console.error('同步积分失败:', error)
      }
    }

    console.log(`积分消耗: -${points}，当前积分: ${newPoints}`)
    return true
  },

  // 获取当前积分
  getPoints: () => {
    return get().userInfo?.points || 0
  },

  // 获取当前关卡（从上次保存的进度开始，如果没有则从第1关开始）
  getCurrentLevel: () => {
    try {
      const gameProgress = Taro.getStorageSync('gameProgress') || {}
      const currentLevel = gameProgress.currentLevel || 1
      console.log('📋 获取当前关卡:', currentLevel)
      return currentLevel
    } catch (error) {
      console.error('❌ 获取当前关卡失败:', error)
      return 1
    }
  },

  // 获取关卡图片
  getLevelImage: (level: number) => {
    return get().levelImages[level]
  }
}))
