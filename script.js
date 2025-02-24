// 当前选中的分类
let currentCategory = 'all';

// 添加编辑相关变量和函数
let currentEditIndex = -1;

// 分类配置
const categories = [
    { id: 'all', name: '全部' },
    { id: 'video', name: '影视' },
    { id: 'search', name: '搜索' },
    { id: 'news', name: '资讯' },
    { id: 'game', name: '游戏' },
    { id: 'ai', name: 'AI' },
    { id: 'other', name: '其它' }
];

// 添加默认收藏列表配置
const defaultBookmarks = [
    {
        title: '奈飞工厂',
        url: 'https://www.netflixgc.com',
        category: 'video',
        isDefault: true
    },
    {
        title: '奈菲影视',
        url: 'https://www.nfyingshi.com/',
        category: 'video',
        isDefault: true
    },
    {
        title: '统一影视TV',
        url: 'https://www.tyys1.com/',
        category: 'video',
        isDefault: true
    },
    {
        title: '腾讯视频',
        url: 'https://v.qq.com',
        category: 'video',
        isDefault: true
    },
    {
        title: '少数派',
        url: 'https://sspai.com/',
        category: 'news',
        isDefault: true
    },
    {
        title: '今日头条',
        url: 'https://www.toutiao.com/',
        category: 'news',
        isDefault: true
    },
    {
        title: 'IT之家',
        url: 'https://www.ithome.com',
        category: 'news',
        isDefault: true
    },
    {
        title: '异次元世界',
        url: 'https://www.iplaysoft.com',
        category: 'news',
        isDefault: true
    },
    {
        title: '百度',
        url: 'https://www.baidu.com',
        category: 'search',
        isDefault: true
    },
    {
        title: '必应',
        url: 'https://cn.bing.com',
        category: 'search',
        isDefault: true
    },
    {
        title: 'DeepSeek',
        url: 'https://chat.deepseek.com/',
        category: 'ai',
        isDefault: true
    },
    {
        title: 'Kimi',
        url: 'https://kimi.moonshot.cn/',
        category: 'ai',
        isDefault: true
    }
];

// 从 localStorage 加载书签
function loadBookmarks() {
    const userBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarksContainer = document.getElementById('bookmarks');
    bookmarksContainer.innerHTML = '';

    // 合并默认书签和用户书签
    const allBookmarks = [...defaultBookmarks, ...userBookmarks];
    
    // 根据当前分类过滤书签
    const filteredBookmarks = currentCategory === 'all' 
        ? allBookmarks 
        : allBookmarks.filter(bookmark => bookmark.category === currentCategory);

    // 添加书签卡片
    filteredBookmarks.forEach((bookmark, index) => {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        if (bookmark.isDefault) {
            card.classList.add('default-bookmark');
        }
        card.dataset.category = bookmark.category;
        
        // 修改点击事件
        card.addEventListener('click', (e) => {
            // 如果点击的是删除按钮或编辑按钮，不进行跳转
            if (!e.target.closest('.card-buttons')) {
                window.location.href = bookmark.url;  // 改为当前页面跳转
            }
        });
        
        // 修改内容容器的链接
        const content = document.createElement('div');
        content.className = 'bookmark-card-content';
        content.innerHTML = `
            <h3>${bookmark.title}</h3>
            <a href="${bookmark.url}"></a>
            <div class="card-buttons">
                ${!bookmark.isDefault ? `
                    <button class="edit-btn" onclick="showEditModal(${index - defaultBookmarks.length})" title="编辑">编辑</button>
                    <button class="delete-btn" onclick="deleteBookmark(${index - defaultBookmarks.length})" title="删除">删除</button>
                ` : ''}
            </div>
        `;
        
        // 修改背景图标元素创建
        const bgIcon = document.createElement('div');
        bgIcon.className = 'bookmark-card-bg';
        const faviconUrl = getFaviconUrl(bookmark.url);
        if (faviconUrl) {
            bgIcon.style.backgroundImage = `url('${faviconUrl}')`;
        } else {
            bgIcon.style.backgroundColor = getRandomColor();
        }
        
        card.appendChild(bgIcon);
        card.appendChild(content);
        bookmarksContainer.appendChild(card);
    });

    // 最后添加"添加卡片"
    const addCard = document.createElement('div');
    addCard.className = 'add-card';
    addCard.innerHTML = `
        <span class="plus-icon">+</span>
        <span class="add-text">添加收藏</span>
    `;
    addCard.addEventListener('click', showModal);
    bookmarksContainer.appendChild(addCard);
}

// 生成随机颜色
function getRandomColor() {
    const colors = [
        '#1a73e8', // 蓝色
        '#dc3545', // 红色
        '#28a745', // 绿色
        '#ffc107', // 黄色
        '#17a2b8', // 青色
        '#6610f2', // 紫色
        '#fd7e14', // 橙色
        '#20c997', // 青绿色
        '#e83e8c', // 粉色
        '#6f42c1'  // 深紫色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 获取网站图标URL
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        // 直接使用网站的 favicon.ico
        return domain ? `https://${domain}/favicon.ico` : '';
    } catch {
        return '';
    }
}

// 添加模态框相关函数
function showModal() {
    document.getElementById('addModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('linkTitle').value = '';
    document.getElementById('linkUrl').value = '';
}

// 添加新书签
function addBookmark() {
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkUrl');
    const categoryInput = document.getElementById('linkCategory');
    
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value;

    if (!title || !url || !category) {
        alert('请填写完整信息！');
        return;
    }

    try {
        new URL(url);
    } catch {
        alert('请输入有效的URL！');
        return;
    }

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push({ title, url, category });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    closeModal();
    loadBookmarks();
}

// 删除书签
function deleteBookmark(index) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks();
}

// 生成重定向URL
function generateRedirectUrl(originalUrl) {
    const timestamp = Date.now();
    const encodedUrl = encodeURIComponent(originalUrl);
    return `https://v.qq.com/search_redirect.html?url=https://www.baomihua.com/go.aspx?url=${encodedUrl}?baomihua.com=${timestamp}`;
}

// 添加分类切换功能
function switchCategory(category) {
    currentCategory = category;
    
    // 更新标签样式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    loadBookmarks();
}

// 添加编辑相关函数
function showEditModal(index) {
    currentEditIndex = index;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmark = bookmarks[index];
    
    // 填充表单
    document.getElementById('editLinkTitle').value = bookmark.title;
    document.getElementById('editLinkUrl').value = bookmark.url;
    document.getElementById('editLinkCategory').value = bookmark.category;
    
    // 显示模态框
    document.getElementById('editModal').style.display = 'block';
    
    // 阻止事件冒泡，防止触发卡片的点击事件
    event.stopPropagation();
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditIndex = -1;
}

function updateBookmark() {
    const titleInput = document.getElementById('editLinkTitle');
    const urlInput = document.getElementById('editLinkUrl');
    const categoryInput = document.getElementById('editLinkCategory');
    
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value;

    if (!title || !url || !category) {
        alert('请填写完整信息！');
        return;
    }

    try {
        new URL(url);
    } catch {
        alert('请输入有效的URL！');
        return;
    }

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks[currentEditIndex] = { title, url, category };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    closeEditModal();
    loadBookmarks();
}

// 初始化分类标签
function initCategories() {
    // 生成顶部分类标签
    const tabsContainer = document.querySelector('.category-tabs');
    tabsContainer.innerHTML = categories.map(category => `
        <button class="tab-btn ${category.id === currentCategory ? 'active' : ''}" 
                data-category="${category.id}">${category.name}</button>
    `).join('');

    // 为分类标签添加点击事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchCategory(btn.dataset.category));
    });

    // 初始化模态框中的分类选择
    const categoryOptions = categories
        .filter(category => category.id !== 'all') // 排除"全部"选项
        .map(category => `
            <option value="${category.id}">${category.name}</option>
        `).join('');

    // 添加到两个模态框的选择框中
    document.getElementById('linkCategory').innerHTML = 
        '<option value="">选择类别</option>' + categoryOptions;
    document.getElementById('editLinkCategory').innerHTML = 
        '<option value="">选择类别</option>' + categoryOptions;
}

// 修改初始化事件监听
window.onload = function() {
    initCategories();  // 初始化分类
    loadBookmarks();   // 加载书签

    document.getElementById('showAddForm').addEventListener('click', showModal);

    // 点击模态框外部关闭
    window.onclick = function(event) {
        const addModal = document.getElementById('addModal');
        const editModal = document.getElementById('editModal');
        if (event.target === addModal) {
            closeModal();
        } else if (event.target === editModal) {
            closeEditModal();
        }
    }
}; 