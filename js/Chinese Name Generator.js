// 名字生成器特定的配置
const GENERATOR_CONFIG = {
    style_map: {
        "classical": "Classical",
        "modern": "Modern",
        "literary": "Literary",
        "hk-tw": "HK-TW",
        "": "Default"
    },
    era_map: {
        "ancient": "Ancient (Pre-1840)",
        "republic": "Republic (1840-1949)",
        "red": "Red Era (1950-1979)",
        "contemporary": "Contemporary (1980-1999)",
        "post-2000": "Post-2000s",
        "": "Default"
    },
    gender_map: {
        "male": "Male",
        "female": "Female",
        "": "Any"
    },
    length_map: {
        "random": "Random",
        "single": "Single Character",
        "two": "Two Characters",
        "": "Random"
    },
    OUTPUT_FORMAT: `[
    {
        "中文名": "张三水",
        "英文名": "Sanshui Zhang"
    }
]`,
    STYLE_RULES: `
Style Guidelines:
- Classical: Use traditional elegant characters
- Modern: Use contemporary simple characters
- Literary: Must have references from classical poetry
- HK-TW: Must match Cantonese/Min pronunciation aesthetics`,
    ERA_RULES: `
Era Characteristics:
- Ancient (Pre-1840): Use classical characters (e.g., 之、衍、琬), avoid modern words. 25% chance to generate single-character given names
- Republic (1840-1949): Use transitional style (e.g., 静秋、书桓), avoid simplified characters
- Red Era (1950-1979): Use revolutionary elements (e.g., 卫东、红梅)
- Contemporary (1980-1999): 25% chance to generate single-character given names. First character often uses: 文、华、志、建、秀、雅、婷、玉; second character often uses: 明、芳、燕、红、莉、强、伟、军
- Post-2000s: Use artistic names (e.g., 梓涵、宇轩)`
};

document.addEventListener('DOMContentLoaded', () => {
    // 菜单控制
    const menuBtn = document.querySelector('.menu-btn');
    const menuPanel = document.querySelector('.menu-panel');
    
    menuBtn.addEventListener('click', () => {
        menuPanel.classList.toggle('active');
    });

    // 点击菜单外区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!menuPanel.contains(e.target) && !menuBtn.contains(e.target)) {
            menuPanel.classList.remove('active');
        }
    });

    // State management
    const state = {
        style: '',
        era: '',
        gender: '',
        length: '',
        count: 5
    };

    // Button click handlers
    document.querySelectorAll('button[data-style]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.style = '';
            } else {
                updateSelection('style', btn);
                // 取消年代组的选择
                document.querySelectorAll('button[data-era]').forEach(eraBtn => {
                    eraBtn.classList.remove('active');
                });
                state.era = '';
            }
        });
    });

    document.querySelectorAll('button[data-era]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.era = '';
            } else {
                updateSelection('era', btn);
                // 取消风格组的选择
                document.querySelectorAll('button[data-style]').forEach(styleBtn => {
                    styleBtn.classList.remove('active');
                });
                state.style = '';
            }
        });
    });

    document.querySelectorAll('button[data-gender]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.gender = '';
            } else {
                updateSelection('gender', btn);
            }
        });
    });

    document.querySelectorAll('button[data-length]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.length = '';
            } else {
                updateSelection('length', btn);
            }
        });
    });

    // Slider handler
    const nameCount = document.getElementById('nameCount');
    const nameCountDisplay = document.getElementById('nameCountDisplay');
    nameCount.addEventListener('input', (e) => {
        state.count = e.target.value;
        nameCountDisplay.textContent = state.count;
    });

    // Generate button handler
    document.getElementById('generateBtn').addEventListener('click', generateNames);

    // Generate names
    async function generateNames() {
        const resultsSection = document.getElementById('results');
        resultsSection.innerHTML = '<div class="loading">Generating...</div>';

        try {
            const userPrompt = `Please generate ${state.count} Chinese name(s) with the following specifications:

Style: ${GENERATOR_CONFIG.style_map[state.style] || "Default"}
Era: ${GENERATOR_CONFIG.era_map[state.era] || "Default"}
Gender: ${GENERATOR_CONFIG.gender_map[state.gender] || "Any"}

${state.style ? GENERATOR_CONFIG.STYLE_RULES : ''}
${state.era ? GENERATOR_CONFIG.ERA_RULES : ''}`;

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    ...CONFIG.API_CONFIG,
                    messages: [
                        {
                            role: "system",
                            content: CONFIG.SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (CONFIG.DEBUG_MODE) {
                console.log('API Response:', data);
            }

            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Invalid API response format');
            }

            const content = data.choices[0].message.content.trim();
            displayResults(content);
        } catch (error) {
            if (CONFIG.DEBUG_MODE) {
                console.error('Error:', error);
            }
            resultsSection.innerHTML = `<div class="error">Generation failed: ${error.message}</div>`;
        }
    }

    // Display results
    function displayResults(content) {
        const resultsSection = document.getElementById('results');
        resultsSection.innerHTML = '';

        try {
            // Clean potential non-JSON characters
            const cleanContent = content.replace(/^[^[\{]*/g, '').replace(/[^\}\]]*$/g, '');
            const names = JSON.parse(cleanContent);

            if (!Array.isArray(names)) {
                throw new Error('Response is not an array');
            }

            names.forEach(name => {
                // 支持两种格式：Chinese/English 或 中文名/英文名
                const chineseName = name.Chinese || name.中文名;
                const englishName = name.English || name.英文名;

                if (!chineseName || !englishName) {
                    throw new Error('Invalid name format');
                }

                const nameElement = document.createElement('div');
                nameElement.className = 'name-item';
                nameElement.innerHTML = `
                    <div class="chinese-name">${chineseName}</div>
                    <div class="english-name">${englishName}</div>
                `;
                resultsSection.appendChild(nameElement);
            });

            if (names.length === 0) {
                resultsSection.innerHTML = '<div class="error">No names generated</div>';
            }
        } catch (error) {
            if (CONFIG.DEBUG_MODE) {
                console.error('Parse Error:', error);
                console.error('Raw content:', content);
            }
            resultsSection.innerHTML = `<div class="error">Failed to parse results: ${error.message}</div>`;
        }
    }

    // Update selection state
    function updateSelection(type, button) {
        // Remove active class from other buttons in the same group
        button.parentElement.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to current button
        button.classList.add('active');
        // Update state
        state[type] = button.dataset[type];
    }
}); 