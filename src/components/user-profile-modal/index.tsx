import { View, Text, Input, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface UserProfileModalProps {
  visible: boolean
  onClose: () => void
  onSave: (nickname: string, avatarUrl: string) => void
  initialNickname?: string
  initialAvatarUrl?: string
}

export default function UserProfileModal({
  visible,
  onClose,
  onSave,
  initialNickname = '',
  initialAvatarUrl = ''
}: UserProfileModalProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)

  const handleChooseAvatar = async (e) => {
    const { avatarUrl: selectedAvatarUrl } = e.detail

    console.log('用户选择头像（本地路径）:', selectedAvatarUrl)

    // 显示上传提示
    setIsUploading(true)
    Taro.showLoading({ title: '上传头像...' })

    try {
      // 使用腾讯云存储上传文件
      const result = await Taro.cloud.uploadFile({
        cloudPath: `avatars/${Date.now()}.jpg`,
        filePath: selectedAvatarUrl
      })

      console.log('头像上传响应:', result)

      if (result.fileID) {
        // 使用腾讯云存储的文件 ID
        setAvatarUrl(result.fileID)
        console.log('头像上传成功，云存储 ID:', result.fileID)
        Taro.showToast({
          title: '头像上传成功',
          icon: 'success'
        })
      } else {
        throw new Error('上传失败：未返回文件 ID')
      }
    } catch (error) {
      console.error('上传头像失败:', error)
      Taro.showToast({
        title: '头像上传失败',
        icon: 'none'
      })
      // 上传失败时，回退到使用本地路径
      setAvatarUrl(selectedAvatarUrl)
    } finally {
      setIsUploading(false)
      Taro.hideLoading()
    }
  }

  const handleNicknameChange = (e) => {
    setNickname(e.detail.value)
  }

  const handleSave = () => {
    if (!nickname.trim()) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (!avatarUrl) {
      Taro.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return
    }

    onSave(nickname.trim(), avatarUrl)
    onClose()
  }

  const handleCancel = () => {
    // 使用默认值
    onSave('拼图玩家', '')
    onClose()
  }

  if (!visible) return null

  return (
    <View className="user-profile-modal-mask" onClick={onClose}>
      <View className="user-profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <Text className="block modal-title">完善个人信息</Text>
        <Text className="block modal-subtitle">请选择头像和输入昵称</Text>

        {/* 头像选择 */}
        <View className="avatar-section">
          <Text className="block section-label">头像</Text>
          <View className="avatar-wrapper">
            {avatarUrl ? (
              <Image className="avatar-image" src={avatarUrl} mode="aspectFill" />
            ) : (
              <View className="avatar-placeholder">
                <Text className="block avatar-placeholder-text">选择头像</Text>
              </View>
            )}
            <Button
              className="avatar-button"
              openType="chooseAvatar"
              onChooseAvatar={handleChooseAvatar}
              disabled={isUploading}
            >
              {isUploading ? '上传中...' : (avatarUrl ? '更换' : '选择头像')}
            </Button>
          </View>
        </View>

        {/* 昵称输入 */}
        <View className="nickname-section">
          <Text className="block section-label">昵称</Text>
          <View className="input-wrapper">
            <Input
              className="nickname-input"
              type="nickname"
              placeholder="请输入昵称"
              value={nickname}
              onInput={handleNicknameChange}
              maxlength={12}
            />
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="button-group">
          <Button className="cancel-button" onClick={handleCancel}>
            跳过
          </Button>
          <Button className="confirm-button" onClick={handleSave}>
            保存
          </Button>
        </View>
      </View>
    </View>
  )
}
