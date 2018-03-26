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



Layout.schema.pre('validate', function(next) {
  // const { coverImage, content, briefDescription } = this
  // let { heroImage } = this

  // const imageFields = [ heroImage, coverImage, getSpecificFields(content, 'image')]
  // heroImage = heroImage || {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'}

  // validateBriefDescLength(briefDescription, maxBriefDescriptionLength, next)
  // imageFields.map(field => validateMimeType(field, 'image', next))

  next()
})

Layout.schema.pre('remove', function(next) {
  const imageFields = [this.heroImage, this.coverImage, getSpecificFields(this.content, 'image')]
  imageFields.map(field => field && storage.removeFile(field, next))
})

Layout.defaultColumns = 'mainTitle, mainSubtitle'

Layout.register()