import keystone from 'keystone'

import { configStorage, removeFile } from '../utils/'


const storage = configStorage('/images/posts/')
const { Types } = keystone.Field

const Postsection = new keystone.List('Postsection', {
  map: {name: 'subtitle'},
  singular: 'Postsection',
  plural: 'Postsections',
})


Postsection.add({
  subtitle: {type: String},
  sequenceNumber: {type: Types.Number, default: 0 },
  text: {type: Types.Html, wysiwyg: true, height: 300},
  image: {type: Types.File, storage},
})

Postsection.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})

Postsection.relationship({ ref: 'Post', refPath: 'sections' })
Postsection.defaultColumns = 'subtitle'

Postsection.register()