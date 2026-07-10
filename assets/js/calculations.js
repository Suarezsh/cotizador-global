const Calculations = {
  itemTotal(item) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const base = qty * price;
    const discountAmount = discount > 0 && discount <= 100 ? base * (discount / 100) : 0;
    return base - discountAmount;
  },

  calculateQuote(quote, taxes) {
    const items = quote.items || [];
    const taxableItems = items.filter(item => item.taxable !== false);
    const exemptItems = items.filter(item => item.taxable === false);

    const taxableSubtotal = taxableItems.reduce((sum, item) => sum + this.itemTotal(item), 0);
    const exemptSubtotal = exemptItems.reduce((sum, item) => sum + this.itemTotal(item), 0);
    const subtotal = taxableSubtotal + exemptSubtotal;

    const globalDiscountRate = Number(quote.globalDiscount) || 0;
    const globalDiscount = globalDiscountRate > 0 && globalDiscountRate < 100
      ? subtotal * (globalDiscountRate / 100)
      : 0;

    const netSubtotal = subtotal - globalDiscount;

    // Distribuir descuento global proporcionalmente entre gravado y exento
    const taxableRatio = subtotal > 0 ? taxableSubtotal / subtotal : 0;
    const netTaxableSubtotal = taxableSubtotal - (globalDiscount * taxableRatio);

    const taxDetails = taxes.map(tax => {
      const rate = Number(tax.rate) || 0;
      let amount = 0;
      if (tax.mode === 'included') {
        amount = netTaxableSubtotal - (netTaxableSubtotal / (1 + rate / 100));
      } else {
        amount = netTaxableSubtotal * (rate / 100);
      }
      return { ...tax, amount };
    });

    const taxTotal = taxDetails.reduce((sum, t) => sum + t.amount, 0);
    const hasIncluded = taxDetails.some(t => t.mode === 'included');
    const total = hasIncluded ? netSubtotal : netSubtotal + taxTotal;

    const advance = Number(quote.advance) || 0;
    const balance = total - advance;

    return {
      subtotal,
      taxableSubtotal,
      exemptSubtotal,
      globalDiscount,
      netSubtotal,
      netTaxableSubtotal,
      taxDetails,
      taxTotal,
      total,
      advance,
      balance
    };
  }
};
