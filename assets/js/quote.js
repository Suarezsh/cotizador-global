const QuotePanel = {
  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('tab-quote').addEventListener('click', () => App.setTab('quote'));
    document.getElementById('btn-tab-quote').addEventListener('click', () => App.setTab('quote'));

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

    document.getElementById('btn-add-item').addEventListener('click', () => {
      AppState.addItem({ description: '', type: 'service', unit: 'unidad', quantity: 1, price: 0, discount: 0 });
    });

    document.getElementById('btn-save-quote').addEventListener('click', () => {
      AppState.saveCurrentQuote();
      alert('Cotización guardada');
    });

    document.getElementById('btn-duplicate-quote').addEventListener('click', () => {
      AppState.duplicateCurrentQuote();
    });

    document.getElementById('btn-export-pdf').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-share-whatsapp').addEventListener('click', () => this.shareWhatsApp());
    document.getElementById('btn-share-email').addEventListener('click', () => this.shareEmail());

    document.getElementById('btn-load-quote').addEventListener('click', () => this.showSavedQuotes());

    document.getElementById('quote-items').addEventListener('input', (e) => {
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
      if (e.target.classList.contains('btn-remove-item')) {
        AppState.removeItem(e.target.dataset.id);
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
    container.innerHTML = AppState.currentQuote.items.map((item, index) => `
      <div data-item-id="${item.id}" class="bg-gray-50 p-3 rounded space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-xs font-semibold text-gray-500">#${index + 1}</span>
          <button data-id="${item.id}" class="btn-remove-item text-red-500 hover:text-red-700 text-sm">Eliminar</button>
        </div>
        <input type="text" class="item-description input w-full text-sm" placeholder="Descripción" value="${item.description || ''}">
        <div class="grid grid-cols-5 gap-2">
          <select class="item-type input text-sm">
            <option value="product" ${item.type === 'product' ? 'selected' : ''}>Producto</option>
            <option value="service" ${item.type === 'service' ? 'selected' : ''}>Servicio</option>
          </select>
          <input type="text" class="item-unit input text-sm" placeholder="Unidad" value="${item.unit || ''}">
          <input type="number" class="item-quantity input text-sm" placeholder="Cant." value="${item.quantity || ''}" step="0.01">
          <input type="number" class="item-price input text-sm" placeholder="Precio" value="${item.price || ''}" step="0.01">
          <input type="number" class="item-discount input text-sm" placeholder="Desc.%" value="${item.discount || ''}" step="0.01">
        </div>
      </div>
    `).join('');
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
    window.location.href = `mailto:${client ? client.email : ''}?subject=${subject}&body=${body}`;
  },

  showSavedQuotes() {
    if (!AppState.savedQuotes.length) {
      alert('No hay cotizaciones guardadas');
      return;
    }
    const list = AppState.savedQuotes.map((q, i) => `${i + 1}. ${q.number} - ${q.savedAt ? new Date(q.savedAt).toLocaleString() : ''}`).join('\n');
    const idx = prompt(`Elige una cotización:\n${list}`);
    if (idx && AppState.savedQuotes[Number(idx) - 1]) {
      AppState.loadSavedQuote(AppState.savedQuotes[Number(idx) - 1].savedId);
    }
  }
};
