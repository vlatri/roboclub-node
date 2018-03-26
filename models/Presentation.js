import keystone from 'keystone'


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


Presentation.defaultColumns = 'title, text'

Presentation.register()