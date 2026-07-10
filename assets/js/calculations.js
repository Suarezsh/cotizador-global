const Calculations = {
  itemTotal(item) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const base = qty * price;
    const discountAmount = discount > 0 && discount < 100 ? base * (discount / 100) : 0;
    return base - discountAmount;
  },

  calculateQuote(quote, taxes) {
    const items = quote.items || [];
    const subtotal = items.reduce((sum, item) => sum + this.itemTotal(item), 0);

    const globalDiscountRate = Number(quote.globalDiscount) || 0;
    const globalDiscount = globalDiscountRate > 0 && globalDiscountRate < 100
      ? subtotal * (globalDiscountRate / 100)
      : 0;

    const netSubtotal = subtotal - globalDiscount;

    const taxDetails = taxes.map(tax => {
      const rate = Number(tax.rate) || 0;
      let amount = 0;
      if (tax.mode === 'included') {
        amount = netSubtotal - (netSubtotal / (1 + rate / 100));
      } else {
        amount = netSubtotal * (rate / 100);
      }
      return { ...tax, amount };
    });

    const taxTotal = taxDetails.reduce((sum, t) => sum + t.amount, 0);
    const total = taxDetails.some(t => t.mode === 'included')
      ? netSubtotal
      : netSubtotal + taxTotal;

    const advance = Number(quote.advance) || 0;
    const balance = total - advance;

    return {
      subtotal,
      globalDiscount,
      netSubtotal,
      taxDetails,
      taxTotal,
      total,
      advance,
      balance
    };
  }
};
