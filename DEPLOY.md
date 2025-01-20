# 部署指南

## 准备工作

1. 安装 Node.js（如果还没有）
2. 安装 Wrangler CLI:
```bash
npm install -g wrangler
```

## 部署步骤

1. 登录到 Cloudflare：
```bash
wrangler login
```

2. 设置 API 令牌（请替换为实际的令牌）：
```bash
wrangler secret put COZE_API_TOKEN
```
输入您的 Coze API 令牌。

3. 部署 Worker：
```bash
wrangler deploy
```

4. 部署完成后，Cloudflare 会提供一个域名，类似：
```
https://chinese-name-generator.xxx.workers.dev
```

5. 更新前端代码中的 API URL：
打开 `js/script.js`，找到 `API_URL` 常量，将其更新为您的 Worker URL：
```javascript
const API_URL = 'https://your-worker-url.workers.dev';
```

## 注意事项

1. 确保 `wrangler.toml` 中没有敏感信息
2. 不要将 API 令牌提交到 Git 仓库
3. 如果遇到 CORS 错误，可能需要在 Worker 中配置允许的域名
4. 确保您的 Cloudflare 账户有足够的配额

## 常见问题

1. 如果遇到连接错误，请检查：
   - Worker 是否成功部署
   - API_URL 是否正确设置
   - 网络连接是否正常

2. 如果遇到 API 错误，请检查：
   - API 令牌是否正确设置
   - 是否有足够的 API 调用配额

3. 如果需要更新 Worker：
```bash
wrangler deploy
``` 