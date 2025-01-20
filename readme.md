## 项目概述
本项目是一个工具型网站，用户可以通过输入英文名，生成适合自己的中文名。该网站以“Chinese name generation”为主题进行 SEO 优化，旨在为用户提供一个简单、快捷的中文名生成工具。

## 网站设计风格
整体风格：简约风格，主色调为灰色，模块划分清晰。
导航菜单：左上角为折叠菜单，包含多个分类标题及子项（文章页）。
网站标题：正上方居中显示。
功能区：包含输入框、可选项、执行按钮和输出内容展示区。
SEO 区：正下方以问答和文字形式展示主页 SEO 内容。
语言选择和工具设置：右上角提供网站语言选择和工具设置功能。

## 网站主题描述
网站语言：英文站点。
功能介绍：用户输入英文名，可以选择生成中文名的风格（例如：古典风格），点击执行按钮后，网站将调用 API 生成适合用户的中文名。
SEO 优化：针对“Chinese name generation”进行 SEO 优化，提高网站在搜索引擎中的排名。

## 技术栈
前端技术：HTML、CSS、JavaScript
API 调用：通过前端调用第三方 API 实现中文名生成功能

## 文件结构
project/
├── index.html          # 网站首页
├── css/                # CSS 样式文件
│   └── style.css
├── js/                 # JavaScript 文件
│   └── script.js
├── img/                # 图片资源
└── README.md           # 项目说明文件

## API 接口
请求方法：POST
请求 URL：https://api.coze.cn/v1/workflow/run
请求头：
Authorization: Bearer pat_s6y1wmZZpPpvpyzWnbj5xf3PNYHXtq1E8wKcIYDAEaaTIjivLCkIQagW3OGmaJA8
Content-Type: application/json

请求参数：
json
{
  "parameters": {
    "eng_name": "输入的英文名",
    "requirements": "请使用有中国古典意蕴的汉字"
  },
  "workflow_id": "7460645771781423167"
}
示例：
curl -X POST 'https://api.coze.cn/v1/workflow/run' \
-H "Authorization: Bearer pat_s6y1wmZZpPpvpyzWnbj5xf3PNYHXtq1E8wKcIYDAEaaTIjivLCkIQagW3OGmaJA8" \
-H "Content-Type: application/json" \
-d '{
  "parameters": {
    "eng_name": "Alice",
    "requirements": "请使用有中国古典意蕴的汉字"
  },
  "workflow_id": "7460645771781423167"
}'

## 使用说明
运行项目：
打开 index.html 文件，即可在浏览器中查看网站效果。

调用 API：
在 script.js 文件中编写调用 API 的代码，并将输入框中的值和可选项的值作为参数传递给 API。

添加新功能：
可以根据需求添加新的功能模块，并在导航菜单中添加相应的链接。