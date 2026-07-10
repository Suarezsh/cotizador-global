const DEFAULTS = {
  settings: {
    business: {
      name: 'Tu Negocio Global S.A.C.',
      slogan: 'Soluciones profesionales para tu empresa',
      logo: '',
      phone: '+51 999 888 777',
      email: 'hola@tunegocio.com',
      address: 'Av. Principal 123',
      city: 'Lima',
      country: 'Perú',
      taxId: '20501234567',
      website: 'www.tunegocio.com'
    },
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    docPrefix: 'COT-',
    accentColor: '#2563eb',
    visualStyle: 'modern',
    terms: 'Esta cotización tiene una validez de 15 días calendario. El pago se realiza contra entrega.',
    thanks: 'Gracias por confiar en nosotros.',
    footer: ''
  },
  clients: [
    {
      id: 'c1',
      name: 'Cliente Ejemplo S.A.C.',
      address: 'Jr. Comercio 456, Arequipa',
      contact: 'Juan Pérez',
      email: 'juan@cliente.com',
      phone: '+51 999 111 222',
      taxId: '20601234568'
    }
  ],
  currencies: [
    {
      id: 'cur1',
      name: 'Sol Peruano',
      code: 'PEN',
      symbol: 'S/',
      position: 'before',
      thousand: ',',
      decimal: '.',
      default: true
    },
    {
      id: 'cur2',
      name: 'Dólar Estadounidense',
      code: 'USD',
      symbol: '$',
      position: 'before',
      thousand: ',',
      decimal: '.',
      default: false
    }
  ],
  taxes: [
    {
      id: 't1',
      name: 'IGV',
      abbreviation: 'IGV',
      rate: 18,
      taxId: '',
      mode: 'added',
      default: true
    }
  ],
  catalog: [],
  savedQuotes: []
};

function getDefaultQuote() {
  const today = new Date();
  const due = new Date();
  due.setDate(today.getDate() + 15);
  return {
    number: 'COT-001',
    date: today.toISOString().split('T')[0],
    dueDate: due.toISOString().split('T')[0],
    clientId: 'c1',
    items: [
      { id: 'i1', description: 'Servicio profesional de consultoría', type: 'service', unit: 'hora', quantity: 10, price: 150, discount: 0, taxable: true },
      { id: 'i2', description: 'Producto de ejemplo', type: 'product', unit: 'unidad', quantity: 2, price: 300, discount: 10, taxable: true }
    ],
    globalDiscount: 0,
    advance: 0,
    notes: ''
  };
}
