import keystone from 'keystone'

import { configStorage, validateMimeType } from '../utils/'


const { Types } = keystone.Field

const storage = configStorage('/images/missions/')

const Mission = new keystone.List('Mission', {
  map: {name: 'title'},
  singular: 'Mission',
  plural: 'Missions',
})

Mission.add({
  title: {type: String},
  showTitle: {type: Boolean},
  subtitle: {type: String},
  image: {type: Types.File, storage},
  leftColumn: {type: Types.Html, wysiwyg: true},
  rightColumn: {type: Types.Html, wysiwyg: true},
})

Mission.schema.pre('validate', function(next) {
  let { image } = this

  image = image || {url: '/images/fallbacks/mission.jpg', mimetype: 'image/jpeg'}
  validateMimeType(image, 'image', next)

  next()
})

// TODO: Check for obsolete files and delete those.
Mission.schema.pre('remove', function(next) {
  storage.removeFile(this.authorAvatar, next)
})

Mission.defaultColumns = 'title, subtitle'

Mission.register()