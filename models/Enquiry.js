import keystone from 'keystone'

const { Types } = keystone.Field


var Enquiry = new keystone.List('Enquiry', {
  nocreate: true,
  noedit: true,
})

Enquiry.add({
  name: { type: String, required: true },
  email: { type: Types.Email },
  phone: { type: String },
  subject: { type: String },
  message: { type: Types.Html, required: true },
  createdAt: { type: Date, default: Date.now },
})


Enquiry.defaultSort = '-createdAt'
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt'
Enquiry.register()
