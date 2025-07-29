// 网址导航页面功能
class NavigationManager {
  constructor() {
    this.config = null;
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.init();
  }

  async init() {
    try {
      await this.loadConfig();
      this.renderCategories();
      this.renderWebsites();
      this.bindEvents();
    } catch (error) {
      console.error('初始化导航页面失败:', error);
      this.showError('加载配置失败，请刷新页面重试');
    }
  }

  async loadConfig() {
    try {
      const response = await fetch('/js/navigation-config.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.config = await response.json();
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw error;
    }
  }

  renderCategories() {
    const categoryList = document.getElementById('nav-category-list');
    if (!categoryList || !this.config) return;

    categoryList.innerHTML = '';

    this.config.categories.forEach(category => {
      const count = category.id === 'all' 
        ? this.config.websites.length 
        : this.config.websites.filter(site => site.category === category.id).length;

      const button = document.createElement('button');
      button.className = `nav-category-btn ${category.id === this.currentCategory ? 'active' : ''}`;
      button.setAttribute('data-category', category.id);
      button.innerHTML = `
        ${category.icon} ${category.name}
        <span class="nav-category-count">${count}</span>
      `;

      categoryList.appendChild(button);
    });
  }

  renderWebsites() {
    const content = document.getElementById('nav-content');
    if (!content || !this.config) return;

    // 显示加载状态
    content.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

    // 模拟加载延迟，提供更好的用户体验
    setTimeout(() => {
      const filteredWebsites = this.getFilteredWebsites();
      
      if (filteredWebsites.length === 0) {
        this.showEmptyState();
        return;
      }

      // 按分类分组网站
      const groupedWebsites = this.groupWebsitesByCategory(filteredWebsites);
      
      let html = '';
      
      if (this.currentCategory === 'all' && !this.searchTerm) {
        // 显示所有分类
        Object.entries(groupedWebsites).forEach(([categoryId, websites]) => {
          const category = this.config.categories.find(cat => cat.id === categoryId);
          if (category && websites.length > 0) {
            html += `
              <div class="category-section">
                <h2 class="category-title">${category.icon} ${category.name}</h2>
              </div>
            `;
            websites.forEach(website => {
              html += this.createWebsiteCard(website);
            });
          }
        });
      } else {
        // 显示特定分类或搜索结果
        filteredWebsites.forEach(website => {
          html += this.createWebsiteCard(website);
        });
      }

      content.innerHTML = html;
    }, 300);
  }

  getFilteredWebsites() {
    let websites = this.config.websites;

    // 按分类筛选
    if (this.currentCategory !== 'all') {
      websites = websites.filter(site => site.category === this.currentCategory);
    }

    // 按搜索词筛选
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      websites = websites.filter(site => 
        site.name.toLowerCase().includes(term) ||
        site.description.toLowerCase().includes(term) ||
        site.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return websites;
  }

  groupWebsitesByCategory(websites) {
    const grouped = {};
    
    // 按照配置中的分类顺序分组
    this.config.categories.forEach(category => {
      if (category.id !== 'all') {
        grouped[category.id] = websites.filter(site => site.category === category.id);
      }
    });

    return grouped;
  }

  createWebsiteCard(website) {
    const tagsHtml = website.tags.map(tag => 
      `<span class="website-tag">${tag}</span>`
    ).join('');

    return `
      <a href="${website.url}" target="_blank" rel="noopener noreferrer" class="website-card">
        <div class="website-header">
          <div class="website-icon">${website.icon}</div>
          <div class="website-info">
            <h3>${website.name}</h3>
            <div class="website-url">${this.getDomainFromUrl(website.url)}</div>
          </div>
        </div>
        <div class="website-description">${website.description}</div>
        <div class="website-tags">${tagsHtml}</div>
      </a>
    `;
  }

  getDomainFromUrl(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  showEmptyState() {
    const content = document.getElementById('nav-content');
    content.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3>没有找到相关网站</h3>
        <p>尝试调整搜索关键词或选择其他分类</p>
      </div>
    `;
  }

  showError(message) {
    const content = document.getElementById('nav-content');
    content.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>加载失败</h3>
        <p>${message}</p>
      </div>
    `;
  }

  bindEvents() {
    // 分类切换
    const categoryList = document.getElementById('nav-category-list');
    if (categoryList) {
      categoryList.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-category-btn') || e.target.closest('.nav-category-btn')) {
          const button = e.target.classList.contains('nav-category-btn') 
            ? e.target 
            : e.target.closest('.nav-category-btn');
          
          const category = button.getAttribute('data-category');
          this.switchCategory(category);
        }
      });
    }

    // 搜索功能
    const searchInput = document.getElementById('nav-search-input');
    const searchButton = document.getElementById('nav-search-button');

    if (searchInput) {
      // 实时搜索
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim();
        this.debounce(() => this.renderWebsites(), 300)();
      });

      // 回车搜索
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.performSearch();
      });
    }
  }

  switchCategory(categoryId) {
    this.currentCategory = categoryId;
    
    // 更新分类按钮状态
    document.querySelectorAll('.nav-category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-category="${categoryId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // 重新渲染网站列表
    this.renderWebsites();
  }

  performSearch() {
    const searchInput = document.getElementById('nav-search-input');
    if (searchInput) {
      this.searchTerm = searchInput.value.trim();
      this.renderWebsites();
    }
  }

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 只在导航页面初始化
  if (document.body.classList.contains('navigation-page')) {
    new NavigationManager();
  }
});

// 导出供其他脚本使用
window.NavigationManager = NavigationManager;