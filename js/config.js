const CONFIG = {
    API_URL: "/api/generate", // 改为使用相对路径，指向我们的后端API
    DEBUG_MODE: false,  // 生产环境关闭调试模式
    SYSTEM_PROMPT: `You are a Chinese name generator. Please follow these basic rules:

1. Basic Name Structure:
   - Each name MUST include both surname and given name！
   - Chinese names: Surname comes first (e.g., 张三水)
   - English names: Given name comes first (e.g., "Sanshui Zhang" instead of "Zhang Sanshui")

2. Output Format:
   - Must be a valid JSON array
   - No additional text or explanations outside the JSON
   - Each name object must include Chinese and English versions`,

    // API 配置
    API_CONFIG: {
        model: "deepseek-ai/DeepSeek-V3",
        temperature: 0.8,
        max_tokens: 2000
    }
}; 