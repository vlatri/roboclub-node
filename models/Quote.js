import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  removeFile,
  resizeImage,
  compressImage,
  removeObsoleteFile,
} from '../utils/'


const { Types } = keystone.Field
const storage = configStorage('/images/quotesAuthors/')

const Quote = new keystone.List('Quote', {
  map: {name: 'author'},
  singular: 'Quote',
  plural: 'Quotes',
})

Quote.add({
  author: {type: String, required: true},
  text: {type: Types.Html, wysiwyg: true, height: 300},
  authorAvatar: {
    type: Types.File,
    storage,
    note: 'Will be resized to 64x64',
    thumb: true,
  },
  oldAuthorAvatar: {type: Types.File, storage, hidden: true},
})

Quote.schema.pre('validate', async function(next) {
  const {authorAvatar, oldAuthorAvatar} = this

  this.authorAvatar =
    await fileValidate(storage, authorAvatar, {url: '/images/fallbacks/quotesAuthors.png', mimetype: 'image/png'})
      .then(resizeImage(authorAvatar, 64, 64))
      .then(compressImage(authorAvatar))
      .catch(next)

  await removeObsoleteFile(storage, oldAuthorAvatar, authorAvatar)
  this.oldAuthorAvatar = authorAvatar

  next()
})


Quote.schema.pre('remove', function(next) {
  removeFile(storage, this.authorAvatar, next)
})

Quote.defaultColumns = 'author|20%, text'

Quote.register()