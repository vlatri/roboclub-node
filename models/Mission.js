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
  titlePosition: {
    type: Types.Select,
    numeric: true,
    required: true,
    default: 0,
    dependsOn: {showTitle: true},
    emptyOption: false,
    options: [
      {value: 0, label: 'Left'},
      {value: 1, label: 'Right'}
    ],
  },
  subtitle: {type: String},
  image: {type: Types.File, storage},
  imagePosition: {
    type: Types.Select,
    numeric: true,
    default: 0,
    emptyOption: false,
    options: [
      {value: 0, label: 'Left'},
      {value: 1, label: 'Right'}
    ],
  },
  leftColumn: {type: Types.Html, wysiwyg: true},
  rightColumn: {type: Types.Html, wysiwyg: true},
})

Mission.schema.pre('validate', function(next) {
  if(this.image.url) validateMimeType(this.image, 'image', next)
  next()
})

// TODO: Check for obsolete files and delete those.
Mission.schema.pre('remove', function(next) {
  storage.removeFile(this.image, next)
})

Mission.defaultColumns = 'title, subtitle'

Mission.register()