import keystone from 'keystone'

import { updateChildWithRelatedParent } from '../utils'


const { Types } = keystone.Field

const Coursesection = new keystone.List('Coursesection', {
  map: {name: 'title'},
  singular: 'Course section',
  plural: 'Course sections',
  label: 'Course sections',
})


Coursesection.add({
  title: {type: String, required: true},
  sequenceNumber: {type: Types.Number, default: 0 },
  fancyTitlebar: {type: Boolean, default: true, note: 'Whether or not display large blue strip with the title on it or a simple subtitle.'},
  text: {type: Types.Html, wysiwyg: true},
  relatedParent: {
    _id: {type: String, hidden: true},
    title: {type: String, hidden: true, label: 'Related Course'},
  },
})

Coursesection.schema.pre('validate', function(next) {
  updateChildWithRelatedParent(keystone.list('Course').model, Coursesection.model, this._id).then(next)
})

Coursesection.relationship({ ref: 'Course', refPath: 'sections' })

Coursesection.defaultColumns = 'title, relatedParent.title, sequenceNumber|25%'

Coursesection.register()