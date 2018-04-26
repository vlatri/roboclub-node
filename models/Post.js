import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFileAsync,
  validateBriefDescLength,
  removeObsoleteFile,
  getSpecificFields,
  getSpecificFieldNames,
  generateContentFields,
} from '../utils/'


const storage = configStorage('/images/posts/')
const maxBriefDescriptionLength = 50
const { Types } = keystone.Field


const Post = new keystone.List('Post', {
  map: {name: 'title'},
  autokey: { path: 'slug', from: 'title', unique: true },
  singular: 'Post',
  plural: 'Posts',
})


Post.add({
  title: {type: String, required: true},
  author: {type: String, index: true, required: true, initial: true,},
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true, initial: true, },
  publishedDate: { type: Types.Date, index: true, initial: true, dependsOn: { state: 'published' } },
  coverImage: {type: Types.File, storage, thumb: true},
  oldCoverImage: {type: Types.File, storage, hidden: true},
  heroImage: {type: Types.File, initial: true, storage, note: 'Small square image used on previews. Please preserve 1:1 ratio.', thumb: true},
  oldHeroImage: {type: Types.File, storage, hidden: true},
  briefDescription: {
    type: String,
    required: true,
    index: true,
    initial: true,
    default: '',
    note: `${maxBriefDescriptionLength} characters max.`,
  },
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  content: generateContentFields(24, 'post', Types, storage),
})


Post.schema.pre('validate', async function(next) {
  const { heroImage, coverImage, oldCoverImage, oldHeroImage, briefDescription } = this

  this.coverImage = await fileValidate(storage, coverImage).catch(next)
  this.heroImage =
    await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
      .then(resizeImage(heroImage, 240, 240))
      .catch(next)

  const currentImages = getSpecificFields(this.content, 'image')
  const oldImages = getSpecificFields(this.content, 'oldImage')

  const pendingPromises = [
    removeObsoleteFile(storage, oldCoverImage, coverImage),
    removeObsoleteFile(storage, oldHeroImage, heroImage),
    ...currentImages.map(image => fileValidate(storage, image)),
    ...currentImages.map((image, index) => removeObsoleteFile(storage, oldImages[index], currentImages[index])),
  ]

  await Promise.all(pendingPromises)
  .then(() => {
    this.oldCoverImage = coverImage
    this.oldHeroImage = heroImage

     getSpecificFieldNames(this.content, 'image')
    .map(fieldName => this.content[fieldName.replace('image', 'oldImage')] = this.content[fieldName])

  })
  .catch(next)

  await validateBriefDescLength(briefDescription, maxBriefDescriptionLength).catch(next)

  next()
})

Post.schema.pre('remove', function(next) {
  removeFileAsync(storage, this.heroImage)

  const images = getSpecificFields(this.content, 'image')

  // No need to catch errors from this promise as long as most of them are ENOENT
  images.map(image => removeFileAsync(storage, image))


  next()
})


Post.defaultColumns = 'title, author|10%, state|10%, publishedDate|15%'

Post.register()