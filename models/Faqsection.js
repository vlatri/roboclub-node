import keystone from 'keystone'


const { Types } = keystone.Field

const FaqSection = new keystone.List('Faqsection', {
  map: {name: 'subtitle'},
  singular: 'Faqsection',
  plural: 'Faqsections',
})


FaqSection.add({
  subtitle: {type: String, required: true},
  sequenceNumber: {type: Types.Number, default: 0 },
  text: {type: Types.Html, wysiwyg: true},
})

FaqSection.relationship({ ref: 'Faq', refPath: 'sections' })

FaqSection.defaultColumns = 'subtitle'

FaqSection.register()