import keystone from 'keystone'


const { Types } = keystone.Field

const Donation = new keystone.List('Donation', {
  map: {name: 'title'},
  singular: 'Donation',
  plural: 'Donation',
  nocreate: true,
  nodelete: true,
})


Donation.add({
  title: {type: String, required: true},
  text: {type: Types.Html, wysiwyg: true},
  putAfterMission: {type: Number, default: 1, required: true},
})


Donation.defaultColumns = 'title, text'

Donation.register()