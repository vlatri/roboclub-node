import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFile,
  compressImage,
  updateChildrenWithRelatedParent,
  removeObsoleteFile,
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
  heroImage: {type: Types.File, storage, note: 'Small square image used fpr previews. Will be resized to 240x240.', thumb: true},
  oldHeroImage: {type: Types.File, storage, hidden: true},
  text: {type: Types.Html, wysiwyg: true},
  sections: { type: Types.Relationship, ref: 'Albumitem', many: true },
})


Album.schema.pre('validate', async function(next) {
  const {heroImage, oldHeroImage} = this

  await updateChildrenWithRelatedParent(Album.model, keystone.list('Albumitem').model, this).catch(next)

  this.heroImage = await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(resizeImage(heroImage, 240, 240))
    .then(compressImage)
    .catch(next)

  await removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next)
  this.oldHeroImage = heroImage

  next()
})

Album.schema.pre('remove', function(next) {
  removeFile(storage, this.heroImage).then(next)
})


Album.relationship({ ref: 'Course', refPath: 'relatedAlbum' })
Album.defaultColumns = 'title, sections, publishedDate|15%'


Album.register()