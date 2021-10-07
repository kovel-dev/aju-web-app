export const hasError = (errors, field) => {
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].key == field) {
      return true
    }
  }
}

export const hasFormError = (errors, model, dirtyFieldsState) => {
  let fields = Object.keys(model)
  for (let i = 0; i < fields.length; i++) {
    if (hasError(errors, fields[i]) && isDirty(dirtyFieldsState, fields[i])) {
      return true
    }
  }

  return false
}

export const isDirty = (dirtyFields, field) => {
  for (let i = 0; i < dirtyFields.length; i++) {
    if (dirtyFields[i] == field) {
      return true
    }
  }
}

export const getErrorMessage = (errors, field) => {
  let errorMsg = ''
  for (let i = 0; i < errors.length; i++) {
    if (errors[i].key == field) {
      errorMsg = errors[i].values
    }
  }

  if (errorMsg.length > 0) {
    return errorMsg
  }
}
