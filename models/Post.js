import keystone from 'keystone'

import { configStorage, fileValidate, resizeImage, removeFile } from '../utils/'

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
      [`${i}_image`]: {type: Types.File, storage, collapse: true, label: `Image ${i}`, note: 'Will be resized to 240x240'},
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
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  content: generateContentFields(12),
})


const getSpecificFieldNames = (obj, containedPattern) =>
  Object.keys(obj)
    .filter(key => ~key.indexOf(containedPattern))

const validateBriefDescLength = (text, max, next) =>
  text && (text.length > max) && next(new Error(`Brief description is ${text.length - maxBriefDescriptionLength} characters too long.`))


Post.schema.pre('validate', function(next) {
  const { content, briefDescription, heroImage } = this

  validateBriefDescLength(briefDescription, maxBriefDescriptionLength, next);

  getSpecificFieldNames(content, 'image')
    .map(fieldName => fileValidate(Post.model, storage, this, fieldName, {}, next))

  fileValidate(Post.model, storage, this, 'heroImage', {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'}, next,
    (doc, fieldName, next) => resizeImage(doc[fieldName], 240, 240, next)
  )

})

Post.schema.pre('remove', function(next) {
  [...getSpecificFieldNames(this, 'image'), ...getSpecificFieldNames(this.content, 'image')]
    .map(field => removeFile(storage, this[field], next))
})

Post.defaultColumns = 'heading, author|10%, state|10%, publishedDate|15%'

Post.register()