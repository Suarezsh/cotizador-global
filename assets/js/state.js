const AppState = {
  settings: null,
  clients: [],
  currencies: [],
  taxes: [],
  savedQuotes: [],
  currentQuote: null,

  listeners: [],

  init() {
    if (Storage.isFirstVisit()) {
      this.settings = JSON.parse(JSON.stringify(DEFAULTS.settings));
      this.clients = JSON.parse(JSON.stringify(DEFAULTS.clients));
      this.currencies = JSON.parse(JSON.stringify(DEFAULTS.currencies));
      this.taxes = JSON.parse(JSON.stringify(DEFAULTS.taxes));
      this.savedQuotes = [];
      this.currentQuote = getDefaultQuote();
      this.persist();
    } else {
      this.settings = Storage.load(STORAGE_KEYS.settings, DEFAULTS.settings);
      this.clients = Storage.load(STORAGE_KEYS.clients, DEFAULTS.clients);
      this.currencies = Storage.load(STORAGE_KEYS.currencies, DEFAULTS.currencies);
      this.taxes = Storage.load(STORAGE_KEYS.taxes, DEFAULTS.taxes);
      this.savedQuotes = Storage.load(STORAGE_KEYS.savedQuotes, []);
      this.currentQuote = Storage.load(STORAGE_KEYS.currentQuote, getDefaultQuote());
    }
    this.notify();
  },

  persist() {
    Storage.save(STORAGE_KEYS.settings, this.settings);
    Storage.save(STORAGE_KEYS.clients, this.clients);
    Storage.save(STORAGE_KEYS.currencies, this.currencies);
    Storage.save(STORAGE_KEYS.taxes, this.taxes);
    Storage.save(STORAGE_KEYS.savedQuotes, this.savedQuotes);
    Storage.save(STORAGE_KEYS.currentQuote, this.currentQuote);
  },

  subscribe(listener) {
    this.listeners.push(listener);
  },

  notify() {
    this.listeners.forEach(listener => listener(this));
  },

  updateSettings(path, value) {
    const keys = path.split('.');
    let target = this.settings;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    this.persist();
    this.notify();
  },

  getDefaultCurrency() {
    return this.currencies.find(c => c.default) || this.currencies[0] || DEFAULTS.currencies[0];
  },

  getDefaultTaxes() {
    return this.taxes.filter(t => t.default);
  },

  addClient(client) {
    this.clients.push({ ...client, id: 'c' + Date.now() });
    this.persist();
    this.notify();
  },

  removeClient(id) {
    this.clients = this.clients.filter(c => c.id !== id);
    this.persist();
    this.notify();
  },

  addCurrency(currency) {
    if (currency.default) {
      this.currencies.forEach(c => c.default = false);
    }
    this.currencies.push({ ...currency, id: 'cur' + Date.now() });
    this.persist();
    this.notify();
  },

  removeCurrency(id) {
    this.currencies = this.currencies.filter(c => c.id !== id);
    this.persist();
    this.notify();
  },

  addTax(tax) {
    this.taxes.push({ ...tax, id: 't' + Date.now() });
    this.persist();
    this.notify();
  },

  removeTax(id) {
    this.taxes = this.taxes.filter(t => t.id !== id);
    this.persist();
    this.notify();
  },

  updateCurrentQuote(quote) {
    this.currentQuote = { ...this.currentQuote, ...quote };
    this.persist();
    this.notify();
  },

  addItem(item) {
    this.currentQuote.items.push({ ...item, id: 'i' + Date.now() });
    this.persist();
    this.notify();
  },

  updateItem(id, updates) {
    const item = this.currentQuote.items.find(i => i.id === id);
    if (item) {
      Object.assign(item, updates);
      this.persist();
      this.notify();
    }
  },

  removeItem(id) {
    this.currentQuote.items = this.currentQuote.items.filter(i => i.id !== id);
    this.persist();
    this.notify();
  },

  moveItem(id, direction) {
    const items = this.currentQuote.items;
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= items.length) return;
    [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
    this.persist();
    this.notify();
  },

  saveCurrentQuote() {
    const quote = JSON.parse(JSON.stringify(this.currentQuote));
    quote.savedAt = new Date().toISOString();
    quote.savedId = 'q' + Date.now();
    this.savedQuotes.push(quote);
    this.persist();
    this.notify();
  },

  loadSavedQuote(savedId) {
    const quote = this.savedQuotes.find(q => q.savedId === savedId);
    if (quote) {
      this.currentQuote = JSON.parse(JSON.stringify(quote));
      delete this.currentQuote.savedAt;
      delete this.currentQuote.savedId;
      this.persist();
      this.notify();
    }
  },

  removeSavedQuote(savedId) {
    this.savedQuotes = this.savedQuotes.filter(q => q.savedId !== savedId);
    this.persist();
    this.notify();
  },

  duplicateCurrentQuote() {
    const copy = JSON.parse(JSON.stringify(this.currentQuote));
    copy.number = this.settings.docPrefix + (this.savedQuotes.length + 2).toString().padStart(3, '0');
    copy.date = new Date().toISOString().split('T')[0];
    this.currentQuote = copy;
    this.persist();
    this.notify();
  },

  resetToDefaults() {
    this.settings = JSON.parse(JSON.stringify(DEFAULTS.settings));
    this.clients = JSON.parse(JSON.stringify(DEFAULTS.clients));
    this.currencies = JSON.parse(JSON.stringify(DEFAULTS.currencies));
    this.taxes = JSON.parse(JSON.stringify(DEFAULTS.taxes));
    this.currentQuote = getDefaultQuote();
    this.persist();
    this.notify();
  }
};
