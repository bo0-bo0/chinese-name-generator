export default {
  async fetch(request, env, ctx) {
    // 定义通用的CORS头
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    };

    try {
      // 从环境变量获取配置
      const API_KEY = env.API_KEY;
      const API_URL = env.API_URL || "https://api.siliconflow.cn/v1/chat/completions";

      // 验证必要的环境变量
      if (!API_KEY) {
        throw new Error('API_KEY environment variable is not configured');
      }

      if (!API_URL) {
        throw new Error('API_URL environment variable is not configured');
      }

      // 检查请求方法
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      if (request.method !== "POST") {
        return new Response("Method not allowed", { 
          status: 405,
          headers: corsHeaders
        });
      }

      // 获取请求体
      const requestData = await request.json();

      // 构建发送到 API 的请求
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: requestData.model || "Qwen/Qwen2.5-72B-Instruct",
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
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
  }
}; 