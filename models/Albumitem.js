import keystone from 'keystone'

import {
  updateChildWithRelatedParent,
  configStorage,
  removeFileAsync,
  fileValidate,
  linkValidate,
} from '../utils'


const storage = configStorage('/images/albums/')
const { Types } = keystone.Field
const maxBriefDescriptionLength = 50

const Albumitem = new keystone.List('Albumitem', {
  map: {name: 'title'},
  singular: 'Album item',
  plural: 'Album items',
  label: 'Album items',
})


Albumitem.add({
  title: {type: String, required: true},
  type: {type: Types.Select, options: ['photo', 'video'], required: true, initial: true, index: true, default: 'photo'},
  photo: {type: Types.File, storage, thumb: true, dependsOn: {type: 'photo'}},
  video: {type: Types.Url, label: 'YouTube link to a video', dependsOn: {type: 'video'}},
  relatedParent: {
    _id: {type: String, hidden: true},
    title: {type: String, hidden: true, label: 'Related Album'},
  },
})

Albumitem.schema.pre('save', async function(next) {
  const {_id, type, photo, video} = this

  await updateChildWithRelatedParent(keystone.list('Album').model, Albumitem.model, _id).catch(next)

  if(type === 'photo') {
    this.video = null
    this.photo =
      await fileValidate(storage, photo, {url: '/images/fallbacks/mission.jpg', mimetype: 'image/jpeg'}).catch(next)
  } else {
    if(this.photo.filename) await removeFileAsync(storage, photo).catch(next)
    this.video = linkValidate(video)
  }

  next()
})

Albumitem.schema.pre('remove', async function(next) {
  this.type === 'photo' && await removeFileAsync(storage, this.photo).catch(next)

  next()
})

Albumitem.relationship({ ref: 'Album', refPath: 'sections' })

Albumitem.defaultColumns = 'type, title, relatedParent.title'

Albumitem.register()