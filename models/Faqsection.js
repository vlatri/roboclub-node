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
  relatedFaq: {type: String, hidden: true},
})

Faqsection.schema.pre('validate', function(next) {
  keystone.list('Faq').model.findOne({sections: this._id}, {title: true}).exec((err, res) => {
    if(err) return next(err)
    if(!res) return next()
    Faqsection.model.update({_id: this._id}, {relatedFaq: res.title}).exec(next)
  })
})


Faqsection.relationship({ ref: 'Faq', refPath: 'sections' })

Faqsection.defaultColumns = 'subtitle, relatedFaq sequenceNumber|25%'

Faqsection.register()