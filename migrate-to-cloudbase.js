'use strict';

// 数据迁移脚本：从 Supabase 迁移到云开发
// 使用前请先配置环境变量

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const cloud = require('@cloudbase/node-sdk');

// 配置 Supabase
const SUPABASE_URL = process.env.COZE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.COZE_SUPABASE_ANON_KEY;

// 配置云开发
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a';

async function migrateData() {
  console.log('🚀 开始数据迁移...');
  
  try {
    // 1. 初始化 Supabase
    console.log('📦 初始化 Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // 2. 初始化云开发
    console.log('☁️  初始化云开发...');
    const app = cloud.init({
      env: CLOUDBASE_ENV
    });
    const db = app.database();
    
    // 3. 从 Supabase 读取用户数据
    console.log('📥 从 Supabase 读取用户数据...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ 从 Supabase 读取用户数据失败:', error);
      throw error;
    }
    
    console.log(`✅ 成功读取 ${users.length} 个用户数据`);
    
    // 4. 迁移到云开发
    console.log('📤 开始迁移到云开发...');
    let successCount = 0;
    let failCount = 0;
    
    for (const user of users) {
      try {
        // 转换字段名
        const cloudbaseUser = {
          openid: user.openid,
          nickname: user.nickname || '匿名用户',
          avatarUrl: user.avatar_url || '',
          highestLevel: user.highest_level || 0,
          points: user.points || 0,
          createdAt: user.created_at || new Date(),
          updatedAt: user.updated_at || new Date()
        };
        
        // 检查用户是否已存在
        const { data: existingUsers } = await db
          .collection('users')
          .where({
            openid: db.command.eq(cloudbaseUser.openid)
          })
          .get();
        
        if (existingUsers && existingUsers.length > 0) {
          // 用户已存在，更新
          await db
            .collection('users')
            .doc(existingUsers[0]._id)
            .update({
              data: {
                ...cloudbaseUser,
                updatedAt: new Date()
              }
            });
          console.log(`✅ 更新用户: ${cloudbaseUser.nickname}`);
        } else {
          // 用户不存在，创建
          await db
            .collection('users')
            .add({
              data: cloudbaseUser
            });
          console.log(`✅ 创建用户: ${cloudbaseUser.nickname}`);
        }
        
        successCount++;
      } catch (err) {
        console.error(`❌ 迁移用户失败: ${user.nickname}`, err);
        failCount++;
      }
    }
    
    console.log('\n🎉 数据迁移完成！');
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${failCount}`);
    
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    process.exit(1);
  }
}

// 运行迁移
migrateData();
