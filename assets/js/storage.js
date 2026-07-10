const STORAGE_KEYS = {
  settings: 'globalSettings',
  clients: 'globalClients',
  currencies: 'globalCurrencies',
  taxes: 'globalTaxes',
  savedQuotes: 'savedQuotes',
  currentQuote: 'currentQuote'
};

const Storage = {
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error guardando en LocalStorage:', e);
    }
  },

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Error cargando de LocalStorage:', e);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  exportAll() {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = this.load(key);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizador-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importAll(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              this.save(key, value);
            }
          });
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  },

  isFirstVisit() {
    return !localStorage.getItem(STORAGE_KEYS.settings);
  }
};
