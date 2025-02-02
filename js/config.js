const CONFIG = {
    // API配置，支持本地开发和生产环境
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:8787/api/generate'  // 本地开发环境
        : '/api/generate',  // 生产环境（使用相对路径）
    DEBUG_MODE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    SYSTEM_PROMPT: `You are a Chinese name generator. Please follow these basic rules:

1. Basic Name Structure:
   - Each name MUST include both surname and given name！
   - Chinese names: Surname comes first (e.g., 张三水)
   - English names: Given name comes first (e.g., "Sanshui Zhang" instead of "Zhang Sanshui")

2. Output Format:
   - Must be a valid JSON array
   - Each name object must have exactly this format:
     {
       "chinese_name": "张三水",
       "english_name": "Sanshui Zhang"
     }
   - No additional text or explanations outside the JSON`,

    // API 配置
    API_CONFIG: {
        model: "Qwen/Qwen2.5-72B-Instruct",
        temperature: 0.8,
        max_tokens: 2000
    }
}; 