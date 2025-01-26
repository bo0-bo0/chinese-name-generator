document.addEventListener('DOMContentLoaded', async () => {
    const ITEMS_PER_PAGE = 30;
    let currentPage = 1;
    let surnames = [];

    // 加载姓氏数据
    async function loadSurnames() {
        try {
            const response = await fetch('../data/xingshi.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            surnames = data.surnames;
            renderPage(1);
        } catch (error) {
            console.error('Error loading surnames:', error);
            document.getElementById('surnamesGrid').innerHTML = 
                `<p class="error">Failed to load surnames data. Error: ${error.message}</p>`;
        }
    }

    // 渲染单个姓氏卡片
    function renderSurnameCard(surname) {
        return `
            <div class="surname-card">
                <div class="surname-info">
                    <div class="hanzi">${surname.hanzi}</div>
                    <div class="yingwen">${surname.yingwen}</div>
                    <div class="ipa">${surname.ipa}</div>
                    <div class="meaning">${surname.meaning}</div>
                    <div class="population">${surname.population}</div>
                </div>
                <div class="surname-facts">
                    <ul class="facts-list">
                        ${surname.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // 渲染分页按钮
    function renderPagination(totalPages, currentPage) {
        const pagination = document.getElementById('pagination');
        let buttons = '';

        // 上一页按钮
        buttons += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Previous</button>`;

        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // 第一页
                i === totalPages || // 最后一页
                (i >= currentPage - 2 && i <= currentPage + 2) // 当前页附近的页码
            ) {
                buttons += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (
                (i === currentPage - 3 && currentPage > 4) ||
                (i === currentPage + 3 && currentPage < totalPages - 3)
            ) {
                buttons += '<span>...</span>';
            }
        }

        // 下一页按钮
        buttons += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>`;

        pagination.innerHTML = buttons;

        // 添加点击事件监听器
        pagination.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (!isNaN(page)) {
                    renderPage(page);
                }
            });
        });
    }

    // 渲染指定页面
    function renderPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageItems = surnames.slice(startIndex, endIndex);
        const totalPages = Math.ceil(surnames.length / ITEMS_PER_PAGE);

        // 渲染姓氏卡片
        document.getElementById('surnamesGrid').innerHTML = pageItems.map(renderSurnameCard).join('');
        
        // 渲染分页控件
        renderPagination(totalPages, currentPage);

        // 滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 初始加载数据
    loadSurnames();
}); 