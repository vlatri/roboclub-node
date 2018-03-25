import keystone from 'keystone'
import gm from 'gm'

import { configStorage } from '../utils/'


const { Types } = keystone.Field
const im = gm.subClass({imageMagick: true})

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
    // For some reason it can't be required in Schema.
    // For further details see https://github.com/keystonejs/keystone/issues/4575
    type: Types.File,
    storage,
    note: 'Will be resized to 64x64',
  },
})

Quote.schema.pre('validate', function(next) {
  const { path, filename } = this.authorAvatar

  const url = path + filename
  if(!url) {
    // Either new Quote is being created or no image was specified,
    // set the fallback one and omit it's resizing.
    this.authorAvatar = {url: '/images/fallbacks/quotesAuthors.png', mimetype: 'image/png'}
    return next()
  }
  im(url)
  .resizeExact(64, 64)
  .write(url, next)
})

// TODO: Check for obsolete files and delete those.
Quote.schema.pre('remove', function(next) {
  storage.removeFile(this.authorAvatar, next)
})

Quote.defaultColumns = 'author|20%, text'

Quote.register()