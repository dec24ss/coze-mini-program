// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileID, openid, fileName } = event

  console.log('上传文件参数:', { fileID, openid, fileName })

  try {
    // 如果已经提供了fileID（通过其他方式上传），直接返回
    if (fileID) {
      const result = await cloud.getTempFileURL({
        fileList: [fileID]
      })

      if (result.fileList && result.fileList.length > 0) {
        const tempFileURL = result.fileList[0].tempFileURL
        console.log('获取文件临时URL成功:', tempFileURL)

        return {
          code: 200,
          msg: '上传成功',
          data: {
            fileID,
            tempFileURL
          }
        }
      }
    }

    // 如果没有fileID，返回错误
    return {
      code: 400,
      msg: '缺少fileID参数'
    }
  } catch (error) {
    console.error('上传文件失败:', error)
    return {
      code: 500,
      msg: '上传失败: ' + error.message
    }
  }
}
