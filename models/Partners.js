import keystone from 'keystone'

import { configStorage, validateMimeType } from '../utils/'


const storage = configStorage('/images/partners/')
const { Types } = keystone.Field

const Partner = new keystone.List('Partner', {
  map: {name: 'title'},
  singular: 'Partner',
  plural: 'Partners',
})


Partner.add({
  title: {type: String},
  text: {type: Types.Html, wysiwyg: true},
  image: {type: Types.File, storage},
})


Partner.defaultColumns = 'title, text'

Partner.register()