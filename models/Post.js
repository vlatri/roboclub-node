import keystone from 'keystone'

import {
  configStorage,
  fileValidate,
  resizeImage,
  removeFile,
  updateChildrenWithRelatedParent,
  validateBriefDescLength,
  removeObsoleteFile,
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
  author: {type: String},
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  coverImage: {type: Types.File, storage, thumb: true},
  oldCoverImage: {type: Types.File, storage, hidden: true},
  heroImage: {type: Types.File, storage, note: 'Small square image used on previews. Will be resized to 240x240.', thumb: true},
  oldHeroImage: {type: Types.File, storage, hidden: true},
  briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`},
  maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
  sections: { type: Types.Relationship, ref: 'Postsection', many: true },
})



Post.schema.pre('validate', async function(next) {
  const { heroImage, coverImage, oldCoverImage, oldHeroImage, briefDescription } = this

  await updateChildrenWithRelatedParent(Post.model, keystone.list('Postsection').model, this).catch(next)

  this.coverImage =
    await fileValidate(storage, coverImage, {url: '/images/fallbacks/homeCover.jpg', mimetype: 'image/jpeg'})
      .catch(next)
  this.heroImage =
    await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
      .then(resizeImage(heroImage, 240, 240))
      .catch(next)

  Promise.all([
    removeObsoleteFile(storage, oldCoverImage, coverImage),
    removeObsoleteFile(storage, oldHeroImage, heroImage)
  ])
  .then(() => {
    this.oldCoverImage = coverImage
    this.oldHeroImage = heroImage
  })
  .catch(next)

  await validateBriefDescLength(briefDescription || '', maxBriefDescriptionLength).catch(next)

  next()
})

Post.schema.pre('remove', function(next) {
  removeFile(storage, this.heroImage).then(next)
})


Post.defaultColumns = 'title, sections, author|10%, state|10%, publishedDate|15%'

Post.register()