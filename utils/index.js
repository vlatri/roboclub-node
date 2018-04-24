import keystone from 'keystone'
import moment from 'moment'
import gm from 'gm'


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


export const resizeImage = (image, width, height) =>
  new Promise((resolve, reject) =>
    fileExists(image) ?
      im(image.path + image.filename)
        .strip()
        .resizeExact(width, height)
        .quality(50)
        .colorspace('RGB')
        .write(image.path + image.filename, err => err ? reject(err) : resolve()) :
      resolve()
  )


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


export const linkValidate = link => link ?
  link.slice(0, 4).toLowerCase() === 'http' ?
    link : `https://${link}`
  : link


export const updateChildWithRelatedParent = (parentModel, childModel, childId) =>
  parentModel.findOne({sections: childId}, {title: true}).exec((err, res) => {
    if(err) return new Error(err)
    if(!res) res = {_id: null, title: null}

    return childModel.update({_id: childId}, {
      relatedParent: {
        _id: res._id,
        title: res.title,
      }
    }).exec()
  })


export const updateChildrenWithRelatedParent = (parentModel, childModel, parent) =>
  // Reset parent for all children which think current parent is related to them
  childModel.update({'relatedParent._id': parent._id},
    {relatedParent: {_id: null, title: null}},
    {multi: true}
  ).exec()
  .then((err, res) =>
    // Set relation for only selected children
    childModel.update({_id: {$in: parent.sections}}, {
      relatedParent: {_id: parent._id, title: parent.title}
    }, {multi: true}
    ).exec()
  )


export const validateBriefDescLength = (text, max) =>
  new Promise((resolve, reject) =>
    (text.length <= max) ?
      resolve() :
      reject(new Error(`Brief description is ${text.length - max} characters too long.`))
  )


export const compressImage = image =>
  new Promise((resolve, reject) =>
    fileExists(image) ?
      im(image.path + image.filename).size((err, size) =>
        (err ?
          reject(err) :
          im(image.path + image.filename)
            .strip() // Remove all meta data (EXIF, commnents, etc)
            .resize(size.width > 1366 ? 1366 : null) // Force resize to 1366*N if the image is wider than 1336px
            .quality(50)
            .colorspace('RGB')
            .write(image.path + image.filename, err => err ? reject(err) : resolve(image))
        )
      ) :
      resolve(image)
  )


export const removeObsoleteFile = (storage, oldFile, newFile) =>
  new Promise((resolve, reject) =>
    fileExists(oldFile) && fileExists(newFile) ?
      (newFile.filename !== oldFile.filename ?
        removeFileAsync(storage, oldFile).then(resolve) :
        resolve()
      ) :
      resolve()
  )

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

  const albumSchemaConstruct = i => {
    let schema = {
      [`${i}_item_subtitle`]: {type: String, label: `${i%2 ? 'Photo' : 'Video'} title`},
    }

    if(i%2)
      schema = {
        ...schema,
        [`${i}_photo`]: {type: Types.File, storage, thumb: true, label: `Photo`},
        [`${i}_oldPhoto`]: {type: Types.File, storage, hidden: true},
      }
    else
      schema = {
        ...schema,
        [`${i}_video`]: {type: Types.Url, label: `Video`},
      }
    return schema
  }

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