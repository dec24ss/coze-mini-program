import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { injectH5Styles } from '@/utils/h5-styles';
import { enableWxDebugIfNeeded } from '@/utils/wx-debug';
import '@/app.css';

export default ({ children }: PropsWithChildren<any>) => {
  useLaunch(() => {
    enableWxDebugIfNeeded();
    injectH5Styles();

    // 初始化腾讯云开发环境
    // 🔴 部署后需要替换为你的腾讯云环境 ID
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      try {
        Taro.cloud.init({
          env: 'db-2gaczaywd186652b',  // 腾讯云环境 ID
          traceUser: true
        })
        console.log('腾讯云开发环境初始化成功')
      } catch (error) {
        console.error('腾讯云开发环境初始化失败:', error)
      }
    }
  });

  return children;
};
