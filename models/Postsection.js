import keystone from 'keystone'

import {
  configStorage,
  removeFile,
  updateChildWithRelatedParent,
  fileValidate,
} from '../utils/'


const storage = configStorage('/images/posts/')
const { Types } = keystone.Field

const Postsection = new keystone.List('Postsection', {
  map: {name: 'subtitle'},
  singular: 'Postsection',
  plural: 'Postsections',
})


Postsection.add({
  subtitle: {type: String},
  showSubtitle: {type: Boolean, default: true},
  sequenceNumber: {type: Types.Number, default: 0 },
  text: {type: Types.Html, wysiwyg: true, height: 300},
  image: {type: Types.File, storage, thumb: true},
  relatedPost: {type: String, hidden: true},
})

Postsection.schema.pre('save', async function(next) {
  const {image, _id} = this

  await updateChildWithRelatedParent(keystone.list('Post').model, Postsection.model, _id).catch(next)
  this.image = image.filename ? await fileValidate(storage, image, {mimetype: 'image/jpeg'}).catch(next) : {}

  next()
})


Postsection.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})

Postsection.relationship({ ref: 'Post', refPath: 'sections' })

Postsection.defaultColumns = 'subtitle, relatedPost, sequenceNumber|20%'

Postsection.register()