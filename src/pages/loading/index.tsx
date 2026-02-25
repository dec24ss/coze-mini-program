import { View, Text, Progress } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.css'

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 模拟加载进度
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          // 加载完成后跳转到首页
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/index/index' })
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <View className="loading-page">
      <View className="loading-content">
        <Text className="block loading-title">海海拼图大作战</Text>
        <Progress
          className="loading-progress"
          percent={progress}
          strokeWidth={8}
          activeColor="#3B82F6"
          backgroundColor="#E5E7EB"
          active
          showInfo={false}
        />
        <Text className="block loading-text">加载中... {progress}%</Text>
      </View>
    </View>
  )
}
