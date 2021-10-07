export default class ConctactFormValidation {
  static getSchema() {
    return {
      name: {
        required: true,
        validator: {
          regEx: /^((?!null).)([a-zA-Zâêîôûéàèùçäëïü0-9 '.,-]*)$/,
          error: 'Invalid format.',
        },
        maxLength: 80,
      },
      phone: {
        required: false,
        validator: {
          regEx: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          error: 'Invalid format.',
        },
      },
      contact_email: {
        required: true,
        validator: {
          regEx:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
          error: 'Please enter a valid email address.',
        },
      },
      prefer_phone: {
        required: false,
        error: '',
      },
      message: {
        required: true,
        validator: {
          regEx: /.*/i,
          error: 'Message field is required.',
        },
        minLength: 25,
        maxLength: 3000,
        multiWord: true,
      },
    }
  }
}
