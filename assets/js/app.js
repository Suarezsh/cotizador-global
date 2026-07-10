const App = {
  currentTab: 'admin',

  init() {
    Preview.init();
    this.loadFromHash();
    AppState.init();
    AdminPanel.init();
    QuotePanel.init();
    this.setTab('admin');
  },

  loadFromHash() {
    if (window.location.hash && window.location.hash.length > 1) {
      try {
        const json = decodeURIComponent(atob(decodeURIComponent(window.location.hash.slice(1))));
        const data = JSON.parse(json);
        if (data.quote) {
          Storage.save(STORAGE_KEYS.currentQuote, data.quote);
        }
        if (data.settings) {
          Storage.save(STORAGE_KEYS.settings, data.settings);
        }
      } catch (e) {
        console.error('Error leyendo enlace:', e);
      }
    }
  },

  generateShareLink() {
    const data = {
      quote: AppState.currentQuote,
      settings: AppState.settings
    };
    const hash = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(data))));
    return `${window.location.origin}${window.location.pathname}#${hash}`;
  },

  setTab(tab) {
    this.currentTab = tab;
    const adminPanel = document.getElementById('panel-admin');
    const quotePanel = document.getElementById('panel-quote');
    const tabAdmin = document.getElementById('tab-admin');
    const tabQuote = document.getElementById('tab-quote');
    const btnTabAdmin = document.getElementById('btn-tab-admin');
    const btnTabQuote = document.getElementById('btn-tab-quote');

    if (tab === 'admin') {
      adminPanel.classList.remove('hidden');
      quotePanel.classList.add('hidden');
      tabAdmin.classList.add('border-blue-600', 'text-blue-600');
      tabAdmin.classList.remove('border-transparent', 'text-gray-500');
      tabQuote.classList.remove('border-blue-600', 'text-blue-600');
      tabQuote.classList.add('border-transparent', 'text-gray-500');
      btnTabAdmin.classList.add('bg-blue-600', 'text-white');
      btnTabAdmin.classList.remove('bg-gray-200', 'text-gray-700');
      btnTabQuote.classList.remove('bg-blue-600', 'text-white');
      btnTabQuote.classList.add('bg-gray-200', 'text-gray-700');
    } else {
      adminPanel.classList.add('hidden');
      quotePanel.classList.remove('hidden');
      tabQuote.classList.add('border-blue-600', 'text-blue-600');
      tabQuote.classList.remove('border-transparent', 'text-gray-500');
      tabAdmin.classList.remove('border-blue-600', 'text-blue-600');
      tabAdmin.classList.add('border-transparent', 'text-gray-500');
      btnTabQuote.classList.add('bg-blue-600', 'text-white');
      btnTabQuote.classList.remove('bg-gray-200', 'text-gray-700');
      btnTabAdmin.classList.remove('bg-blue-600', 'text-white');
      btnTabAdmin.classList.add('bg-gray-200', 'text-gray-700');
      QuotePanel.render();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
