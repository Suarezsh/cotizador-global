const AdminPanel = {
  init() {
    this.bindEvents();
    AppState.subscribe(() => this.renderLists());
    this.render();
  },

  renderLists() {
    this.renderClients();
    this.renderCurrencies();
    this.renderTaxes();
  },

  bindEvents() {
    document.getElementById('tab-admin').addEventListener('click', () => App.setTab('admin'));
    document.getElementById('btn-tab-admin').addEventListener('click', () => App.setTab('admin'));

    const businessIds = {
      'admin-business-name': 'business.name',
      'admin-slogan': 'business.slogan',
      'admin-phone': 'business.phone',
      'admin-email': 'business.email',
      'admin-address': 'business.address',
      'admin-city': 'business.city',
      'admin-country': 'business.country',
      'admin-tax-id': 'business.taxId',
      'admin-website': 'business.website'
    };
    Object.entries(businessIds).forEach(([id, path]) => {
      document.getElementById(id).addEventListener('input', (e) => {
        AppState.updateSettings(path, e.target.value);
      });
    });

    document.getElementById('admin-logo-url').addEventListener('input', (e) => {
      AppState.updateSettings('business.logo', e.target.value);
    });

    document.getElementById('admin-logo-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => AppState.updateSettings('business.logo', ev.target.result);
        reader.readAsDataURL(file);
      }
    });

    ['admin-language', 'admin-date-format', 'admin-doc-prefix', 'admin-visual-style'].forEach(id => {
      document.getElementById(id).addEventListener('change', (e) => {
        const field = id.replace('admin-', '').replace(/-/g, '');
        const mapping = { language: 'language', dateformat: 'dateFormat', docprefix: 'docPrefix', visualstyle: 'visualStyle' };
        AppState.updateSettings(mapping[field], e.target.value);
      });
    });

    document.getElementById('admin-accent-color').addEventListener('input', (e) => {
      AppState.updateSettings('accentColor', e.target.value);
    });

    ['admin-terms', 'admin-thanks', 'admin-footer'].forEach(id => {
      document.getElementById(id).addEventListener('input', (e) => {
        const field = id.replace('admin-', '');
        AppState.updateSettings(field, e.target.value);
      });
    });

    document.getElementById('btn-add-client').addEventListener('click', () => this.addClient());
    document.getElementById('btn-add-currency').addEventListener('click', () => this.addCurrency());
    document.getElementById('btn-add-tax').addEventListener('click', () => this.addTax());

    document.getElementById('btn-backup').addEventListener('click', () => Storage.exportAll());
    document.getElementById('btn-restore').addEventListener('change', (e) => {
      if (e.target.files[0]) {
        Storage.importAll(e.target.files[0]).then(() => {
          AppState.init();
          this.render();
        });
      }
    });
  },

  render() {
    const s = AppState.settings;
    document.getElementById('admin-business-name').value = s.business.name || '';
    document.getElementById('admin-slogan').value = s.business.slogan || '';
    document.getElementById('admin-logo-url').value = s.business.logo || '';
    document.getElementById('admin-phone').value = s.business.phone || '';
    document.getElementById('admin-email').value = s.business.email || '';
    document.getElementById('admin-address').value = s.business.address || '';
    document.getElementById('admin-city').value = s.business.city || '';
    document.getElementById('admin-country').value = s.business.country || '';
    document.getElementById('admin-tax-id').value = s.business.taxId || '';
    document.getElementById('admin-website').value = s.business.website || '';
    document.getElementById('admin-language').value = s.language || 'es';
    document.getElementById('admin-date-format').value = s.dateFormat || 'DD/MM/YYYY';
    document.getElementById('admin-doc-prefix').value = s.docPrefix || 'COT-';
    document.getElementById('admin-accent-color').value = s.accentColor || '#2563eb';
    document.getElementById('admin-visual-style').value = s.visualStyle || 'modern';
    document.getElementById('admin-terms').value = s.terms || '';
    document.getElementById('admin-thanks').value = s.thanks || '';
    document.getElementById('admin-footer').value = s.footer || '';

    this.renderClients();
    this.renderCurrencies();
    this.renderTaxes();
  },

  addClient() {
    const name = document.getElementById('client-name').value.trim();
    if (!name) return;
    AppState.addClient({
      name,
      address: document.getElementById('client-address').value.trim(),
      contact: document.getElementById('client-contact').value.trim(),
      email: document.getElementById('client-email').value.trim(),
      phone: document.getElementById('client-phone').value.trim(),
      taxId: document.getElementById('client-tax-id').value.trim()
    });
    ['client-name', 'client-address', 'client-contact', 'client-email', 'client-phone', 'client-tax-id']
      .forEach(id => document.getElementById(id).value = '');
  },

  renderClients() {
    const list = document.getElementById('clients-list');
    list.innerHTML = AppState.clients.map(c => `
      <li class="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
        <span>${c.name}</span>
        <button data-id="${c.id}" class="text-red-500 hover:text-red-700 btn-remove-client">×</button>
      </li>
    `).join('');
    list.querySelectorAll('.btn-remove-client').forEach(btn => {
      btn.addEventListener('click', () => AppState.removeClient(btn.dataset.id));
    });
  },

  addCurrency() {
    const name = document.getElementById('currency-name').value.trim();
    const code = document.getElementById('currency-code').value.trim();
    if (!name || !code) return;
    AppState.addCurrency({
      name,
      code,
      symbol: document.getElementById('currency-symbol').value.trim() || code,
      position: document.getElementById('currency-position').value,
      thousand: document.getElementById('currency-thousand').value || ',',
      decimal: document.getElementById('currency-decimal').value || '.',
      default: true
    });
    ['currency-name', 'currency-code', 'currency-symbol'].forEach(id => document.getElementById(id).value = '');
  },

  renderCurrencies() {
    const list = document.getElementById('currencies-list');
    list.innerHTML = AppState.currencies.map(c => `
      <li class="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
        <span>${c.name} (${c.symbol}) ${c.default ? '✓' : ''}</span>
        <button data-id="${c.id}" class="text-red-500 hover:text-red-700 btn-remove-currency">×</button>
      </li>
    `).join('');
    list.querySelectorAll('.btn-remove-currency').forEach(btn => {
      btn.addEventListener('click', () => AppState.removeCurrency(btn.dataset.id));
    });
  },

  addTax() {
    const name = document.getElementById('tax-name').value.trim();
    if (!name) return;
    AppState.addTax({
      name,
      abbreviation: document.getElementById('tax-abbreviation').value.trim() || name,
      rate: Number(document.getElementById('tax-rate').value) || 0,
      taxId: document.getElementById('tax-id').value.trim(),
      mode: document.getElementById('tax-mode').value,
      default: true
    });
    ['tax-name', 'tax-abbreviation', 'tax-rate', 'tax-id'].forEach(id => document.getElementById(id).value = '');
  },

  renderTaxes() {
    const list = document.getElementById('taxes-list');
    list.innerHTML = AppState.taxes.map(t => `
      <li class="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
        <span>${t.name} ${t.rate}% ${t.default ? '✓' : ''}</span>
        <button data-id="${t.id}" class="text-red-500 hover:text-red-700 btn-remove-tax">×</button>
      </li>
    `).join('');
    list.querySelectorAll('.btn-remove-tax').forEach(btn => {
      btn.addEventListener('click', () => AppState.removeTax(btn.dataset.id));
    });
  }
};
