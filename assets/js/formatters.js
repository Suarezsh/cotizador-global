const Formatters = {
  formatMoney(amount, currency) {
    const value = Number(amount || 0).toFixed(2);
    const parts = value.split('.');
    const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousand || ',');
    const formatted = integer + (currency.decimal || '.') + parts[1];
    return currency.position === 'after'
      ? `${formatted} ${currency.code}`
      : `${currency.symbol}${formatted}`;
  },

  formatDate(dateString, format) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    switch (format) {
      case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD': return dateString;
      case 'DD/MM/YYYY':
      default: return `${day}/${month}/${year}`;
    }
  },

  generateNumber(prefix, count) {
    return prefix + count.toString().padStart(3, '0');
  },

  labels: {
    es: {
      quote: 'COTIZACIÓN',
      date: 'Fecha',
      dueDate: 'Vencimiento',
      client: 'Cliente',
      item: 'Ítem',
      description: 'Descripción',
      quantity: 'Cant.',
      price: 'Precio',
      discount: 'Desc.',
      total: 'Total',
      subtotal: 'Subtotal',
      taxes: 'Impuestos',
      globalDiscount: 'Descuento global',
      advance: 'Anticipo',
      balance: 'Saldo pendiente',
      finalTotal: 'Total',
      terms: 'Términos y condiciones',
      notes: 'Notas'
    },
    en: {
      quote: 'QUOTE',
      date: 'Date',
      dueDate: 'Due date',
      client: 'Client',
      item: 'Item',
      description: 'Description',
      quantity: 'Qty.',
      price: 'Price',
      discount: 'Disc.',
      total: 'Total',
      subtotal: 'Subtotal',
      taxes: 'Taxes',
      globalDiscount: 'Global discount',
      advance: 'Advance',
      balance: 'Balance due',
      finalTotal: 'Total',
      terms: 'Terms & conditions',
      notes: 'Notes'
    },
    pt: {
      quote: 'ORÇAMENTO',
      date: 'Data',
      dueDate: 'Vencimento',
      client: 'Cliente',
      item: 'Item',
      description: 'Descrição',
      quantity: 'Qtd.',
      price: 'Preço',
      discount: 'Desc.',
      total: 'Total',
      subtotal: 'Subtotal',
      taxes: 'Impostos',
      globalDiscount: 'Desconto global',
      advance: 'Adiantamento',
      balance: 'Saldo devedor',
      finalTotal: 'Total',
      terms: 'Termos e condições',
      notes: 'Notas'
    },
    fr: {
      quote: 'DEVIS',
      date: 'Date',
      dueDate: 'Échéance',
      client: 'Client',
      item: 'Article',
      description: 'Description',
      quantity: 'Qté',
      price: 'Prix',
      discount: 'Rem.',
      total: 'Total',
      subtotal: 'Sous-total',
      taxes: 'Taxes',
      globalDiscount: 'Remise globale',
      advance: 'Acompte',
      balance: 'Solde dû',
      finalTotal: 'Total',
      terms: 'Termes et conditions',
      notes: 'Notes'
    }
  }
};
