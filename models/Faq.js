import keystone from 'keystone'


const { Types } = keystone.Field

const Faq = new keystone.List('Faq', {
  map: {name: 'title'},
  singular: 'Faq',
  plural: 'Faqs',
})

const generateContentFields = n => {
  let result = {
    sectionsCount: {type: Number, default: n, required: true, hidden: true}
  }
  for(let i=1; i <= n; i++) {
    result = {...result,
      [`${i}_subtitle`]: {type: String, collapse: true, label: `Subtitle ${i}`},
      [`${i}_text`]: {type: Types.Html, wysiwyg: true, height: 300, collapse: true, label: `Text ${i}`},
    }
  }
  return result
}


Faq.add({
  title: {type: String, required: true},
  content: generateContentFields(12),
})


Faq.defaultColumns = 'title, subtitle'

Faq.register()