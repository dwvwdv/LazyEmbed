// LazyEmbed Widget Manager
class WidgetManager {
    constructor() {
        this.widgets = this.loadWidgets();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.renderWidgets();
        this.bindEvents();
    }

    // 綁定事件
    bindEvents() {
        // 新增按鈕
        document.getElementById('addWidgetBtn').addEventListener('click', () => {
            this.openModal();
        });

        // 關閉模態框
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // 表單提交
        document.getElementById('widgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWidget();
        });

        // 關閉嵌入代碼模態框
        document.getElementById('closeEmbedModal').addEventListener('click', () => {
            this.closeEmbedModal();
        });

        // 複製嵌入代碼
        document.getElementById('copyEmbedBtn').addEventListener('click', () => {
            this.copyEmbedCode();
        });

        // 點擊模態框外部關閉
        window.addEventListener('click', (e) => {
            const widgetModal = document.getElementById('widgetModal');
            const embedModal = document.getElementById('embedModal');
            if (e.target === widgetModal) {
                this.closeModal();
            }
            if (e.target === embedModal) {
                this.closeEmbedModal();
            }
        });
    }

    // 載入小工具
    loadWidgets() {
        const stored = localStorage.getItem('lazyEmbedWidgets');
        if (stored) {
            return JSON.parse(stored);
        } else {
            // 首次使用，添加預設的資金流可視化小工具
            const defaultWidgets = [
                {
                    id: 'widget_default_cashflow',
                    name: '資金流可視化',
                    type: 'custom',
                    description: '雙層圓餅圖顯示收支狀況，支援 URL 參數嵌入',
                    code: 'widgets/cashflow-visualizer.html',
                    width: '100%',
                    height: '800px',
                    createdAt: new Date().toISOString()
                }
            ];
            // 儲存預設小工具
            localStorage.setItem('lazyEmbedWidgets', JSON.stringify(defaultWidgets));
            return defaultWidgets;
        }
    }

    // 儲存小工具到 localStorage
    saveWidgetsToStorage() {
        localStorage.setItem('lazyEmbedWidgets', JSON.stringify(this.widgets));
    }

    // 渲染小工具列表
    renderWidgets() {
        const grid = document.getElementById('widgetGrid');
        const emptyState = document.getElementById('emptyState');

        if (this.widgets.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        grid.innerHTML = this.widgets.map(widget => `
            <div class="widget-card" data-id="${widget.id}">
                <div class="widget-card-header">
                    <div>
                        <h3>${this.escapeHtml(widget.name)}</h3>
                        <span class="widget-type-badge">${this.getTypeLabel(widget.type)}</span>
                    </div>
                </div>
                <p>${this.escapeHtml(widget.description || '無描述')}</p>
                <div class="widget-info">
                    <small style="color: var(--text-secondary);">
                        尺寸: ${widget.width || 'auto'} × ${widget.height || 'auto'}
                    </small>
                </div>
                <div class="widget-card-actions">
                    <button class="btn btn-embed" onclick="widgetManager.showEmbed('${widget.id}')">嵌入</button>
                    <button class="btn btn-edit" onclick="widgetManager.editWidget('${widget.id}')">編輯</button>
                    <button class="btn btn-delete" onclick="widgetManager.deleteWidget('${widget.id}')">刪除</button>
                </div>
            </div>
        `).join('');
    }

    // 取得類型標籤
    getTypeLabel(type) {
        const labels = {
            'iframe': 'iFrame',
            'script': 'Script',
            'html': 'HTML',
            'custom': 'Custom'
        };
        return labels[type] || type;
    }

    // 開啟模態框
    openModal(widget = null) {
        const modal = document.getElementById('widgetModal');
        const form = document.getElementById('widgetForm');
        const title = document.getElementById('modalTitle');

        if (widget) {
            // 編輯模式
            title.textContent = '編輯小工具';
            this.currentEditId = widget.id;
            document.getElementById('widgetName').value = widget.name;
            document.getElementById('widgetType').value = widget.type;
            document.getElementById('widgetDescription').value = widget.description || '';
            document.getElementById('widgetCode').value = widget.code;
            document.getElementById('widgetWidth').value = widget.width || '';
            document.getElementById('widgetHeight').value = widget.height || '';
        } else {
            // 新增模式
            title.textContent = '新增小工具';
            this.currentEditId = null;
            form.reset();
        }

        modal.classList.add('active');
    }

    // 關閉模態框
    closeModal() {
        const modal = document.getElementById('widgetModal');
        modal.classList.remove('active');
        this.currentEditId = null;
    }

    // 儲存小工具
    saveWidget() {
        const name = document.getElementById('widgetName').value.trim();
        const type = document.getElementById('widgetType').value;
        const description = document.getElementById('widgetDescription').value.trim();
        const code = document.getElementById('widgetCode').value.trim();
        const width = document.getElementById('widgetWidth').value.trim();
        const height = document.getElementById('widgetHeight').value.trim();

        if (!name || !type || !code) {
            alert('請填寫必填欄位');
            return;
        }

        const widget = {
            id: this.currentEditId || this.generateId(),
            name,
            type,
            description,
            code,
            width,
            height,
            createdAt: this.currentEditId ?
                this.widgets.find(w => w.id === this.currentEditId).createdAt :
                new Date().toISOString()
        };

        if (this.currentEditId) {
            // 更新現有小工具
            const index = this.widgets.findIndex(w => w.id === this.currentEditId);
            this.widgets[index] = widget;
        } else {
            // 新增小工具
            this.widgets.push(widget);
        }

        this.saveWidgetsToStorage();
        this.renderWidgets();
        this.closeModal();
    }

    // 編輯小工具
    editWidget(id) {
        const widget = this.widgets.find(w => w.id === id);
        if (widget) {
            this.openModal(widget);
        }
    }

    // 刪除小工具
    deleteWidget(id) {
        if (confirm('確定要刪除這個小工具嗎？')) {
            this.widgets = this.widgets.filter(w => w.id !== id);
            this.saveWidgetsToStorage();
            this.renderWidgets();
        }
    }

    // 顯示嵌入代碼
    showEmbed(id) {
        const widget = this.widgets.find(w => w.id === id);
        if (!widget) return;

        const embedCode = this.generateEmbedCode(widget);
        document.getElementById('embedCode').textContent = embedCode;
        document.getElementById('embedModal').classList.add('active');
    }

    // 生成嵌入代碼
    generateEmbedCode(widget) {
        const width = widget.width || '100%';
        const height = widget.height || '400px';

        switch (widget.type) {
            case 'iframe':
                return `<!-- ${widget.name} -->
<iframe
    src="${widget.code}"
    width="${width}"
    height="${height}"
    frameborder="0"
    allowfullscreen>
</iframe>`;

            case 'script':
                return `<!-- ${widget.name} -->
<script src="${widget.code}"></script>`;

            case 'html':
                return `<!-- ${widget.name} -->
<div class="lazyembed-widget" style="width: ${width}; height: ${height};">
    ${widget.code}
</div>`;

            case 'custom':
                // 如果是 .html 文件路徑，使用 iframe
                if (widget.code.endsWith('.html')) {
                    return `<!-- ${widget.name} -->
<iframe
    src="${widget.code}"
    width="${width}"
    height="${height}"
    frameborder="0"
    allowfullscreen>
</iframe>`;
                }
                // 否則作為內嵌代碼
                return `<!-- ${widget.name} -->
<div id="widget-${widget.id}" style="width: ${width}; height: ${height};">
    ${widget.code}
</div>`;

            default:
                return widget.code;
        }
    }

    // 關閉嵌入代碼模態框
    closeEmbedModal() {
        document.getElementById('embedModal').classList.remove('active');
    }

    // 複製嵌入代碼
    async copyEmbedCode() {
        const code = document.getElementById('embedCode').textContent;
        try {
            await navigator.clipboard.writeText(code);
            const btn = document.getElementById('copyEmbedBtn');
            const originalText = btn.textContent;
            btn.textContent = '已複製！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        } catch (err) {
            alert('複製失敗，請手動複製');
        }
    }

    // 生成唯一 ID
    generateId() {
        return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // HTML 轉義
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化應用
const widgetManager = new WidgetManager();
