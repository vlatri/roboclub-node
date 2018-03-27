import keystone from 'keystone'

import { configStorage, validateMimeType } from '../utils/'

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
  coverImage: {type: Types.File, storage},
  articleTitle: {type: String},
  articleLeftColumn: {type: Types.Html, wysiwyg: true},
  articleRightColumn: {type: Types.Html, wysiwyg: true},
  introSubtitle: {type: String},
  introText: {type: Types.Html, wysiwyg: true},
  registerLink: {type: Types.Url},
})


Layout.schema.post('save', function(doc, next) {
  linkValidate(Layout.model, doc, 'registerLink', next)

  fileValidate(Layout.model, storage, doc, 'coverImage', {url: '/fallbacks/homeCover.jpg', mimetype: 'image/jpeg'}, next)
})

Layout.schema.pre('remove', function(next) {
  removeFile(storage, this.coverImage, next)
})

Layout.defaultColumns = 'mainTitle, mainSubtitle'

Layout.register()