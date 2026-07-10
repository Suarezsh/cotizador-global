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
          <div class="preview-doc-number">${quote.number || ''}</div>
          <div class="preview-doc-meta">
            <span><strong>${labels.date}:</strong> ${Formatters.formatDate(quote.date, settings.dateFormat)}</span>
            <span><strong>${labels.dueDate}:</strong> ${Formatters.formatDate(quote.dueDate, settings.dateFormat)}</span>
          </div>
        </div>
      </header>

      <section class="preview-parties">
        <div class="preview-party-box">
          <h3>${labels.emisor || 'De'}</h3>
          <p class="party-name">${settings.business.name || 'Emisor'}</p>
          ${settings.business.taxId ? `<p>ID: ${settings.business.taxId}</p>` : ''}
          ${settings.business.address ? `<p>${settings.business.address}</p>` : ''}
          ${settings.business.city ? `<p>${settings.business.city}${settings.business.country ? ', ' + settings.business.country : ''}</p>` : ''}
          ${settings.business.phone ? `<p>${settings.business.phone}</p>` : ''}
          ${settings.business.email ? `<p>${settings.business.email}</p>` : ''}
          ${settings.business.website ? `<p>${settings.business.website}</p>` : ''}
        </div>
        <div class="preview-party-box client">
          <h3>${labels.client}</h3>
          <p class="party-name">${client.name || ''}</p>
          ${client.taxId ? `<p>ID: ${client.taxId}</p>` : ''}
          ${client.address ? `<p>${client.address}</p>` : ''}
          ${client.contact ? `<p>${client.contact}</p>` : ''}
          ${client.phone ? `<p>${client.phone}</p>` : ''}
          ${client.email ? `<p>${client.email}</p>` : ''}
        </div>
      </section>

      <div class="preview-table-wrap">
        <table class="preview-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-desc">${labels.description}</th>
              <th class="col-qty">${labels.quantity}</th>
              <th class="col-price">${labels.price}</th>
              ${calc.globalDiscount > 0 ? `<th class="col-disc">${labels.discount}</th>` : ''}
              <th class="col-total">${labels.total}</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items.map((item, idx) => `
              <tr>
                <td class="col-num">${idx + 1}</td>
                <td class="col-desc">
                  ${item.description || ''}
                  <span class="preview-item-type">${item.type === 'service' ? 'Servicio' : 'Producto'} / ${item.unit || ''}${item.taxable === false ? ' — Exento' : ''}</span>
                </td>
                <td class="col-qty">${item.quantity || 0}</td>
                <td class="col-price">${Formatters.formatMoney(item.price, currency)}</td>
                ${calc.globalDiscount > 0 ? `<td class="col-disc">${item.discount || 0}%</td>` : ''}
                <td class="col-total">${Formatters.formatMoney(Calculations.itemTotal(item), currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <section class="preview-totals">
        <div class="preview-totals-row"><span>${labels.subtotal}</span><span>${Formatters.formatMoney(calc.subtotal, currency)}</span></div>
        ${calc.globalDiscount > 0 ? `<div class="preview-totals-row discount"><span>${labels.globalDiscount}</span><span>-${Formatters.formatMoney(calc.globalDiscount, currency)}</span></div>` : ''}
        ${calc.taxDetails.map(t => `<div class="preview-totals-row"><span>${t.name} (${t.rate}%)</span><span>${Formatters.formatMoney(t.amount, currency)}</span></div>`).join('')}
        <div class="preview-grand-total"><span>${labels.finalTotal}</span><span>${Formatters.formatMoney(calc.total, currency)}</span></div>
        ${calc.advance > 0 ? `
          <div class="preview-totals-row"><span>${labels.advance}</span><span>${Formatters.formatMoney(calc.advance, currency)}</span></div>
          <div class="preview-totals-row balance"><span>${labels.balance}</span><span>${Formatters.formatMoney(calc.balance, currency)}</span></div>
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
