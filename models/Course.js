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
  activeSince: {
    type: Types.Date,
    required: true,
    index: true,
    initial: true,
  },
  field: {type: Types.Relationship, index: true, initial: true, ref: 'Coursefield', many: false},
  minimumAge: {type: Number, required: true, initial: true, index: true, default: 0},
  maximumAge: {type: Number, required: true, initial: true, index: true, default: 0},
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

const validateAge = (minAge, maxAge) => new Promise((resolve, reject) => {
  if(minAge > maxAge)
    return reject(new Error('Minimum age is greater than maximum age.'))
  if(maxAge < 0 || minAge < 0)
    return reject(new Error('Age is out of range.'))
  resolve()
})


Course.schema.pre('validate', async function(next) {
  const {minimumAge, maximumAge, applyToCourseLink, heroImage, oldHeroImage, briefDescription} = this

  await validateAge(minimumAge, maximumAge).catch(next)

  await validateBriefDescLength(briefDescription || '', maxBriefDescriptionLength).catch(next)

  this.applyToCourseLink = linkValidate(applyToCourseLink)
  this.heroImage =
    await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(resizeImage(heroImage, 240, 240))
    .then(compressImage)
    .catch(next)

  await removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next)
  this.oldHeroImage = heroImage

  next()
})

Course.schema.pre('remove', async function(next) {
  await removeFileAsync(storage, this.heroImage).catch(next)

  next()
})

Course.defaultColumns = 'title, field, age, active'

Course.register()