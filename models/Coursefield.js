import keystone from 'keystone'


const { Types } = keystone.Field

const Coursefield = new keystone.List('Coursefield', {
  map: {name: 'title'},
  singular: 'Course field',
  plural: 'Course fields',
  label: 'Course fields',
})


Coursefield.add({
  title: {type: String, required: true},
})

Coursefield.relationship({ ref: 'Course', refPath: 'field' })

Coursefield.defaultColumns = 'title'

Coursefield.register()