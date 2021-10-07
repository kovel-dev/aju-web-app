class ConctactFormSchema {
  static getSchema(handleOnChange, contactData, clickSubmit, isLoading) {
    return [
      {
        type: 'heading',
        heading: 'Have a question or comment? Drop us a line!',
      },
      {
        type: 'text',
        label: 'Name',
        id: 'name',
        name: 'name',
        autoComplete: 'name',
        placeholder: 'Name*',
        disabled: isLoading,
        required: true,
        width: 'xl',
        onChange: handleOnChange,
        value: contactData.name.value,
        error: clickSubmit ? contactData.name.error : '',
      },
      {
        type: 'email',
        label: 'Email',
        id: 'contact-email',
        name: 'contact_email',
        autoComplete: '',
        placeholder: 'Email*',
        disabled: isLoading,
        required: true,
        width: 'xl',
        onChange: handleOnChange,
        value: contactData.contact_email.value,
        error: clickSubmit ? contactData.contact_email.error : '',
      },
      {
        type: 'phone',
        id: 'phone',
        name: 'phone',
        autoComplete: '',
        placeholder: 'Mobile Number',
        disabled: isLoading,
        required: false,
        width: 'xl',
        onChange: handleOnChange,
        value: contactData.phone.value,
        error: clickSubmit ? contactData.phone.error : '',
      },
      {
        type: 'checkbox',
        label: 'I prefer to be contacted by phone',
        id: 'prefer-phone',
        options: [
          {
            label: 'I prefer to be contacted by phone',
            id: 'prefer-phone',
            name: 'prefer_phone',
            value: '',
          },
        ],
      },
      {
        type: 'textarea',
        label: 'Message',
        id: 'message',
        instructions: '',
        name: 'message',
        autoComplete: '',
        placeholder: 'Message*',
        disabled: isLoading,
        required: true,
        rows: 10,
        onChange: handleOnChange,
        value: contactData.message.value,
        error: clickSubmit ? contactData.message.error : '',
      },
    ]
  }
}

export default ConctactFormSchema
