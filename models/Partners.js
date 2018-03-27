import keystone from 'keystone'

import { configStorage, fileValidate, resizeImage, removeFile, linkValidate } from '../utils/'

const storage = configStorage('/images/partners/')
const { Types } = keystone.Field

const Partner = new keystone.List('Partner', {
  map: {name: 'title'},
  singular: 'Partner',
  plural: 'Partners',
})


Partner.add({
  title: {type: String, required: true},
  text: {type: Types.Html, wysiwyg: true },
  image: {type: Types.File, storage, note: 'Will be resized to 150x75' },
  link: {type: Types.Url},
})


Partner.schema.post('save', function(doc, next) {
  linkValidate(Partner.model, doc, 'link', next)

  fileValidate(Partner.model, storage, doc, 'image', {url: '/fallbacks/partner.jpg', mimetype: 'image/jpeg'}, next,
    (doc, fieldName, next) => resizeImage(doc[fieldName], 150, 75, next)
  )
})

Partner.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})


Partner.defaultColumns = 'title, text'

Partner.register()