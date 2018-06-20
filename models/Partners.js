import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFile,
  linkValidate,
  removeObsoleteFile,
  compressImage,
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
  image: {type: Types.File, storage, note: 'Please respect 2:1 ratio.', thumb: true},
  oldImage: {type: Types.File, storage, hidden: true},
  link: {type: Types.Url},
})


Partner.schema.pre('save', async function(next) {
  const { link, image, oldImage } = this

  this.link = linkValidate(link)

  this.image =
    await fileValidate(storage, image, {url: '/images/fallbacks/partner.jpg', mimetype: 'image/jpeg'})
      .then(resizeImage(image, 150, 75))
      .then(compressImage(image))
      .catch(next)

  await removeObsoleteFile(storage, oldImage, image)
  this.oldImage = image

  next()
})

Partner.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})


Partner.defaultColumns = 'title, text'

Partner.register()