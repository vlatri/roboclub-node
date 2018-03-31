import keystone from 'keystone'

import { saveRelatedParent } from '../utils'


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
  relatedParent: {type: String, hidden: true, label: 'Related FAQ'},
})

Faqsection.schema.pre('validate', function(next) {
  saveRelatedParent(keystone.list('Faq').model, Faqsection.model, this._id, next)
})


Faqsection.relationship({ ref: 'Faq', refPath: 'sections' })

Faqsection.defaultColumns = 'subtitle, relatedParent sequenceNumber|25%'

Faqsection.register()