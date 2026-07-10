const App = {
  currentTab: 'admin',

  init() {
    AppState.init();
    AdminPanel.init();
    QuotePanel.init();
    Preview.init();
    this.setTab('admin');
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
