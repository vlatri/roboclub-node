import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFileAsync,
  compressImage,
  removeObsoleteFile,
  generateContentFields,
  getSpecificFields,
  getSpecificFieldNames,
} from '../utils/'


const storage = configStorage('/images/albums/')
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
  content: generateContentFields(100, 'album', Types, storage)
})


Album.schema.pre('validate', async function(next) {
  const {heroImage, oldHeroImage} = this

  this.heroImage = await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(resizeImage(heroImage, 240, 240))
    .then(compressImage)
    .catch(next)


  const photos = getSpecificFields(this.content, 'photo')
  const oldPhotos = getSpecificFields(this.content, 'oldPhoto')

  const pendingPromises = [
    removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next),
    ...photos.map(photo => fileValidate(storage, photo)),
    ...photos.map((photo, index) => removeObsoleteFile(storage, oldPhotos[index], photos[index])),
  ]

  await Promise.all(pendingPromises)
  .then(() => {
    this.oldHeroImage = heroImage

    getSpecificFieldNames(this.content, 'photo')
    .map(fieldName => this.content[fieldName.replace('photo', 'oldPhoto')] = this.content[fieldName])
  })
  .catch(next)

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