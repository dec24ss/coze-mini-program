import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { getSupabaseClient } from '@/storage/database/supabase-client'

// 用户信息
export interface UserInfo {
  id?: string
  openid: string
  nickname: string
  avatarUrl: string
  highestLevel: number
  points: number
  hasSetProfile?: boolean
}

// 排行榜条目
export interface RankItem {
  id?: string
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
export const useUserStore = create<UserState>((set, get) => ({
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

      // 获取 Supabase 客户端
      const supabase = getSupabaseClient()

      // 生成唯一的 openid（使用时间戳和随机数）
      openid = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000)

      // 查询用户是否存在
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('openid', openid)
        .single()

      if (queryError && queryError.code !== 'PGRST116') {
        // 除了"未找到"错误外的其他错误
        throw queryError
      }

      if (existingUsers) {
        // 用户已存在
        let needUpdate = false
        const updateData: any = {}

        if (userNickname && userNickname !== existingUsers.nickname) {
          updateData.nickname = userNickname
          needUpdate = true
        }

        if (userAvatarUrl && userAvatarUrl !== existingUsers.avatar_url) {
          updateData.avatar_url = userAvatarUrl
          needUpdate = true
        }

        let currentUser = existingUsers
        
        if (needUpdate) {
          updateData.updated_at = new Date().toISOString()
          const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('openid', openid)
            .select()
            .single()

          if (updateError) {
            throw updateError
          }

          if (updatedUser) {
            currentUser = updatedUser
          }
        }

        const userInfo: UserInfo = {
          id: currentUser.id,
          openid: currentUser.openid,
          nickname: currentUser.nickname || '拼图玩家',
          avatarUrl: currentUser.avatar_url || '',
          highestLevel: currentUser.highest_level || 0,
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

        console.log('用户登录成功（Supabase）:', userInfo)
      } else {
        // 创建新用户
        const newUser = {
          openid,
          nickname: userNickname,
          avatar_url: userAvatarUrl,
          highest_level: 0,
          points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: insertedUser, error: insertError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        const userInfo: UserInfo = {
          id: insertedUser.id,
          openid: insertedUser.openid,
          nickname: insertedUser.nickname,
          avatarUrl: insertedUser.avatar_url || '',
          highestLevel: insertedUser.highest_level || 0,
          points: insertedUser.points || 0
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

        console.log('新用户创建成功（Supabase）:', userInfo)
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

    try {
      const supabase = getSupabaseClient()
      if (userInfo.id) {
        const { error } = await supabase
          .from('users')
          .update({
            nickname,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', userInfo.id)

        if (error) {
          throw error
        }
        console.log('用户信息已同步到 Supabase 数据库')
      }
    } catch (error) {
      console.error('同步用户信息失败:', error)
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

      try {
        const supabase = getSupabaseClient()
        if (userInfo.id) {
          const { error } = await supabase
            .from('users')
            .update({
              highest_level: level,
              updated_at: new Date().toISOString()
            })
            .eq('id', userInfo.id)

          if (error) {
            throw error
          }
          console.log(`最高关卡已同步到 Supabase 数据库: ${level}`)
        }
      } catch (error) {
        console.error('同步最高关卡失败:', error)
      }

      console.log(`用户最高关卡更新为: ${level}，解锁关卡: ${newUnlockedLevels}`)
    }
  },

  // 获取排行榜
  fetchRankList: async () => {
    try {
      const supabase = getSupabaseClient()

      const { data: rankData, error } = await supabase
        .from('users')
        .select('*')
        .order('highest_level', { ascending: false })
        .order('points', { ascending: false })
        .limit(100)

      if (error) {
        throw error
      }

      if (rankData) {
        const rankList: RankItem[] = rankData.map((item: any, index: number) => ({
          id: item.id,
          openid: item.openid,
          nickname: item.nickname || '匿名用户',
          avatarUrl: item.avatar_url || '',
          highestLevel: item.highest_level || 0,
          rank: index + 1
        }))

        const { userInfo } = get()
        let myRank = 0

        if (userInfo) {
          const myRankItem = rankList.find(item => item.openid === userInfo.openid)
          myRank = myRankItem?.rank || 0
        }

        set({ rankList, myRank })
        console.log('排行榜数据加载成功（Supabase），共', rankList.length, '名玩家')
      }
    } catch (error) {
      console.error('获取排行榜失败:', error)
      // 失败时使用模拟数据
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
      console.log('排行榜数据加载失败，使用模拟数据')
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

    try {
      const supabase = getSupabaseClient()
      if (userInfo.id) {
        const { error } = await supabase
          .from('users')
          .update({
            points: newPoints,
            updated_at: new Date().toISOString()
          })
          .eq('id', userInfo.id)

        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('同步积分失败:', error)
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

    try {
      const supabase = getSupabaseClient()
      if (userInfo.id) {
        const { error } = await supabase
          .from('users')
          .update({
            points: newPoints,
            updated_at: new Date().toISOString()
          })
          .eq('id', userInfo.id)

        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('同步积分失败:', error)
    }

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
