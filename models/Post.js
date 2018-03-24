import keystone from 'keystone'

import { configStorage } from '../utils/'


const { Types } = keystone.Field
const storage = configStorage('/images/posts/')

const Post = new keystone.List('Post', {
  map: {name: 'heading'},
  autokey: { path: 'slug', from: 'title', unique: true },
  singular: 'Post',
  plural: 'Posts',
})

const generateContentFields = n => {
  let result = {}
  for(let i=1; i <= n; i++) {
    result = Object.assign(result, {
      [`subtitle${i}`]: {type: String, collapse: true},
      [`text${i}`]: {type: Types.Html, wysiwyg: true, height: 300, collapse: true},
      [`image${i}`]: {type: Types.File, storage, collapse: true},
    })
  }
  return result
}

Post.add({
  heading: {type: String, required: true},
  author: { type: Types.Relationship, ref: 'User', index: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  coverImage: {type: Types.File, storage},
  briefContent: {type: Types.Html, wysiwyg: true, height: 150},
  content: generateContentFields(4),
})


const validateMimeType = (file, desiredType, cb) => {
  const { mimetype } = file
  if(mimetype && !~mimetype.indexOf(desiredType)) {
    storage.removeFile(file, err => err && cb(err))
    return cb(new Error(`File #${i} is not an image!`))
  }
  cb()
}

const getSpecificFields = (obj, containedPattern) =>
  Object.keys(obj)
    .filter(key => ~key.indexOf(containedPattern))
    .map(key => obj[key])

Post.schema.pre('validate', function(next) {
  getSpecificFields(this.content, 'image')
    .map(field => validateMimeType(field, 'image', next))
})

Post.schema.pre('remove', function(next) {
  getSpecificFields(this.content, 'image').map(field =>
    field && storage.removeFile(field, next)
  )
})

Post.defaultColumns = 'author|20%, heading'

Post.register()