import Taro from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface DesignScheme {
  id: string
  name: string
  description: string
  features: string[]
  imageUrl: string
  loading: boolean
}

export default function DesignPreviewPage() {
  const [schemes, setSchemes] = useState<DesignScheme[]>([
    {
      id: 'A',
      name: '杂志质感柔和风格',
      description: '温暖舒适、杂志排版、柔和光影，适合长期玩、注重舒适度的用户',
      features: ['暖白色背景', '大量留白', '细腻纹理', '柔和光晕'],
      imageUrl: '',
      loading: true
    },
    {
      id: 'B',
      name: '科幻未来主义风格',
      description: '霓虹光效、3D纵深感、未来科技感，适合追求视觉冲击、科技感的用户',
      features: ['深色背景', '霓虹光效', '毛玻璃', '3D立体'],
      imageUrl: '',
      loading: true
    },
    {
      id: 'C',
      name: '动态排版 + 叙事化设计',
      description: '渐进式信息展示、沉浸式体验、动态文字，适合注重游戏节奏、成就感累积的用户',
      features: ['动态排版', '模块化布局', '叙事化', '渐进式'],
      imageUrl: '',
      loading: true
    },
    {
      id: 'D',
      name: '新复古像素风格',
      description: '怀旧像素风 + 现代高分辨率 + 精细动画，适合怀旧玩家、像素艺术爱好者',
      features: ['8-bit像素', '复古配色', '高分辨率', '精细动画'],
      imageUrl: '',
      loading: true
    },
    {
      id: 'E',
      name: '触觉极致化 + 3D纵深感',
      description: '物理质感、3D立体、触觉反馈，适合追求真实感、注重物理反馈的用户',
      features: ['3D按钮', '细腻阴影', '悬浮感', '物理质感'],
      imageUrl: '',
      loading: true
    }
  ])

  useEffect(() => {
    // 为每个方案生成预览图
    schemes.forEach(async (scheme) => {
      try {
        const response = await Network.request({
          url: '/api/design-preview/generate',
          method: 'POST',
          data: { scheme: scheme.id }
        })

        if (response.data.code === 200) {
          setSchemes(prev => prev.map(s =>
            s.id === scheme.id
              ? { ...s, imageUrl: response.data.data.imageUrl, loading: false }
              : s
          ))
        } else {
          console.error('生成失败:', response.data.msg)
          setSchemes(prev => prev.map(s =>
            s.id === scheme.id ? { ...s, loading: false } : s
          ))
        }
      } catch (error) {
        console.error('生成预览图错误:', error)
        setSchemes(prev => prev.map(s =>
          s.id === scheme.id ? { ...s, loading: false } : s
        ))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectScheme = (schemeId: string) => {
    Taro.setStorageSync('selectedDesignScheme', schemeId)
    Taro.showToast({
      title: `已选择方案 ${schemeId}`,
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  return (
    <View className="design-preview-page">
      <View className="header">
        <Text className="header-title">选择设计方案</Text>
        <Text className="header-subtitle">点击图片查看大图，选择按钮确认方案</Text>
      </View>

      <View className="schemes-list">
        {schemes.map((scheme) => (
          <View key={scheme.id} className="scheme-card">
            <View className="scheme-number">方案 {scheme.id}</View>
            <View
              className="scheme-image"
              onClick={() => {
                if (scheme.imageUrl) {
                  Taro.previewImage({
                    urls: [scheme.imageUrl],
                    current: scheme.imageUrl
                  })
                }
              }}
            >
              {scheme.loading ? (
                <View className="loading-placeholder">
                  <Text className="loading-text">生成中...</Text>
                </View>
              ) : scheme.imageUrl ? (
                <Image
                  src={scheme.imageUrl}
                  mode="aspectFill"
                  className="preview-image"
                />
              ) : (
                <View className="error-placeholder">
                  <Text className="error-text">生成失败</Text>
                </View>
              )}
            </View>
            <View className="scheme-content">
              <Text className="scheme-name">{scheme.name}</Text>
              <Text className="scheme-description">{scheme.description}</Text>
              <View className="scheme-features">
                {scheme.features.map((feature, index) => (
                  <View key={index} className="feature-tag">
                    <Text className="feature-text">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Button
              className="select-button"
              onClick={() => handleSelectScheme(scheme.id)}
              disabled={!scheme.imageUrl}
            >
              选择此方案
            </Button>
          </View>
        ))}
      </View>
    </View>
  )
}
