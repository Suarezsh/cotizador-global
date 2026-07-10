const App = {
  currentTab: 'quote',
  openModalId: null,
  confirmCallback: null,

  init() {
    Preview.init();
    this.loadFromHash();
    AppState.init();
    AdminPanel.init();
    QuotePanel.init();
    this.bindNavigation();
    this.bindAlertModal();
    this.bindConfirmModal();
    this.setTab('quote');
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

  bindNavigation() {
    // Navegación inferior móvil
    document.getElementById('nav-quote').addEventListener('click', () => App.setTab('quote'));
    document.getElementById('nav-preview').addEventListener('click', () => App.setTab('preview'));

    // Botón para abrir bottom sheet de configuración (móvil)
    const configSheetBtn = document.getElementById('btn-open-config-sheet');
    if (configSheetBtn) {
      configSheetBtn.addEventListener('click', () => App.openModal('config-sheet'));
    }

    // Botones para abrir modales individuales
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = btn.dataset.modal;
        // Si viene desde el bottom sheet, cerrarlo primero
        const sheet = document.getElementById('config-sheet');
        if (sheet && sheet.classList.contains('is-open')) {
          App.closeModal('config-sheet', false);
          setTimeout(() => App.openModal(modalId), 250);
        } else {
          App.openModal(modalId);
        }
      });
    });

    // Cerrar modales con overlay o botón de cierre
    document.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.floating-modal');
        if (modal) {
          App.closeModal(modal.id);
        }
      });
    });

    // Cerrar bottom sheet
    document.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', () => App.closeModal('config-sheet'));
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && App.openModalId) {
        App.closeModal(App.openModalId);
      }
    });
  },

  bindAlertModal() {
    document.getElementById('alert-ok').addEventListener('click', () => {
      App.closeModal('alert-modal');
    });
    document.querySelector('#alert-modal [data-close-alert]').addEventListener('click', () => {
      App.closeModal('alert-modal');
    });
  },

  bindConfirmModal() {
    document.getElementById('confirm-ok').addEventListener('click', () => {
      App.closeModal('confirm-modal');
      if (typeof App.confirmCallback === 'function') {
        App.confirmCallback();
        App.confirmCallback = null;
      }
    });
    document.getElementById('confirm-cancel').addEventListener('click', () => {
      App.closeModal('confirm-modal');
      App.confirmCallback = null;
    });
    document.querySelector('#confirm-modal [data-close-confirm]').addEventListener('click', () => {
      App.closeModal('confirm-modal');
      App.confirmCallback = null;
    });
  },

  setTab(tab) {
    this.currentTab = tab;

    const leftPanel = document.getElementById('left-panel');
    const mainPreview = document.getElementById('main-preview');
    const navQuote = document.getElementById('nav-quote');
    const navPreview = document.getElementById('nav-preview');

    navQuote.classList.remove('active');
    navPreview.classList.remove('active');

    if (tab === 'preview') {
      leftPanel.classList.add('hidden');
      mainPreview.classList.add('is-visible');
      navPreview.classList.add('active');
      Preview.render();
      return;
    }

    leftPanel.classList.remove('hidden');
    mainPreview.classList.remove('is-visible');
    navQuote.classList.add('active');
    QuotePanel.render();
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.openModalId = modalId;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    AdminPanel.render();
  },

  closeModal(modalId, restoreBodyOverflow = true) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    if (this.openModalId === modalId) {
      this.openModalId = null;
    }

    if (restoreBodyOverflow && !this.openModalId) {
      document.body.style.overflow = '';
    }
  },

  showAlert(message, options = {}) {
    const title = options.title || 'Mensaje';
    const iconClass = options.icon || 'fa-circle-info';
    const colorClass = options.color || 'blue';

    document.getElementById('alert-title').textContent = title;
    document.getElementById('alert-message').textContent = message;

    const iconBox = document.getElementById('alert-icon');
    iconBox.className = `w-14 h-14 rounded-full bg-${colorClass}-100 text-${colorClass}-600 flex items-center justify-center text-2xl mx-auto mb-4`;
    iconBox.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

    this.openModal('alert-modal');
  },

  showConfirm(message, callback, options = {}) {
    const title = options.title || 'Confirmar';
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-ok').innerHTML = `<i class="fa-solid fa-check mr-1"></i> ${options.okText || 'Sí'}`;
    document.getElementById('confirm-cancel').textContent = options.cancelText || 'Cancelar';

    this.confirmCallback = callback;
    this.openModal('confirm-modal');
  },

  showSavedQuotes() {
    const modal = document.getElementById('saved-quotes-modal');
    const list = document.getElementById('saved-quotes-list');
    const empty = document.getElementById('saved-quotes-empty');

    list.innerHTML = '';

    if (!AppState.savedQuotes.length) {
      list.classList.add('hidden');
      empty.classList.remove('hidden');
    } else {
      list.classList.remove('hidden');
      empty.classList.add('hidden');

      AppState.savedQuotes.slice().reverse().forEach((q) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 gap-3';
        const dateText = q.savedAt ? new Date(q.savedAt).toLocaleString() : '';
        li.innerHTML = `
          <div class="min-w-0 flex-1">
            <div class="font-semibold text-gray-800 text-sm truncate">${q.number || 'Sin número'}</div>
            <div class="text-xs text-gray-500">${dateText}</div>
          </div>
          <div class="flex items-center gap-1">
            <button data-saved-id="${q.savedId}" class="btn-load-saved btn-primary px-3 py-1.5 text-xs" title="Cargar">
              <i class="fa-solid fa-folder-open"></i>
            </button>
            <button data-saved-id="${q.savedId}" class="btn-delete-saved text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md transition text-xs" title="Eliminar">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
        list.appendChild(li);
      });

      list.querySelectorAll('.btn-load-saved').forEach(btn => {
        btn.addEventListener('click', () => {
          AppState.loadSavedQuote(btn.dataset.savedId);
          App.closeModal('saved-quotes-modal');
          App.showAlert('Cotización cargada correctamente', { title: 'Listo', icon: 'fa-check', color: 'green' });
        });
      });

      list.querySelectorAll('.btn-delete-saved').forEach(btn => {
        btn.addEventListener('click', () => {
          App.showConfirm('¿Eliminar esta cotización guardada?', () => {
            AppState.removeSavedQuote(btn.dataset.savedId);
            App.showSavedQuotes();
          });
        });
      });
    }

    this.openModal('saved-quotes-modal');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
