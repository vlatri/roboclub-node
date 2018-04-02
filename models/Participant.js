import keystone from 'keystone'

import {
  configStorage,
  validateMimeType,
  linkValidate,
  fileValidate,
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
})

Participant.schema.pre('validate', async function(next) {
  this.facebookLink = linkValidate(this.facebookLink)
  this.instagramLink = linkValidate(this.instagramLink)
  this.avatar =
    await fileValidate(storage, this.avatar, {url: '/images/fallbacks/participant.png', mimetype: 'image/png'})
      .catch(next)

  next()
})

Participant.schema.pre('remove', function(next) {
  storage.removeFile(this.avatar, next)
})

Participant.defaultColumns = 'person, bio'

Participant.register()