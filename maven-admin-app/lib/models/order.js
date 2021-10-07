class Order {
  items
  promoGeneratedMeta
  promoUsedMeta
  transactionId
  cardHolderName
  price
  discount
  subtotal
  tax
  total
  status // (pending/paid/failed)
  slug
  history
  isSubscribe
  isEmailSent
  deleted_at
  created_at
  created_by
  updated_at
  updated_by

  constructor(data) {
    this.items = data.items || ''
    this.promoGeneratedMeta = data.promoGeneratedMeta || ''
    this.promoUsedMeta = data.promoUsedMeta || ''
    this.transactionId = data.transactionId || ''
    this.cardHolderName = data.cardHolderName || ''
    this.price = data.price || 0
    this.discount = data.discount || 0
    this.subtotal = data.subtotal || 0
    this.tax = data.tax || 0
    this.total = data.total || 0
    this.status = data.status || 'pending'
    this.slug = data.slug || ''
    this.history = data.history || []
    this.isSubscribe = data.isSubscribe || false
    this.isEmailSent = data.isEmailSent || false

    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      items: this.items,
      promoGeneratedMeta: this.promoGeneratedMeta,
      promoUsedMeta: this.promoUsedMeta,
      transactionId: this.transactionId,
      cardHolderName: this.cardHolderName,
      price: this.price,
      discount: this.discount,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      status: this.status,
      slug: this.slug,
      history: this.history,
      isSubscribe: this.isSubscribe,
      isEmailSent: this.isEmailSent,

      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getStatuses = () => {
    return {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
    }
  }
}

export default Order
