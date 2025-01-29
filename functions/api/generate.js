export default {
  async fetch(request, env, ctx) {
    try {
      // 获取环境变量并验证
      const API_KEY = env.API_KEY;
      if (!API_KEY) {
        throw new Error('API_KEY is not configured');
      }

      const API_URL = env.API_URL || "https://api.deepseek.com/v1/chat/completions";

      // 检查请求方法
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400"
          }
        });
      }

      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      // 获取请求体
      const requestData = await request.json();

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
        console.error('API Error:', error);
        throw new Error(`API request failed: ${error}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
}; 