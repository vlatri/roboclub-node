import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFile,
  linkValidate
} from '../utils/'

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
  image: {type: Types.File, storage, note: 'Will be resized to 150x75', thumb: true},
  link: {type: Types.Url},
})


Partner.schema.pre('save', async function(next) {
  this.link = linkValidate(this.link)
  this.image =
    await fileValidate(storage, this.image, {url: '/images/fallbacks/partner.jpg', mimetype: 'image/jpeg'})
      .then(resizeImage(this.image, 150, 75))

  next()
})

Partner.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})


Partner.defaultColumns = 'title, text'

Partner.register()