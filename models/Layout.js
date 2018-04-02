import keystone from 'keystone'

import { configStorage, linkValidate, fileValidate } from '../utils/'

const { Types } = keystone.Field
const storage = configStorage('/images/home/')

const Layout = new keystone.List('Layout', {
  map: {name: 'mainTitle'},
  singular: 'Layout',
  plural: 'Layouts',
  nocreate: true,
  nodelete: true,
})


Layout.add({
  mainTitle: {type: String, required: true},
  mainSubtitle: {type: String},
  coverImage: {type: Types.File, storage, thumb: true},
  articleTitle: {type: String},
  articleLeftColumn: {type: Types.Html, wysiwyg: true},
  articleRightColumn: {type: Types.Html, wysiwyg: true},
  introSubtitle: {type: String},
  introText: {type: Types.Html, wysiwyg: true},
  registerLink: {type: Types.Url},
})


Layout.schema.pre('save', async function(next) {
  const { registerLink, coverImage } = this

  this.registerLink = linkValidate(registerLink)
  this.coverImage =
    await fileValidate(storage, coverImage, {
      url: '/images/fallbacks/homeCover.jpg',
      mimetype: 'image/jpeg'
    }).catch(next)

  next()
})

Layout.schema.pre('remove', function(next) {
  removeFile(storage, this.coverImage)
  .then(next).catch(next)
})

Layout.defaultColumns = 'mainTitle, mainSubtitle'

Layout.register()