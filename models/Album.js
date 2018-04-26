import keystone from 'keystone'

import {
  configStorage,
  filesValidate,
  removeFileAsync,
  saveHeroImage,
  removeObsoleteFile,
  removeObsoleteFiles,
  generateContentFields,
  getSpecificFields,
  getSpecificFieldNames,
  validateBriefDescLength
} from '../utils/'


const storage = configStorage('/images/albums/')
const maxBriefDescriptionLength = 50
const { Types } = keystone.Field

const Album = new keystone.List('Album', {
  map: {name: 'title'},
  autokey: { path: 'slug', from: 'title', unique: true },
  singular: 'Album',
  plural: 'Albums',
})


Album.add({
  title: {type: String, required: true},
  publishedDate: { type: Types.Date, index: true},
  heroImage: {type: Types.File, storage, note: 'Small square image used for previews. Please preserve 1:1 ratio.', thumb: true},
  oldHeroImage: {type: Types.File, storage, hidden: true},
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  content: generateContentFields(50, 'album', Types, storage)
})


Album.schema.pre('validate', async function(next) {
  const {heroImage, oldHeroImage, title, content} = this

  const photos = getSpecificFields(content, 'photo')
  const oldPhotos = getSpecificFields(content, 'oldPhoto')
  const oldPhotosFieldNames = getSpecificFieldNames(content, 'oldPhoto')

  await validateBriefDescLength(title, maxBriefDescriptionLength).catch(next)

  this.heroImage = await saveHeroImage(storage, heroImage).catch(next)
  this.oldHeroImage = await removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next)

  await filesValidate(storage, photos).catch(next)
  const approvedImages = await removeObsoleteFiles(storage, photos, oldPhotos).catch(next)

  oldPhotosFieldNames.map((fieldName, index) =>
    this.content[fieldName] = approvedImages[index]
  )

  next()
})

Album.schema.pre('remove', function(next) {
  removeFileAsync(storage, this.heroImage).catch(next)

  const photos = getSpecificFields(this.content, 'photo')

  // No need to catch errors from this promise as long as most of them are ENOENT
  photos.map(photo => removeFileAsync(storage, photo))

  next()
})


Album.relationship = { ref: 'Course', refPath: 'relatedAlbum' }
Album.relationship = { ref: 'Camp', refPath: 'relatedAlbum' }
Album.relationship = { ref: 'Event', refPath: 'relatedAlbum' }

Album.defaultColumns = 'title, publishedDate|15%'


Album.register()