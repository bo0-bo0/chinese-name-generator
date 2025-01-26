export async function onRequest(context) {
  try {
    // 获取环境变量
    const API_KEY = context.env.API_KEY;
    const API_URL = context.env.API_URL || "https://api.deepseek.com/v1/chat/completions";

    // 检查请求方法
    if (context.request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // 获取请求体
    const requestData = await context.request.json();

    // 构建发送到 DeepSeek 的请求
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: requestData.model || "deepseek-chat",
        temperature: requestData.temperature || 0.8,
        max_tokens: requestData.max_tokens || 2000,
        messages: requestData.messages
      })
    });

    // 检查响应状态
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API request failed: ${error}`);
    }

    // 获取并返回响应数据
    const data = await response.json();

    // 设置 CORS 头
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Content-Type": "application/json"
    };

    return new Response(JSON.stringify(data), { headers });
  } catch (error) {
    // 错误处理
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

// 处理 OPTIONS 请求（CORS 预检请求）
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
} 