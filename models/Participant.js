import keystone from 'keystone'

import {
  configStorage,
  validateMimeType,
  linkValidate,
  fileValidate,
  removeObsoleteFile,
} from '../utils/'


const { Types } = keystone.Field
const storage = configStorage('/images/team/')

const Participant = new keystone.List('Participant', {
  map: {name: 'person'},
  singular: 'Participant',
  plural: 'Participants',
})

Participant.add({
  person: {type: String, required: true, index: true},
  bio: {type: Types.Html, wysiwyg: true, height: 300, required: true, initial: true, index: true,},
  facebookLink: {type: Types.Url},
  instagramLink: {type: Types.Url},
  avatar: {
    index: true,
    type: Types.File,
    storage,
    thumb: true,
  },
  oldAvatar: {type: Types.File, storage, hidden: true},
})

Participant.schema.pre('validate', async function(next) {
  const { facebookLink, instagramLink, avatar, oldAvatar } = this

  this.facebookLink = linkValidate(facebookLink)
  this.instagramLink = linkValidate(instagramLink)
  this.avatar =
    await fileValidate(storage, avatar, {url: '/images/fallbacks/participant.png', mimetype: 'image/png'})
      .catch(next)

  await removeObsoleteFile(storage, oldAvatar, avatar)
  this.oldAvatar = avatar

  next()
})

Participant.schema.pre('remove', function(next) {
  storage.removeFile(this.avatar, next)
})

Participant.defaultColumns = 'person, bio'

Participant.register()