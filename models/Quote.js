import keystone from 'keystone';
// var keystone = require('keystone')
var Types = keystone.Field.Types

var storage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: 'public/images/quoteAuthors/',
    publicPath: '/public/images/quoteAuthors/',
  }
});

var Quote = new keystone.List('Quote', {
  map: {name: 'author'},
  singular: 'Quote',
  plural: 'Quotes',
})

Quote.add({
  author: {type: String, required: true},
  text: {type: Types.Html, wysiwyg: true, height: 300},
  authorAvatar: {type: Types.File, storage},
})

Quote.defaultColumns = 'author, text'

Quote.register()