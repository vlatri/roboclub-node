import keystone from 'keystone'

import { linkValidate, updateChildrenWithRelatedParent } from '../utils'

const { Types } = keystone.Field

const Course = new keystone.List('Course', {
  map: {name: 'title'},
  singular: 'Course',
  plural: 'Courses',
})

Course.add({
  title: {type: String, required: true},
  field: {type: Types.Relationship, ref: 'Coursefield', many: false},
  age: {type: Number, default: 9, required: true},
  price: {type: Number, note: '0 means for free', default: 0, required: true},
  coursePlan: {type: Types.Html, wysiwyg: true},
  leftColumnSubtitle: {type: String},
  leftColumnText: {type: Types.Html, wysiwyg: true},
  rightColumnSubtitle: {type: String},
  rightColumnText: {type: Types.Html, wysiwyg: true},
  applyToCourseLink: {type: Types.Url},
  sections: { type: Types.Relationship, ref: 'Coursesection', many: true },
})

Course.schema.pre('validate', function(next) {
  linkValidate(Course.model, this, 'applyToCourseLink', next)
})

Course.schema.post('validate', function(doc, next) {
  updateChildrenWithRelatedParent(Course.model, keystone.list('Coursesection').model, doc, next)
})

Course.defaultColumns = 'title, field, age'

Course.register()