import keystone from 'keystone'

import { configStorage, validateMimeType } from '../utils/'

const maxBriefDescriptionLength = 50
const { Types } = keystone.Field
const storage = configStorage('/images/posts/')

const Post = new keystone.List('Post', {
  map: {name: 'heading'},
  autokey: { path: 'slug', from: 'heading', unique: true },
  singular: 'Post',
  plural: 'Posts',
})

const generateContentFields = n => {
  let result = {
    sectionsCount: {type: Number, default: n, required: true, hidden: true}
  }
  for(let i=1; i <= n; i++) {
    result = Object.assign(result, {
      [`${i}_subtitle`]: {type: String, collapse: true, label: `Subtitle ${i}`},
      [`${i}_text`]: {type: Types.Html, wysiwyg: true, height: 300, collapse: true, label: `Text ${i}`},
      [`${i}_image`]: {type: Types.File, storage, collapse: true, label: `Image ${i}`},
    })
  }
  return result
}

Post.add({
  heading: {type: String, required: true},
  author: {type: String},
  // author: { type: Types.Relationship, ref: 'User', index: true, required: true, initial: false, },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  coverImage: {type: Types.File, storage},
  heroImage: {type: Types.File, storage, note: 'Small square image used on previews.'},
  briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`},
  const: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  content: generateContentFields(8),
})


const getSpecificFields = (obj, containedPattern) =>
  Object.keys(obj)
    .filter(key => ~key.indexOf(containedPattern))
    .map(key => obj[key])

const validateBriefDescLength = (text, max, cb) =>
  text.length > max && cb(new Error(`Brief description is ${text.length - maxBriefDescriptionLength} characters too long.`))


Post.schema.pre('validate', function(next) {
  if(!this.heroImage) {
    // Either new Post is being created or no hero image was specified,
    // set the fallback one.
    this.heroImage = {url: '/images/fallbacks/heroNews.png', mimetype: 'image/png'}
  }

  validateBriefDescLength(this.briefDescription, this.const, next)
  getSpecificFields(this.content, 'image')
    .map(field => validateMimeType(field, 'image', next))
})

Post.schema.pre('remove', function(next) {
  const removeFileByField = field => field && storage.removeFile(field, next)

  getSpecificFields(this.content, 'image').map(removeFileByField)
  [this.heroImage, this.coverImage].map(removeFileByField)
})

Post.defaultColumns = 'heading, author|10%, state|10%, publishedDate|15%'

Post.register()