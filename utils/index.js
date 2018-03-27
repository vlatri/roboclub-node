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

export const isFileReachable = file => !!(file && file.url)

export const setFallback = (model, doc, fileField, fallback, next) =>
  model.update({_id: doc._id}, {$set: {[fileField]: fallback}}, next)

export const isMimetypeValid = (file, desiredMimetype) => file && (~file.mimetype.indexOf(desiredMimetype))

export const removeFile = (storage, file, next) =>
  (file && file.path && file.filename) ?
    storage.removeFile(file, err =>
      next(err || new Error(`File ${file.originalname} was supposed to be an image.`))
    ) :
  next()

export const resizeImage = (file, width, height, next) =>
  (file.path && file.filename) ?
    im(file.path + file.filename)
      .resizeExact(width, height)
      .write(file.path + file.filename, next) :
    next()

export const fileValidate = (model, storage, doc, fieldName, fallback, next, cb) =>
  isFileReachable(doc[fieldName]) ? (
    isMimetypeValid(doc[fieldName], fallback.mimetype.split('/')[0]) ?
      (cb && cb(doc, fieldName, next) || next()) : removeFile(storage, doc[fieldName], next)
    ) :
    setFallback(model, doc, fieldName, fallback, next)

export const linkValidate = (model, doc, fieldName, next) => doc[fieldName].slice(0, 4).toLowerCase() === 'http' ?
    next() :
    model.update({_id: doc._id}, {[fieldName]: `http://${doc[fieldName]}`}, next)