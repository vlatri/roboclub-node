import keystone from 'keystone'

import { configStorage, validateMimeType } from '../utils/'


const { Types } = keystone.Field

const storage = configStorage('/images/team/')

const Participant = new keystone.List('Participant', {
  map: {name: 'person'},
  singular: 'Participant',
  plural: 'Participants',
})

Participant.add({
  person: {type: String, required: true, index: true},
  bio: {type: Types.Html, wysiwyg: true, height: 300},
  facebookLink: {type: Types.Url},
  instagramLink: {type: Types.Url},
  avatar: {
    type: Types.File,
    storage,
  },
})

Participant.schema.pre('validate', function(next) {
  if(this.avatar.url) validateMimeType(this.avatar, 'image', next)
  next()
})

Participant.schema.pre('remove', function(next) {
  storage.removeFile(this.avatar, next)
})

Participant.defaultColumns = 'person, bio'

Participant.register()