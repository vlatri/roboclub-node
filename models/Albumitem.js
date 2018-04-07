import keystone from 'keystone'

import {
  updateChildWithRelatedParent,
  configStorage,
  removeFileAsync,
  fileValidate,
  linkValidate,
  compressImage,
  isFileReachable,
  fileExists,
  removeObsoleteFile,
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
  oldPhoto: {type: Types.File, storage, hidden: true},
  video: {type: Types.Url, label: 'YouTube link to a video', dependsOn: {type: 'video'}},
  relatedParent: {
    _id: {type: String, hidden: true},
    title: {type: String, hidden: true, label: 'Related Album'},
  },
})


Albumitem.schema.pre('save', async function(next) {
  const {_id, type, photo, oldPhoto, video} = this

  await updateChildWithRelatedParent(keystone.list('Album').model, Albumitem.model, _id).catch(next)

  if(type === 'photo') {
    this.video = null

    this.photo =
      await fileValidate(storage, photo, { url: '/images/fallbacks/mission.jpg', mimetype: 'image/jpeg' })
      .then(compressImage)
      .catch(next)

    await removeObsoleteFile(storage, oldPhoto, photo).catch(next)
    this.oldPhoto = photo

  } else {
    this.video = linkValidate(video)

    fileExists(photo) && await removeFileAsync(storage, photo).catch(next)
  }

  next()
})

Albumitem.schema.pre('remove', async function(next) {
  const { type, photo } = this
  type === 'photo' &&
    await removeFileAsync(storage, photo)
    .catch(next)

  next()
})

Albumitem.relationship({ ref: 'Album', refPath: 'sections' })

Albumitem.defaultColumns = 'type, title, relatedParent.title'

Albumitem.register()