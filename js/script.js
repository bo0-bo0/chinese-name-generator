document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const englishNameInput = document.getElementById('englishName');
    const chineseNameOutput = document.getElementById('chineseName');
    const generateBtn = document.getElementById('generateBtn');
    const styleOptions = document.querySelectorAll('.style-option');

    // API配置 - 请将此URL替换为您的实际Worker URL
    const API_URL = 'https://chinese-name-generator.crow-boy.workers.dev';

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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parameters: {
                        eng_name: englishName,
                        requirements: `请使用${selectedStyle === 'classical' ? '有中国古典意蕴的汉字' : 
                                    selectedStyle === 'modern' ? '现代简约的汉字' : '富有艺术气息的汉字'}`
                    }
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            // 解析嵌套的JSON字符串
            if (data.data) {
                const innerData = JSON.parse(data.data);
                if (innerData.data) {
                    const lines = innerData.data.split('\n');
                    
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
                    
                    return;
                }
            }
            
            chineseNameOutput.textContent = '未能生成名字';

        } catch (error) {
            console.error('Error:', error);
            chineseNameOutput.textContent = '生成失败，请稍后重试';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Name';
        }
    });
}); 