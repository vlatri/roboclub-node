import keystone from 'keystone'
import moment from 'moment'
import gm from 'gm'


import imagemin  from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'

moment.locale('uk')
const im = gm.subClass({imageMagick: true})


export const configStorage = path => new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: `public${path}`,
    publicPath: path,
  },
  schema: {
    path: true,
    url: true,
    originalname: true,
  }
})


export const formatDate = (date, format) => moment(date).format(format)


export const fixPublishedDate = (post, format) => {
  return {...post.toObject(), publishedDate: formatDate(post.publishedDate, format) }
}


export const isFileReachable = file => !!(file && file.url)


// Will not fire on fallbacks as long as they only have url.
export const fileExists = file => file.path && file.filename


export const setFallback = (model, doc, fileField, fallback) =>
  model.update({_id: doc._id}, {$set: {[fileField]: fallback}}).exec()


export const isMimetypeValid = (file, desiredMimetype) => file && (~file.mimetype.indexOf(desiredMimetype))


export const compressImage = image =>
  new Promise((resolve, reject) =>
    fileExists(image) ?
      imagemin([image.path + image.filename], image.path, {
        plugins: [imageminJpegtran(), imageminPngquant({quality: '65-80'})]
      })
      .then(() => resolve(image))
      .catch(reject)
    : resolve(image)
  )


export const resizeImage = (image, width, height) =>
  new Promise((resolve, reject) =>
    fileExists(image) ?
      im(image.path + image.filename)
        .resize(width, height)
        .write(image.path + image.filename, err => err ? reject(err) : resolve(image)) :
      resolve(image)
  )


export const shrinkImage = (image, maxSize) =>
  new Promise((resolve, reject) =>
    fileExists(image) ?
      im(image.path + image.filename).size((err, size) => {
        if(err) return reject(err)
        if(size.width > maxSize) return resizeImage(image, maxSize, null).then(() => resolve(image))
        resolve(image)
      })
    : resolve(image)
  )
  .then(() => compressImage(image))

export const removeFile = (storage, file, cb) => file.filename && storage.removeFile(file, cb)


export const removeFileAsync = (storage, file) =>
  new Promise((resolve, reject) =>
    removeFile(storage, file, err =>
      err ? reject(err) : resolve()
    )
  )


export const fileValidate = (storage, file, fallback={}) =>
  new Promise((resolve, reject) =>
    isFileReachable(file) ? (
      isMimetypeValid(file, 'image') ?
        resolve(file) :
        fileExists(file) ?
          removeFile(storage, file, err =>
            reject(err || new Error(`File ${file.originalname} was supposed to be an image.`))
          )
        : resolve(fallback)
      )
    : resolve(fallback)
  )


export const filesValidate = (storage, files) =>
  Promise.all(files.map(image => fileValidate(storage, image)))


export const linkValidate = link => link ?
  link.slice(0, 4).toLowerCase() === 'http' ?
    link : `https://${link}`
  : link


export const validateBriefDescLength = (text='', max) =>
  new Promise((resolve, reject) =>
    (text.length <= max) ?
      resolve() :
      reject(new Error(`Brief description is ${text.length - max} characters too long.`))
  )


export const removeObsoleteFile = (storage, oldFile, newFile) =>
  new Promise((resolve, reject) =>
    fileExists(oldFile) && fileExists(newFile) ?
      (newFile.filename !== oldFile.filename ?
        removeFileAsync(storage, oldFile).then(resolve) :
        resolve(newFile)
      ) :
      resolve(newFile)
  )

export const removeObsoleteFiles = (storage, images, oldImages) =>
  new Promise((resolve, reject) => {

    const promises =
      images.map((photo, index) =>
        removeObsoleteFile(storage, oldImages[index], images[index])
      )

    return Promise.all(promises).then(resolve).catch(reject)
  })


export const generateContentFields = (n, schemaType, Types, storage) => {
  let result = { sectionsCount: {type: Number, default: n, required: true, hidden: true} }

  const commonSchemaConstruct = i => ({
    [`${i}_subtitle`]: {type: String, collapse: true, label: `Subtitle ${i}`},
    [`${i}_text`]: {type: Types.Html, wysiwyg: true, height: 300, collapse: true, label: `Text ${i}`},
  })

  const postSchemaConstruct = i => ({
    ...commonSchemaConstruct(i),
    [`${i}_image`]: {type: Types.File, storage, collapse: true, thumb: true, label: `Image ${i}`},
    [`${i}_oldImage`]: {type: Types.File, storage, hidden: true},
  })

  const activitySchemaConstruct = i => ({
    [`${i}_title`]: {type: String, collapse: true, label: `Title ${i}`},
    ...commonSchemaConstruct(i),
  })

  const albumSchemaConstruct = i => ({
    [`${i}_subtitlePhoto`]: {type: String, label: 'Photo title'},
    [`${i}_photo`]: {type: Types.File, storage, thumb: true, label: 'Photo'},
    [`${i}_oldPhoto`]: {type: Types.File, storage, hidden: true},
    [`${i}_subtitleVideo`]: {type: String, label: 'Video title'},
    [`${i}_video`]: {type: Types.Url, label: 'Video'},
  })

  for(let i=1; i <= n; i++) {
    let schema

    if(schemaType === 'post') schema = postSchemaConstruct(i)
    if(schemaType === 'activity') schema = activitySchemaConstruct(i)
    if(schemaType === 'album') schema = albumSchemaConstruct(i)

    result = {...result, ...schema}
  }
  return result
}


export const getSpecificFieldNames = (obj, containedPattern) =>
   Object.keys(obj)
     .filter(key => ~key.indexOf(containedPattern))


export const getSpecificFields = (obj, containedPattern) =>
  getSpecificFieldNames(obj, containedPattern).map(key => obj[key])


export const validateAge = (minAge, maxAge) =>
  new Promise((resolve, reject) => {
    if(minAge > maxAge)
      return reject(new Error('Minimum age is greater than maximum age.'))
    if(maxAge < 0 || minAge < 0)
      return reject(new Error('Age is out of range.'))
    resolve()
  })


export const saveHeroImage = (storage, heroImage) =>
  fileValidate(storage, heroImage, {url: '/images/fallbacks/heroNews.jpg', mimetype: 'image/jpeg'})
    .then(image => resizeImage(image, 240, 240))
    .then(image => compressImage(image))