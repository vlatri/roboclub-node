import keystone from 'keystone'

import { formatDate } from '../../utils'
import routeFactory from '../../utils/activitiesFactory/routes'


const carriedFactory = (title, listName, path, section) =>
  routeFactory(keystone, formatDate)(title, listName, path, section)

exports = module.exports = {
  courses: carriedFactory('Курси', 'Course', 'course', 'studying'),
  events: carriedFactory('Події', 'Event', 'event', 'studying'),
  renting: carriedFactory('Оренда', 'Renting', 'renting', 'studying'),
//   camps: carriedFactory('Кемпи', 'Camp', 'camp', 'studying'),
//   projects: carriedFactory('Проекти', 'Project', 'project', 'about'),
//   products: carriedFactory('Продукти', 'Product', 'product', 'about'),
}