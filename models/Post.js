import keystone from 'keystone'

import { configStorage, fileValidate, resizeImage, removeFile } from '../utils/'


const storage = configStorage('/images/posts/')
const maxBriefDescriptionLength = 50
const { Types } = keystone.Field


const Post = new keystone.List('Post', {
  map: {name: 'heading'},
  autokey: { path: 'slug', from: 'heading', unique: true },
  singular: 'Post',
  plural: 'Posts',
})


Post.add({
  heading: {type: String, required: true},
  author: {type: String},
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  coverImage: {type: Types.File, storage},
  heroImage: {type: Types.File, storage, note: 'Small square image used on previews. Will be resized to 240x240.'},
  briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`},
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  sections: { type: Types.Relationship, ref: 'Postsection', many: true },
})


const validateBriefDescLength = (text, max, next) =>
  text && (text.length > max) && next(new Error(`Brief description is ${text.length - maxBriefDescriptionLength} characters too long.`))

Post.schema.pre('validate', function(next) {
  validateBriefDescLength(this.briefDescription, maxBriefDescriptionLength, next)

  fileValidate(Post.model, storage, this, 'heroImage', {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'}, next,
    (doc, fieldName, next) => resizeImage(doc[fieldName], 240, 240, next)
  )
})

Post.schema.pre('remove', function(next) {
  removeFile(storage, this.heroImage, next)
})


Post.defaultColumns = 'heading, sections, author|10%, state|10%, publishedDate|15%'

Post.register()