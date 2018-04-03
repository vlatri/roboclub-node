import keystone from 'keystone'

import {
  linkValidate,
  fileValidate,
  updateChildrenWithRelatedParent,
  validateBriefDescLength,
  removeFile,
  resizeImage,
  configStorage
} from '../utils'


const storage = configStorage('/images/courses/')
const maxBriefDescriptionLength = 50
const { Types } = keystone.Field

const Course = new keystone.List('Course', {
  map: {name: 'title'},
  autokey: { path: 'slug', from: 'title', unique: true },
  singular: 'Course',
  plural: 'Courses',
})

Course.add({
  title: {type: String, required: true},
  active: {
    type: Boolean,
    required: true,
    index: true,
    initial: true,
    default: true,
    note: 'Defines whether this course should be listed among the other, or should it be temporarily disabled.'
  },
  field: {type: Types.Relationship, index: true, initial: true, ref: 'Coursefield', many: false},
  age: {type: Number, required: true, initial: true, index: true, default: 0},
  price: {type: Number, note: '0 means for free', required: true, initial: true, index: true, default: 0},
  heroImage: {type: Types.File, storage, note: 'Small square image used on previews. Will be resized to 240x240.', thumb: true},
  briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`, required: true, initial: true, index: true},
  plan: {type: Types.Html, wysiwyg: true, label: 'Course plan'},
  leftColumnSubtitle: {type: String},
  leftColumnText: {type: Types.Html, wysiwyg: true},
  rightColumnSubtitle: {type: String},
  rightColumnText: {type: Types.Html, wysiwyg: true},
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  applyToCourseLink: {type: Types.Url},
  relatedAlbum: {type: Types.Relationship, ref: 'Album', many: false},
  sections: { type: Types.Relationship, ref: 'Coursesection', many: true },
})

Course.schema.pre('validate', async function(next) {
  const {applyToCourseLink, heroImage} = this

  await updateChildrenWithRelatedParent(Course.model, keystone.list('Coursesection').model, this).catch(next)
  await validateBriefDescLength(this.briefDescription || '', maxBriefDescriptionLength).catch(next)

  this.applyToCourseLink = linkValidate(applyToCourseLink)
  this.heroImage =
    await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(resizeImage(heroImage, 240, 240)).catch(next)

  next()
})

Course.schema.pre('remove', function(next) {
  removeFile(storage, this.heroImage).then(next)
})

Course.defaultColumns = 'title, field, age, active'

Course.register()