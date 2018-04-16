import keystone from 'keystone'

import {
  linkValidate,
  fileValidate,
  updateChildrenWithRelatedParent,
  validateBriefDescLength,
  removeFileAsync,
  resizeImage,
  compressImage,
  configStorage,
  removeObsoleteFile,
  getSpecificFields,
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

export const generateContentFields = n => {
  // FP
  let result = { sectionsCount: {type: Number, default: n, required: true, hidden: true} }
  for(let i=1; i <= n; i++) {
    result = {...result,
      [`${i}_title`]: {type: String, collapse: true, label: `Title ${i}`},
      [`${i}_subtitle`]: {type: String, collapse: true, label: `Subtitle ${i}`},
      [`${i}_text`]: {type: Types.Html, wysiwyg: true, height: 300, collapse: true, label: `Text ${i}`},
    }
  }
  return result
}

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
  oldHeroImage: {type: Types.File, storage, hidden: true},
  briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`, required: true, initial: true, index: true},
  plan: {type: Types.Html, wysiwyg: true, label: 'Course plan'},
  leftColumnSubtitle: {type: String},
  leftColumnText: {type: Types.Html, wysiwyg: true},
  rightColumnSubtitle: {type: String},
  rightColumnText: {type: Types.Html, wysiwyg: true},
  relatedAlbum: {type: Types.Relationship, ref: 'Album', many: false},
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  applyToCourseLink: {type: Types.Url},
  content: generateContentFields(24),
})

Course.schema.pre('validate', async function(next) {
  const {applyToCourseLink, heroImage, oldHeroImage, briefDescription} = this

  await validateBriefDescLength(briefDescription || '', maxBriefDescriptionLength).catch(next)

  this.applyToCourseLink = linkValidate(applyToCourseLink)
  this.heroImage =
    await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(resizeImage(heroImage, 240, 240))
    .then(compressImage)
    .catch(next)



  const currentImages = getSpecificFields(this.content, 'image')
  const oldImages = getSpecificFields(this.content, 'oldImage')

  await removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next)
  this.oldHeroImage = heroImage

  next()
})

Course.schema.pre('remove', function(next) {
  removeFileAsync(storage, this.heroImage).then(next)
})

Course.defaultColumns = 'title, field, age, active'

Course.register()