document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const englishNameInput = document.getElementById('englishName');
    const chineseNameOutput = document.getElementById('chineseName');
    const generateBtn = document.getElementById('generateBtn');
    const styleOptions = document.querySelectorAll('.style-option');

    // API配置
    const API_URL = 'https://api.coze.cn/v1/workflow/run';  // 直接使用 Coze API
    const API_KEY = 'pat_s6y1wmZZpPpvpyzWnbj5xf3PNYHXtq1E8wKcIYDAEaaTIjivLCkIQagW3OGmaJA8';

    // 样式选择
    let selectedStyle = 'classical';
    styleOptions.forEach(option => {
        option.addEventListener('click', () => {
            styleOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedStyle = option.dataset.style;
        });
    });

    // 生成中文名
    generateBtn.addEventListener('click', async () => {
        const englishName = englishNameInput.value.trim();
        if (!englishName) {
            alert('Please enter your name');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                },
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify({
                    parameters: {
                        eng_name: englishName,
                        requirements: `请使用${selectedStyle === 'classical' ? '有中国古典意蕴的汉字' : 
                                    selectedStyle === 'modern' ? '现代简约的汉字' : '富有艺术气息的汉字'}`
                    },
                    workflow_id: "7460645771781423167"
                })
            });

            if (!response.ok) {
                console.error('API Response Status:', response.status);
                console.error('API Response Headers:', Object.fromEntries(response.headers.entries()));
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('API Response:', responseData);
            
            if (responseData.code === 0 && responseData.data) {
                try {
                    // 解析嵌套的 JSON 字符串
                    const parsedData = JSON.parse(responseData.data);
                    console.log('Parsed Data:', parsedData);
                    
                    if (parsedData.data) {
                        const lines = parsedData.data.split('\n');
                        console.log('Split Lines:', lines);
                        
                        // 清除之前的内容
                        chineseNameOutput.innerHTML = '';
                        
                        // 添加中文名
                        const nameElement = document.createElement('div');
                        nameElement.className = 'chinese-name';
                        nameElement.textContent = lines[0];
                        chineseNameOutput.appendChild(nameElement);
                        
                        // 添加拼音
                        if (lines[1]) {
                            const pinyinElement = document.createElement('div');
                            pinyinElement.className = 'pinyin';
                            pinyinElement.textContent = lines[1].replace('[', '').replace(']', '');
                            chineseNameOutput.appendChild(pinyinElement);
                        }
                        
                        // 添加诗句解释
                        if (lines[2]) {
                            const meaningElement = document.createElement('div');
                            meaningElement.className = 'name-meaning';
                            meaningElement.textContent = lines[2];
                            chineseNameOutput.appendChild(meaningElement);
                        }
                        
                        // 添加英文翻译
                        if (lines[3]) {
                            const translationElement = document.createElement('div');
                            translationElement.className = 'name-translation';
                            translationElement.textContent = lines[3];
                            chineseNameOutput.appendChild(translationElement);
                        }
                    } else {
                        console.error('No data in parsed response:', parsedData);
                        throw new Error('Invalid response data format');
                    }
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Raw Data:', responseData.data);
                    throw new Error('Failed to parse response data');
                }
            } else {
                console.error('Invalid API Response:', responseData);
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Error:', error);
            chineseNameOutput.textContent = '生成失败，请稍后重试';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Name';
        }
    });
}); 