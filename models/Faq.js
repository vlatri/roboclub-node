import keystone from 'keystone'


const { Types } = keystone.Field

const Faq = new keystone.List('Faq', {
  map: {name: 'title'},
  singular: 'Faq',
  plural: 'Faqs',
})

Faq.add({
  title: {type: String, required: true},
  sequenceNumber: {type: Types.Number, default: 0 },
  sections: { type: Types.Relationship, ref: 'Faqsection', many: true },
})

Faq.schema.pre('validate', function(next) {
  updateChildrenWithRelatedParent(Faq.model, keystone.list('Faqection').model, this).catch(next)
})


Faq.defaultColumns = 'title, sections, sequenceNumber|25%'

Faq.register()