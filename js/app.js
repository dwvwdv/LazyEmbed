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

        // Account 按鈕
        document.getElementById('accountBtn').addEventListener('click', () => {
            this.openTransactionModal();
        });

        // 關閉 Transaction 模態框
        document.getElementById('closeTransactionModal').addEventListener('click', () => {
            this.closeTransactionModal();
        });

        document.getElementById('cancelTransactionBtn').addEventListener('click', () => {
            this.closeTransactionModal();
        });

        // More 按鈕切換
        document.getElementById('showMoreBtn').addEventListener('click', () => {
            this.toggleMoreOptions();
        });

        // Transaction 表單提交
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTransaction();
        });

        // 點擊模態框外部關閉
        window.addEventListener('click', (e) => {
            const widgetModal = document.getElementById('widgetModal');
            const embedModal = document.getElementById('embedModal');
            const transactionModal = document.getElementById('transactionModal');
            if (e.target === widgetModal) {
                this.closeModal();
            }
            if (e.target === embedModal) {
                this.closeEmbedModal();
            }
            if (e.target === transactionModal) {
                this.closeTransactionModal();
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

        grid.innerHTML = this.widgets.map(widget => {
            // 如果 code 是 .html 文件，標題加上超連結
            const titleHtml = widget.code.endsWith('.html')
                ? `<h3><a href="${widget.code}" target="_blank" style="color: inherit; text-decoration: none;">${this.escapeHtml(widget.name)}</a></h3>`
                : `<h3>${this.escapeHtml(widget.name)}</h3>`;

            return `
            <div class="widget-card" data-id="${widget.id}">
                <div class="widget-card-header">
                    <div>
                        ${titleHtml}
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
        `;
        }).join('');
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

    // 開啟 Transaction 模態框
    openTransactionModal() {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');

        // 重置表單
        form.reset();

        // 設置預設值
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
        document.getElementById('transactionName').placeholder = '預設: SureApp';
        document.getElementById('transactionNature').value = 'expense';
        document.getElementById('transactionCurrency').value = 'TWD';

        // 隱藏 More 選項
        document.getElementById('moreOptions').style.display = 'none';
        document.getElementById('showMoreBtn').textContent = 'More';

        // 隱藏結果訊息
        document.getElementById('transactionResult').style.display = 'none';

        // 從 localStorage 讀取 Account ID (如果有的話)
        const savedAccountId = localStorage.getItem('lastAccountId');
        if (savedAccountId) {
            document.getElementById('transactionAccountId').value = savedAccountId;
        }

        modal.classList.add('active');
    }

    // 關閉 Transaction 模態框
    closeTransactionModal() {
        const modal = document.getElementById('transactionModal');
        modal.classList.remove('active');
    }

    // 切換 More 選項
    toggleMoreOptions() {
        const moreOptions = document.getElementById('moreOptions');
        const showMoreBtn = document.getElementById('showMoreBtn');

        if (moreOptions.style.display === 'none') {
            moreOptions.style.display = 'block';
            showMoreBtn.textContent = 'Less';
        } else {
            moreOptions.style.display = 'none';
            showMoreBtn.textContent = 'More';
        }
    }

    // 提交 Transaction
    async submitTransaction() {
        const accountId = document.getElementById('transactionAccountId').value.trim();
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const nature = document.getElementById('transactionNature').value;
        const currency = document.getElementById('transactionCurrency').value;

        // More 選項
        let date = document.getElementById('transactionDate').value;
        let name = document.getElementById('transactionName').value.trim();
        const notes = document.getElementById('transactionNotes').value.trim();

        // 設置預設值
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        }
        if (!name) {
            name = 'SureApp';
        }

        // 驗證必填欄位
        if (!accountId || !amount || amount <= 0) {
            alert('請填寫所有必填欄位');
            return;
        }

        // 保存 Account ID 到 localStorage
        localStorage.setItem('lastAccountId', accountId);

        // 構建 API 請求
        const requestBody = {
            transaction: {
                account_id: accountId,
                name: name,
                date: date,
                amount: amount,
                currency: currency,
                nature: nature,
                notes: notes || 'This transaction via mobile app.'
            }
        };

        // 顯示載入狀態
        const submitBtn = document.querySelector('#transactionForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '送出中...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://sure.lazyrhythm.com/api/v1/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const resultDiv = document.getElementById('transactionResult');
            const messageDiv = document.getElementById('transactionResultMessage');

            if (response.ok) {
                const data = await response.json();
                messageDiv.innerHTML = `<div style="color: green; padding: 10px; background: #d4edda; border-radius: 5px;">✓ 交易新增成功！</div>`;
                resultDiv.style.display = 'block';

                // 3秒後關閉模態框
                setTimeout(() => {
                    this.closeTransactionModal();
                }, 2000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                messageDiv.innerHTML = `<div style="color: red; padding: 10px; background: #f8d7da; border-radius: 5px;">✗ 提交失敗: ${errorData.message || response.statusText}</div>`;
                resultDiv.style.display = 'block';
            }
        } catch (error) {
            const resultDiv = document.getElementById('transactionResult');
            const messageDiv = document.getElementById('transactionResultMessage');
            messageDiv.innerHTML = `<div style="color: red; padding: 10px; background: #f8d7da; border-radius: 5px;">✗ 網路錯誤: ${error.message}</div>`;
            resultDiv.style.display = 'block';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// 初始化應用
const widgetManager = new WidgetManager();
