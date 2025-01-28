// 菜单控制
document.addEventListener('DOMContentLoaded', () => {
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
}); 