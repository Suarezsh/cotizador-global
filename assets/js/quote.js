const QuotePanel = {
  init() {
    this.bindEvents();
    this.lastItemsSnapshot = '';
    AppState.subscribe(() => {
      const currentSnapshot = AppState.currentQuote.items.map(i => `${i.id}:${i.taxable !== false ? '1' : '0'}`).join(',');
      if (currentSnapshot !== this.lastItemsSnapshot) {
        this.lastItemsSnapshot = currentSnapshot;
        this.renderItems();
      }
      this.renderTotals();
    });
  },

  bindEvents() {
    document.getElementById('quote-number').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ number: e.target.value });
    });
    document.getElementById('quote-date').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ date: e.target.value });
    });
    document.getElementById('quote-due-date').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ dueDate: e.target.value });
    });
    document.getElementById('quote-client').addEventListener('change', (e) => {
      AppState.updateCurrentQuote({ clientId: e.target.value });
    });
    document.getElementById('quote-global-discount').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ globalDiscount: e.target.value });
    });
    document.getElementById('quote-advance').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ advance: e.target.value });
    });
    document.getElementById('quote-notes').addEventListener('input', (e) => {
      AppState.updateCurrentQuote({ notes: e.target.value });
    });

    document.getElementById('quote-apply-tax-all').addEventListener('change', (e) => {
      const apply = e.target.checked;
      AppState.currentQuote.items.forEach(item => {
        AppState.updateItem(item.id, { taxable: apply });
      });
    });

    document.getElementById('btn-add-item').addEventListener('click', () => {
      AppState.addItem({ description: '', type: 'service', unit: 'unidad', quantity: 1, price: 0, discount: 0, taxable: true });
    });

    document.getElementById('btn-save-quote').addEventListener('click', () => {
      AppState.saveCurrentQuote();
      App.showAlert('Cotización guardada correctamente', { title: 'Guardado', icon: 'fa-check', color: 'green' });
    });

    document.getElementById('btn-duplicate-quote').addEventListener('click', () => {
      AppState.duplicateCurrentQuote();
    });

    document.getElementById('btn-export-pdf').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-share-whatsapp').addEventListener('click', () => this.shareWhatsApp());
    document.getElementById('btn-share-email').addEventListener('click', () => this.shareEmail());
    document.getElementById('btn-share-link').addEventListener('click', () => this.shareLink());

    document.getElementById('btn-load-quote').addEventListener('click', () => this.showSavedQuotes());

    document.getElementById('quote-items').addEventListener('change', (e) => {
      const row = e.target.closest('[data-item-id]');
      if (!row) return;
      const id = row.dataset.itemId;
      const fieldMap = {
        'item-description': 'description',
        'item-type': 'type',
        'item-unit': 'unit',
        'item-quantity': 'quantity',
        'item-price': 'price',
        'item-discount': 'discount'
      };
      const field = fieldMap[e.target.className.split(' ').find(c => fieldMap[c])];
      if (field) {
        AppState.updateItem(id, { [field]: e.target.value });
      }
    });

    document.getElementById('quote-items').addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.btn-remove-item');
      const upBtn = e.target.closest('.btn-move-up');
      const downBtn = e.target.closest('.btn-move-down');
      const taxBtn = e.target.closest('.btn-toggle-tax');

      if (removeBtn) {
        App.showConfirm('¿Eliminar este ítem?', () => AppState.removeItem(removeBtn.dataset.id));
      }
      if (upBtn) {
        AppState.moveItem(upBtn.dataset.id, 'up');
      }
      if (downBtn) {
        AppState.moveItem(downBtn.dataset.id, 'down');
      }
      if (taxBtn) {
        const row = taxBtn.closest('[data-item-id]');
        if (row) {
          const item = AppState.currentQuote.items.find(i => i.id === row.dataset.itemId);
          if (item) {
            AppState.updateItem(row.dataset.itemId, { taxable: item.taxable === false ? true : false });
          }
        }
      }
    });
  },

  render() {
    const q = AppState.currentQuote;
    document.getElementById('quote-number').value = q.number || '';
    document.getElementById('quote-date').value = q.date || '';
    document.getElementById('quote-due-date').value = q.dueDate || '';
    document.getElementById('quote-client').value = q.clientId || '';
    document.getElementById('quote-global-discount').value = q.globalDiscount || '';
    document.getElementById('quote-advance').value = q.advance || '';
    document.getElementById('quote-notes').value = q.notes || '';

    const taxAllCheckbox = document.getElementById('quote-apply-tax-all');
    if (taxAllCheckbox) {
      const allTaxable = q.items.length > 0 && q.items.every(item => item.taxable !== false);
      taxAllCheckbox.checked = allTaxable;
    }

    this.renderClientOptions();
    this.renderItems();
    this.renderTotals();
  },

  renderClientOptions() {
    const select = document.getElementById('quote-client');
    const current = select.value;
    select.innerHTML = '<option value="">Seleccionar cliente</option>' +
      AppState.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    select.value = current || AppState.currentQuote.clientId || '';
  },

  renderItems() {
    const container = document.getElementById('quote-items');

    // Guardar foco activo para restaurarlo tras renderizar
    const active = document.activeElement;
    const activeRow = active ? active.closest('[data-item-id]') : null;
    const activeItemId = activeRow ? activeRow.dataset.itemId : null;
    const activeField = active ? Array.from(active.classList).find(c => c.startsWith('item-')) : null;
    const activeSelectionStart = active ? active.selectionStart : null;
    const activeSelectionEnd = active ? active.selectionEnd : null;

    container.innerHTML = AppState.currentQuote.items.map((item, index) => `
      <div data-item-id="${item.id}" class="bg-gray-50 p-2 rounded-lg border border-gray-100 space-y-1.5">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">#${index + 1}</span>
          <div class="flex items-center gap-0.5">
            <button data-id="${item.id}" class="btn-toggle-tax ${item.taxable === false ? 'text-amber-500 bg-amber-50' : 'text-green-600 bg-green-50'} p-1 rounded transition text-xs" title="${item.taxable === false ? 'Exento de impuesto' : 'Aplica impuesto'}">
              <i class="fa-solid ${item.taxable === false ? 'fa-ban' : 'fa-receipt'}"></i>
            </button>
            <button data-id="${item.id}" class="btn-move-up text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition text-xs" title="Mover arriba">
              <i class="fa-solid fa-chevron-up"></i>
            </button>
            <button data-id="${item.id}" class="btn-move-down text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition text-xs" title="Mover abajo">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <button data-id="${item.id}" class="btn-remove-item text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition text-xs" title="Eliminar">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <input type="text" class="item-description input input-compact w-full" placeholder="Descripción" value="${item.description || ''}">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          <select class="item-type input input-compact">
            <option value="product" ${item.type === 'product' ? 'selected' : ''}>Producto</option>
            <option value="service" ${item.type === 'service' ? 'selected' : ''}>Servicio</option>
          </select>
          <input type="text" class="item-unit input input-compact" placeholder="Unidad" value="${item.unit || ''}">
          <input type="number" class="item-quantity input input-compact" placeholder="Cant." value="${item.quantity || ''}" step="0.01">
          <input type="number" class="item-price input input-compact" placeholder="Precio" value="${item.price || ''}" step="0.01">
          <input type="number" class="item-discount input input-compact" placeholder="Desc.%" value="${item.discount || ''}" step="0.01">
        </div>
      </div>
    `).join('');

    // Restaurar foco si el ítem aún existe
    if (activeItemId && activeField) {
      const newRow = container.querySelector(`[data-item-id="${activeItemId}"]`);
      const newInput = newRow ? newRow.querySelector(`.${activeField}`) : null;
      if (newInput) {
        newInput.focus();
        if (typeof activeSelectionStart === 'number' && typeof activeSelectionEnd === 'number') {
          try {
            newInput.setSelectionRange(activeSelectionStart, activeSelectionEnd);
          } catch (e) {}
        }
      }
    }
  },

  renderTotals() {
    const currency = AppState.getDefaultCurrency();
    const taxes = AppState.getDefaultTaxes();
    const calc = Calculations.calculateQuote(AppState.currentQuote, taxes);
    const labels = Formatters.labels[AppState.settings.language] || Formatters.labels.es;

    document.getElementById('quote-totals').innerHTML = `
      <div class="flex justify-between"><span>${labels.subtotal}</span><span>${Formatters.formatMoney(calc.subtotal, currency)}</span></div>
      ${calc.globalDiscount > 0 ? `<div class="flex justify-between text-red-600"><span>${labels.globalDiscount}</span><span>-${Formatters.formatMoney(calc.globalDiscount, currency)}</span></div>` : ''}
      ${calc.taxDetails.map(t => `<div class="flex justify-between"><span>${t.name} (${t.rate}%)</span><span>${Formatters.formatMoney(t.amount, currency)}</span></div>`).join('')}
      <div class="flex justify-between font-bold text-lg border-t pt-2"><span>${labels.finalTotal}</span><span>${Formatters.formatMoney(calc.total, currency)}</span></div>
      ${calc.advance > 0 ? `<div class="flex justify-between"><span>${labels.advance}</span><span>${Formatters.formatMoney(calc.advance, currency)}</span></div><div class="flex justify-between font-semibold"><span>${labels.balance}</span><span>${Formatters.formatMoney(calc.balance, currency)}</span></div>` : ''}
    `;
  },

  shareWhatsApp() {
    const client = AppState.clients.find(c => c.id === AppState.currentQuote.clientId);
    const currency = AppState.getDefaultCurrency();
    const taxes = AppState.getDefaultTaxes();
    const calc = Calculations.calculateQuote(AppState.currentQuote, taxes);
    const text = encodeURIComponent(
      `Hola ${client ? client.name : ''}, te envío tu cotización ${AppState.currentQuote.number} por un total de ${Formatters.formatMoney(calc.total, currency)}.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  },

  shareEmail() {
    const client = AppState.clients.find(c => c.id === AppState.currentQuote.clientId);
    const currency = AppState.getDefaultCurrency();
    const taxes = AppState.getDefaultTaxes();
    const calc = Calculations.calculateQuote(AppState.currentQuote, taxes);
    const subject = encodeURIComponent(`Cotización ${AppState.currentQuote.number}`);
    const body = encodeURIComponent(
      `Estimado ${client ? client.name : 'cliente'},\n\nAdjunto cotización ${AppState.currentQuote.number} por un total de ${Formatters.formatMoney(calc.total, currency)}.\n\nSaludos.`
    );
    window.open(`mailto:${client ? client.email : ''}?subject=${subject}&body=${body}`, '_blank');
  },

  shareLink() {
    const link = App.generateShareLink();
    navigator.clipboard.writeText(link).then(() => {
      App.showAlert('Enlace copiado al portapapeles', { title: 'Copiado', icon: 'fa-link', color: 'blue' });
    });
  },

  showSavedQuotes() {
    App.showSavedQuotes();
  }
};
