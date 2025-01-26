# 中文姓名生成器 (Chinese Name Generator)

一个专业的中文姓名生成工具，帮助用户创建富有文化内涵的中文名字。

## 主要功能

- **男孩名字生成器**
  - 提供传统、现代和新生代风格选择
  - 支持固定姓氏选项
  - 可指定特定字符及其位置
  - 包含字义和发音说明

- **女孩名字生成器**
  - 融合自然、美德和外貌元素
  - 多种时代风格可选
  - 支持自定义姓氏
  - 详细的字义解释

- **通用名字生成器**
  - 支持多种命名风格：
    - 古典风格（传统优雅）
    - 现代风格（简约时尚）
    - 文学风格（诗词典故）
    - 港台风格（粤语/闽南语美学）
  
  - 支持多个时代特色：
    - 古代（1840年前）
    - 民国时期（1840-1949）
    - 红色年代（1950-1979）
    - 当代（1980-1999）
    - 2000年后

## 特色功能

- 支持中英文双语显示
- 可自定义生成名字数量（1-5个）
- 可选择固定字符及其位置
- 提供详细的字义和文化内涵解释
- 支持自定义姓氏

## 使用说明

1. 选择需要使用的生成器（男孩/女孩/通用）
2. 设置所需参数：
   - 选择命名风格
   - 设置时代特色（可选）
   - 输入固定姓氏（可选）
   - 选择固定字符及位置（可选）
3. 设置需要生成的名字数量
4. 点击"生成名字"按钮
5. 查看生成结果，包含中文名和对应的英文翻译

## 技术特点

- 响应式设计，支持各种设备
- 优雅的用户界面
- 实时生成结果
- 详细的文化背景说明

## 版权信息

© 2024 Chinese Name Generator. All rights reserved.

## 部署说明

### 环境要求
- Node.js 16+
- Cloudflare 账号

### 部署步骤

1. **Fork 项目到 GitHub**
   ```bash
   git clone <your-forked-repo>
   cd chinese-name-generator
   ```

2. **设置 Cloudflare**
   - 在 Cloudflare Dashboard 创建新的 Workers & Pages 项目
   - 连接你的 GitHub 仓库
   - 在环境变量中添加：
     - `API_KEY`: 你的 DeepSeek API 密钥
     - `API_URL`: DeepSeek API 地址

3. **配置部署**
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 部署分支：`main`

4. **触发部署**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **创建环境变量文件**
   ```bash
   cp .env.example .env
   ```
   编辑 `.env` 文件并添加你的 API 密钥

3. **启动开发服务器**
   ```bash
   npm run dev
   ``` 