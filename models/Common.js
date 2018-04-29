import keystone from 'keystone'

import { linkValidate } from '../utils/'


const { Types } = keystone.Field

const Common = new keystone.List('Common', {
  map: {name: 'title'},
  singular: 'Common Layout',
  plural: 'Common Layouts',
  nocreate: true,
  nodelete: true,
})


Common.add({
  title: {type: String, default: 'Common Layout', noedit: true},
  header: {
    facebookLink: {type: Types.Url},
    instagramLink: {type: Types.Url},
  },
  becomeTeamMemberLink: {type: Types.Url},
  footer: {
    primaryPhoneNumber: {type: String},
    secondaryPhoneNumber: {type: String},
    cityName: {type: String},
    address: {type: String},
    geoLat: {type: String, note: 'Lattitude, used by Gmaps in footer.'},
    geoLng: {type: String, note: 'Longitude, used by Gmaps in footer.'},
  },
})


Common.schema.pre('save', function(next) {
  const { header, becomeTeamMemberLink } = this
  const { facebookLink, instagramLink } = header


  this.header.facebookLink = linkValidate(facebookLink)
  this.header.instagramLink = linkValidate(instagramLink)
  this.becomeTeamMemberLink = linkValidate(becomeTeamMemberLink)

  next()
})


Common.defaultColumns = 'title, footer.primaryPhoneNumber, footer.secondaryPhoneNumber, footer.address'

Common.register()