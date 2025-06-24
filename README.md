# v-bc

## 简介

本仓库提供了一个示例方案，演示如何开发"食堂报餐"微信小程序。用户可以通过小程序查看食堂提供的菜谱并报餐，管理员能够上传菜谱并统计报餐情况。

下文给出从零开始搭建此类小程序的基本步骤，供参考。

## 1. 注册并准备开发环境

1. 访问 [mp.weixin.qq.com](https://mp.weixin.qq.com)（可能需要企业主体注册）并注册微信小程序。若只用于测试，可申请免费的测试号。
2. 下载并安装**微信开发者工具**，登录后新建项目。

> 若仅在公司内部试用，可以使用测试号或添加测试人员。正式发布到线上通常需要企业认证，微信官方目前对企业认证收取约 300 元人民币的费用。

## 2. 创建小程序工程

1. 在微信开发者工具中新建项目，会得到如下目录结构：
   ```
   ├─ miniprogram/
   │  ├─ pages/
   │  │  ├─ index/
   │  │  │  ├─ index.js
   │  │  │  ├─ index.json
   │  │  │  ├─ index.wxml
   │  │  │  └─ index.wxss
   │  │  └─ admin/              # 管理员页面
   │  ├─ app.js
   │  ├─ app.json
   │  └─ app.wxss
   └─ package.json             # 如使用云开发或 npm 包
   ```
2. `app.json` 中配置全局窗口样式和页面路径；`app.js` 可放置全局逻辑。

## 3. 前端页面基本示例

**index.wxml** （展示菜谱并选择报餐）：
```xml
<view>
  <block wx:for="{{menu}}" wx:key="name">
    <checkbox-group>
      <label>
        <checkbox value="{{item.meal}}"/> {{item.meal}}
      </label>
    </checkbox-group>
  </block>
  <button bindtap="submitOrder">提交报餐</button>
</view>
```

**index.js** （从后端获取菜谱并提交）：
```javascript
Page({
  data: {
    menu: []
  },
  onLoad() {
    wx.request({
      url: 'https://your-server.example.com/api/menu',
      success: res => {
        this.setData({ menu: res.data });
      }
    });
  },
  submitOrder() {
    wx.request({
      method: 'POST',
      url: 'https://your-server.example.com/api/order',
      data: {
        userId: wx.getStorageSync('userId'),
        meals: this.data.selectedMeals
      },
      success: () => {
        wx.showToast({ title: '已报餐' });
      }
    });
  }
});
```

管理员页面可以提供菜谱上传和报餐统计功能，可根据需要新增表单和图表等组件。

## 4. 后端示例

示例后端可以使用 **Spring Boot**（Java）或 Node.js。以下为精简的接口设计示例：

- `POST /api/login`：登录并返回用户身份信息。
- `GET /api/menu`：获取某日菜谱。
- `POST /api/menu`：上传菜谱（管理员权限）。
- `POST /api/order`：用户报餐。
- `GET /api/stat`：查询报餐统计数据。

数据库可使用 MySQL。表设计示意：`users`、`menu`、`orders` 等。

## 5. 部署与测试

1. 后端部署在公司服务器或云服务（如腾讯云、阿里云）。
2. 在微信开发者工具中配置合法的请求域名（需备案的 HTTPS 地址）。
3. 通过**上传代码**按钮将小程序上传至微信后台，然后添加测试人员即可在手机上体验。
4. 如果仅在内部使用，可以维持测试模式；若希望正式发布给所有微信用户，需要完成企业认证并走审核流程。

## 费用说明

- **开发和测试**：微信开发者工具本身免费；申请测试号也不需要费用。
- **正式发布**：若以企业主体注册并发布小程序，微信官方会收取一次性验证费（约 300 元人民币）。个人目前无法独立发布小程序，只能绑定在企业或个体工商户名下。

## 示例后端快速启动

示例仓库中包含一个基于 **Node.js** 的简单后端(`server` 目录)。如需在本地测试，可依次执
行：

```bash
cd server
npm install
npm start
```

随后访问 `http://localhost:3000/api/menu` 即可获取菜谱数据，其他接口与文档中描述保持一
致。

## 小结

- 微信小程序前端用于展示菜谱和提交报餐；
- 后端（如 Spring Boot）负责存储菜谱和报餐数据并提供接口；
- 管理员可在小程序或单独的后台页面上传菜谱并查看统计；
- 仅在公司内部试用可通过测试号或添加测试人员，无需支付认证费用。

根据以上步骤即可搭建一个简单的"食堂报餐"小程序，并通过微信分享给同事使用。

