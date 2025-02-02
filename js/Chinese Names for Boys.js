// 男孩名字生成器特定的配置
const BOYS_CONFIG = {
    // 拼音到 IPA 的映射
    PINYIN_TO_IPA: {
        'a': 'a', 'ai': 'aɪ', 'an': 'an', 'ang': 'ɑŋ', 'ao': 'aʊ',
        'e': 'ɤ', 'ei': 'eɪ', 'en': 'ən', 'eng': 'ɤŋ', 'er': 'ɚ',
        'i': 'i', 'in': 'in', 'ing': 'iŋ', 'o': 'o', 'ong': 'ʊŋ',
        'ou': 'oʊ', 'u': 'u', 'ü': 'y', 'ua': 'wa', 'uai': 'waɪ',
        'uan': 'wan', 'uang': 'wɑŋ', 'ue': 'wɤ', 'ui': 'weɪ',
        'un': 'wən', 'uo': 'wo', 'v': 'y',
        'b': 'p', 'p': 'pʰ', 'm': 'm', 'f': 'f',
        'd': 't', 't': 'tʰ', 'n': 'n', 'l': 'l',
        'g': 'k', 'k': 'kʰ', 'h': 'x', 'j': 'tɕ',
        'q': 'tɕʰ', 'x': 'ɕ', 'zh': 'ʈʂ', 'ch': 'ʈʂʰ',
        'sh': 'ʂ', 'r': 'ʐ', 'z': 'ts', 'c': 'tsʰ',
        's': 's', 'w': 'w', 'y': 'j'
    },

    DIMENSION_RULES: `
Dimension Guidelines for Male Names:
- Nature dimension: Use characters related to Mountain, Forest, Thunder, Wind, River
- Virtue dimension: Use characters expressing Courage, Strength, Integrity, Decisiveness
- Appearance dimension: Use characters meaning Handsome, Majestic, Noble
- Expectation dimension: Reflect parental aspirations for success and responsibility
- Protection dimension: Implies guardianship and defense
- Poetic dimension: Use poetic imagery with strong or philosophical themes
- Modern style: Use contemporary characters
- New Generation style: Internet-aesthetic names (e.g., 宇轩、俊熙、子墨、天翊)`,

    OUTPUT_FORMAT: `
Please return the result in this exact format:
[
    {
        "chinese_name": "林浩然",
        "english_name": "Haoran Lin",
        "pinyin": "lin hao ran",
        "characters": [
            {
                "char": "浩",
                "cn_meaning": "浩瀚、胸怀宽广",
                "en_meaning": "vast and broad-minded"
            },
            {
                "char": "然",
                "cn_meaning": "坚毅果断",
                "en_meaning": "resolute and decisive"
            }
        ]
    }
]`
};

document.addEventListener('DOMContentLoaded', () => {
    // 状态管理
    const state = {
        dimension: '',
        surname: '',
        fixedChar: '',
        charPosition: '',
        nameCount: 2
    };

    // 维度按钮点击处理
    document.querySelectorAll('button[data-dimension]').forEach(btn => {
        btn.addEventListener('click', () => {
            const dimensionGroup = btn.closest('.option-group');
            const allDimensionButtons = document.querySelectorAll('button[data-dimension]');
            
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.dimension = '';
            } else {
                // 取消所有维度按钮的选中状态
                allDimensionButtons.forEach(dimBtn => {
                    dimBtn.classList.remove('active');
                });
                btn.classList.add('active');
                state.dimension = btn.dataset.dimension;
            }
        });
    });

    // 固定字符位置按钮处理
    document.querySelectorAll('button[data-position]').forEach(btn => {
        btn.addEventListener('click', () => {
            const positionButtons = document.querySelectorAll('button[data-position]');
            
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.charPosition = '';
            } else {
                positionButtons.forEach(posBtn => {
                    posBtn.classList.remove('active');
                });
                btn.classList.add('active');
                state.charPosition = btn.dataset.position;
            }
        });
    });

    // 姓氏输入处理
    const surnameInput = document.getElementById('surname');
    surnameInput.addEventListener('input', (e) => {
        state.surname = e.target.value.trim();
    });

    // 固定字符输入处理
    const fixedCharInput = document.getElementById('fixedChar');
    fixedCharInput.addEventListener('input', (e) => {
        state.fixedChar = e.target.value.trim();
    });

    // 数量滑块处理
    const nameCountSlider = document.getElementById('nameCount');
    const countDisplay = document.getElementById('countDisplay');
    
    nameCountSlider.addEventListener('input', (e) => {
        state.nameCount = parseInt(e.target.value);
        countDisplay.textContent = state.nameCount;
    });

    // 生成按钮处理
    document.getElementById('generateBtn').addEventListener('click', generateNames);

    // 生成名字
    async function generateNames() {
        const resultsSection = document.getElementById('results');
        resultsSection.innerHTML = '<div class="loading">Generating...</div>';

        try {
            const userPrompt = `Please generate ${state.nameCount} Chinese male names with these specifications:

${state.surname ? `Use the specified surname: ${state.surname}` : 'Choose an appropriate surname'}
${state.fixedChar ? `Use the fixed character: ${state.fixedChar} at ${state.charPosition} position` : ''}
Selected dimension: ${state.dimension || "Any"}

Requirements:
1. All names must be exactly two characters (excluding surname)
2. Must use common Chinese surnames

${BOYS_CONFIG.DIMENSION_RULES}
${BOYS_CONFIG.OUTPUT_FORMAT}`;

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
            
            if (!data.choices?.[0]?.message?.content) {
                throw new Error('Invalid API response format');
            }

            const content = data.choices[0].message.content.trim();
            displayResults(content);
        } catch (error) {
            resultsSection.innerHTML = `<div class="error">Generation failed: ${error.message}</div>`;
        }
    }

    // 显示结果
    function displayResults(content) {
        const resultsSection = document.getElementById('results');
        resultsSection.innerHTML = '';

        try {
            const cleanContent = content.replace(/^[^[\{]*/g, '').replace(/[^\}\]]*$/g, '');
            const names = JSON.parse(cleanContent);

            if (!Array.isArray(names)) {
                throw new Error('Response is not an array');
            }

            names.forEach(name => {
                const nameElement = document.createElement('div');
                nameElement.className = 'name-item';
                
                // 转换拼音为 IPA
                const ipaNotation = pinyinToIPAConversion(name.pinyin);
                
                nameElement.innerHTML = `
                    <div class="chinese-name">${name.chinese_name} ${name.english_name}</div>
                    <div class="pinyin">[${ipaNotation}]</div>
                    <div class="character-explanations">
                        ${name.characters.map(char => 
                            `[${char.char}]: ${char.cn_meaning} | ${char.en_meaning}`
                        ).join('<br>')}
                    </div>
                `;
                resultsSection.appendChild(nameElement);
            });

            if (names.length === 0) {
                resultsSection.innerHTML = '<div class="error">No names generated</div>';
            }
        } catch (error) {
            console.error('Parse Error:', error);
            console.error('Raw content:', content);
            resultsSection.innerHTML = `<div class="error">Failed to parse results: ${error.message}</div>`;
        }
    }

    // 转换拼音为 IPA
    function pinyinToIPAConversion(pinyin) {
        let normalized = pinyin.toLowerCase();
        Object.entries(BOYS_CONFIG.PINYIN_TO_IPA).forEach(([py, ipa]) => {
            normalized = normalized.replace(new RegExp(py, 'g'), ipa);
        });
        return normalized;
    }
}); 