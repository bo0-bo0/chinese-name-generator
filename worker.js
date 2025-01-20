export default {
  async fetch(request, env) {
    // 处理CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 只允许POST请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const requestData = await request.json();
      
      // 调用Coze API
      const response = await fetch('https://api.coze.cn/v1/workflow/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.COZE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters: requestData.parameters,
          workflow_id: "7460645771781423167"
        }),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
}; 