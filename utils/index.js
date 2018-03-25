import keystone from 'keystone'

export const configStorage = path => new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: `public${path}`,
    publicPath: path,
  },
  schema: {
    path: true,
    url: true,
  }
})

export const validateMimeType = (file, desiredType, cb) => {
  const { mimetype } = file
  if(mimetype && !~mimetype.indexOf(desiredType)) {
    storage.removeFile(file, err => err && cb(err))
    return cb(new Error(`File #${i} is not an image!`))
  }
  cb()
}