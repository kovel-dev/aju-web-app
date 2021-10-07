class Attendee {
  orderId
  productId
  userId
  status // (active/inactive)
  comments
  answerMeta

  deleted_at
  created_at
  created_by
  updated_at
  updated_by

  constructor(data) {
    this.orderId = data.orderId || ''
    this.productId = data.productId || ''
    this.userId = data.userId || ''
    this.status = data.status || 'active'
    this.comments = data.comments || ''
    this.answerMeta = data.answerMeta || ''

    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      orderId: this.orderId,
      productId: this.productId,
      userId: this.userId,
      status: this.status,
      comments: this.comments,
      answerMeta: this.answerMeta,

      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }
}

export default Attendee
