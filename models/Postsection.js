import keystone from 'keystone'

import { configStorage, removeFile, ensureSequenceNumberIsUnique } from '../utils/'


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
  image: {type: Types.File, storage},
  relatedPost: {type: String, hidden: true},
})

Postsection.schema.pre('validate', function(next) {
  keystone.list('Post').model.findOne({sections: this._id}, {heading: true}).exec((err, res) => {
    if(err) return next(err)
    if(!res) return next()
    Postsection.model.update({_id: this._id}, {relatedPost: res.heading}).exec(next)
  })
})


Postsection.schema.pre('remove', function(next) {
  removeFile(storage, this.image, next)
})

Postsection.relationship({ ref: 'Post', refPath: 'sections' })

Postsection.defaultColumns = 'subtitle, relatedPost, sequenceNumber|20%'

Postsection.register()