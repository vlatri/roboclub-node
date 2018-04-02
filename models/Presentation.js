import keystone from 'keystone'

import { linkValidate } from '../utils/'

const { Types } = keystone.Field

const Presentation = new keystone.List('Presentation', {
  map: {name: 'title'},
  singular: 'Presentation',
  plural: 'Presentations',
})


Presentation.add({
  title: {type: String},
  text: {type: Types.Html, wysiwyg: true},
  viewLink: {type: Types.Url},
  downloadLink: {type: Types.Url},
})

Presentation.schema.pre('save', function(next) {
  this.viewLink = linkValidate(this.viewLink)
  this.downloadLink = linkValidate(this.downloadLink)

  next()
})

Presentation.defaultColumns = 'title, text'

Presentation.register()