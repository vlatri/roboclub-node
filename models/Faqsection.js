import keystone from 'keystone'


const { Types } = keystone.Field

const Faqsection = new keystone.List('Faqsection', {
  map: {name: 'subtitle'},
  singular: 'Faqsection',
  plural: 'Faqsections',
})


Faqsection.add({
  subtitle: {type: String, required: true},
  sequenceNumber: {type: Types.Number, default: 0 },
  text: {type: Types.Html, wysiwyg: true},
  relatedParent: {
    _id: {type: String, hidden: true},
    title: {type: String, hidden: true, label: 'Related FAQ'},
  },
})


Faqsection.relationship({ ref: 'Faq', refPath: 'sections' })

Faqsection.defaultColumns = 'subtitle, relatedParent.title sequenceNumber|25%'

Faqsection.register()
