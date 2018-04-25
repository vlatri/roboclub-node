import keystone from 'keystone'

import {
  linkValidate,
  fileValidate,
  validateBriefDescLength,
  removeFileAsync,
  resizeImage,
  compressImage,
  removeObsoleteFile,
  generateContentFields,
  validateAge,
  configStorage
} from '../'

const { Types } = keystone.Field
const maxBriefDescriptionLength = 50

export const createActivity = (singularListName, pluralListName) => {
  const fieldName = `${singularListName}field`

  const storage = configStorage(`/images/${pluralListName.toLowerCase()}`)

  const List = new keystone.List(singularListName, {
    map: {name: 'title'},
    autokey: { path: 'slug', from: 'title', unique: true },
    singular: singularListName,
    plural: pluralListName,
  })

  List.add({
    title: {type: String, required: true},
    activeSince: {
      type: Types.Date,
      required: true,
      index: true,
      initial: true,
    },
    field: {type: Types.Relationship, index: true, initial: true, ref: 'Activityfield', many: false},
    minimumAge: {type: Number, required: true, initial: true, index: true, default: 0},
    maximumAge: {type: Number, required: true, initial: true, index: true, default: 0},
    heroImage: {type: Types.File, storage, note: 'Small square image used on previews. Please, respect 1:1 ratio.', thumb: true},
    oldHeroImage: {type: Types.File, storage, hidden: true},
    briefDescription: {type: String, note: `${maxBriefDescriptionLength} characters max.`, required: true, initial: true, index: true},
    mainTitle: {type: String},
    mainText: {type: Types.Html, wysiwyg: true},
    leftColumnSubtitle: {type: String},
    leftColumnText: {type: Types.Html, wysiwyg: true},
    rightColumnSubtitle: {type: String},
    rightColumnText: {type: Types.Html, wysiwyg: true},
    relatedAlbum: {type: Types.Relationship, ref: 'Album', many: false},
    maxBriefDescriptionLength: {type: Number, hidden: true, default: maxBriefDescriptionLength, required: true},
    applyLink: {type: Types.Url},
    content: generateContentFields(24, 'activity', Types, storage),
  })

  List.schema.pre('validate', async function(next) {
    const {minimumAge, maximumAge, applyLink, heroImage, oldHeroImage, briefDescription} = this

    await validateAge(minimumAge, maximumAge).catch(next)

    await validateBriefDescLength(briefDescription || '', maxBriefDescriptionLength).catch(next)

    this.applyLink = linkValidate(applyLink)
    this.heroImage =
      await fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
      .then(resizeImage(heroImage, 240, 240))
      .then(compressImage)
      .catch(next)

    await removeObsoleteFile(storage, oldHeroImage, heroImage).catch(next)
    this.oldHeroImage = heroImage

    next()
  })

  List.schema.pre('remove', function(next) {
    removeFileAsync(storage, this.heroImage)
    next()
  })

  List.defaultColumns = 'title, field, minimumAge, activeSince'
  List.register()

}