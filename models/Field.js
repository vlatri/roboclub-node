import keystone from 'keystone'

const Field = new keystone.List('Activityfield', {
  map: {name: 'title'},
  singular: `Activityfield`,
  plural: `Activityfields`,
  label: `Activity Fields`,
})

Field.add({ title: {type: String, required: true, initial: true} })

Field.relationship = { ref: 'Course', refPath: 'field' }
Field.relationship = { ref: 'Event', refPath: 'field' }
Field.relationship = { ref: 'Camp', refPath: 'field' }
Field.defaultColumns = 'title'

Field.register()
