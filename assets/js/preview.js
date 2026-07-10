const Preview = {
  init() {
    AppState.subscribe(() => this.render());
  },

  render() {
    const container = document.getElementById('a4-preview');
    const settings = AppState.settings;
    const quote = AppState.currentQuote;
    const client = AppState.clients.find(c => c.id === quote.clientId) || { name: '', address: '', contact: '', email: '', phone: '', taxId: '' };
    const currency = AppState.getDefaultCurrency();
    const taxes = AppState.getDefaultTaxes();
    const calc = Calculations.calculateQuote(quote, taxes);
    const labels = Formatters.labels[settings.language] || Formatters.labels.es;

    container.className = `a4-sheet mx-auto bg-white shadow-lg print:shadow-none print:m-0 style-${settings.visualStyle}`;
    container.style.setProperty('--accent-color', settings.accentColor || '#2563eb');

    container.innerHTML = `
      <header class="preview-header">
        <div class="preview-brand">
          ${settings.business.logo ? `<img src="${settings.business.logo}" alt="Logo" class="preview-logo">` : ''}
          <div>
            <h1 class="preview-business-name">${settings.business.name || ''}</h1>
            ${settings.business.slogan ? `<p class="preview-slogan">${settings.business.slogan}</p>` : ''}
          </div>
        </div>
        <div class="preview-doc-info">
          <h2 class="preview-title">${labels.quote}</h2>
          <p><strong>${quote.number || ''}</strong></p>
          <p>${labels.date}: ${Formatters.formatDate(quote.date, settings.dateFormat)}</p>
          <p>${labels.dueDate}: ${Formatters.formatDate(quote.dueDate, settings.dateFormat)}</p>
        </div>
      </header>

      <section class="preview-parties">
        <div class="preview-emisor">
          <h3>${settings.business.name || 'Emisor'}</h3>
          ${settings.business.taxId ? `<p>ID: ${settings.business.taxId}</p>` : ''}
          ${settings.business.address ? `<p>${settings.business.address}</p>` : ''}
          ${settings.business.city ? `<p>${settings.business.city}${settings.business.country ? ', ' + settings.business.country : ''}</p>` : ''}
          ${settings.business.phone ? `<p>${settings.business.phone}</p>` : ''}
          ${settings.business.email ? `<p>${settings.business.email}</p>` : ''}
          ${settings.business.website ? `<p>${settings.business.website}</p>` : ''}
        </div>
        <div class="preview-client">
          <h3>${labels.client}</h3>
          <p><strong>${client.name || ''}</strong></p>
          ${client.taxId ? `<p>ID: ${client.taxId}</p>` : ''}
          ${client.address ? `<p>${client.address}</p>` : ''}
          ${client.contact ? `<p>${client.contact}</p>` : ''}
          ${client.phone ? `<p>${client.phone}</p>` : ''}
          ${client.email ? `<p>${client.email}</p>` : ''}
        </div>
      </section>

      <table class="preview-table">
        <thead>
          <tr>
            <th>#</th>
            <th>${labels.description}</th>
            <th>${labels.quantity}</th>
            <th>${labels.price}</th>
            ${calc.globalDiscount > 0 ? `<th>${labels.discount}</th>` : ''}
            <th>${labels.total}</th>
          </tr>
        </thead>
        <tbody>
          ${quote.items.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.description || ''}<br><small>${item.type === 'service' ? 'Servicio' : 'Producto'} / ${item.unit || ''}</small></td>
              <td>${item.quantity || 0}</td>
              <td>${Formatters.formatMoney(item.price, currency)}</td>
              ${calc.globalDiscount > 0 ? `<td>${item.discount || 0}%</td>` : ''}
              <td>${Formatters.formatMoney(Calculations.itemTotal(item), currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <section class="preview-totals">
        <div class="preview-totals-row"><span>${labels.subtotal}</span><span>${Formatters.formatMoney(calc.subtotal, currency)}</span></div>
        ${calc.globalDiscount > 0 ? `<div class="preview-totals-row"><span>${labels.globalDiscount}</span><span>-${Formatters.formatMoney(calc.globalDiscount, currency)}</span></div>` : ''}
        ${calc.taxDetails.map(t => `<div class="preview-totals-row"><span>${t.name} (${t.rate}%)</span><span>${Formatters.formatMoney(t.amount, currency)}</span></div>`).join('')}
        <div class="preview-totals-row preview-grand-total"><span>${labels.finalTotal}</span><span>${Formatters.formatMoney(calc.total, currency)}</span></div>
        ${calc.advance > 0 ? `
          <div class="preview-totals-row"><span>${labels.advance}</span><span>${Formatters.formatMoney(calc.advance, currency)}</span></div>
          <div class="preview-totals-row"><span>${labels.balance}</span><span>${Formatters.formatMoney(calc.balance, currency)}</span></div>
        ` : ''}
      </section>

      ${settings.terms ? `
        <section class="preview-terms">
          <h4>${labels.terms}</h4>
          <p>${settings.terms}</p>
        </section>
      ` : ''}

      ${quote.notes ? `
        <section class="preview-notes">
          <h4>${labels.notes}</h4>
          <p>${quote.notes}</p>
        </section>
      ` : ''}

      ${settings.thanks ? `<p class="preview-thanks">${settings.thanks}</p>` : ''}
      ${settings.footer ? `<footer class="preview-footer">${settings.footer}</footer>` : ''}
    `;
  }
};
