!function(e){var t={};function i(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=e,i.c=t,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:a})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.w={},i(i.s=50)}([function(e,t){e.exports=require("keystone")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.removeObsoleteFile=t.compressImage=t.validateBriefDescLength=t.updateChildrenWithRelatedParent=t.updateChildWithRelatedParent=t.linkValidate=t.fileValidate=t.removeFileAsync=t.removeFile=t.resizeImage=t.isMimetypeValid=t.setFallback=t.fileExists=t.isFileReachable=t.fixPublishedDate=t.configStorage=void 0;var a=o(i(46)),r=o(i(45)),n=o(i(0)),s=o(i(44)),l=o(i(43));function o(e){return e&&e.__esModule?e:{default:e}}s.default.locale("uk");var u=l.default.subClass({imageMagick:!0}),d=(t.configStorage=function(e){return new n.default.Storage({adapter:n.default.Storage.Adapters.FS,fs:{path:"public"+e,publicPath:e},schema:{path:!0,url:!0,originalname:!0}})},t.fixPublishedDate=function(e,t){return(0,r.default)({},e.toObject(),{publishedDate:(0,s.default)(e.publishedDate).format(t)})},t.isFileReachable=function(e){return!(!e||!e.url)}),c=t.fileExists=function(e){return e.path&&e.filename},f=(t.setFallback=function(e,t,i,r){return e.update({_id:t._id},{$set:(0,a.default)({},i,r)}).exec()},t.isMimetypeValid=function(e,t){return e&&~e.mimetype.indexOf(t)}),p=(t.resizeImage=function(e,t,i){return new Promise(function(a,r){return c(e)?u(e.path+e.filename).strip().resizeExact(t,i).quality(50).colorspace("RGB").write(e.path+e.filename,function(e){return e?r(e):a()}):a()})},t.removeFile=function(e,t,i){return e.removeFile(t,i)}),m=t.removeFileAsync=function(e,t){return new Promise(function(i,a){return p(e,t,function(e){return e?a(e):i()})})};t.fileValidate=function(e,t,i){return new Promise(function(a,r){return d(t)?f(t,i.mimetype.split("/")[0])?a(t):c(t)?p(e,t,function(e){return r(e||new Error("File "+t.originalname+" was supposed to be an image."))}):a(i):a(i)})},t.linkValidate=function(e){return e?"http"===e.slice(0,4).toLowerCase()?e:"https://"+e:e},t.updateChildWithRelatedParent=function(e,t,i){return e.findOne({sections:i},{title:!0}).exec(function(e,a){return e?new Error(e):(a||(a={_id:null,title:null}),t.update({_id:i},{relatedParent:{_id:a._id,title:a.title}}).exec())})},t.updateChildrenWithRelatedParent=function(e,t,i){return t.update({"relatedParent._id":i._id},{relatedParent:{_id:null,title:null}},{multi:!0}).exec().then(function(e,a){return t.update({_id:{$in:i.sections}},{relatedParent:{_id:i._id,title:i.title}},{multi:!0}).exec()})},t.validateBriefDescLength=function(e,t){return new Promise(function(i,a){return e.length<t?i():a(new Error("Brief description is "+(e.length-t)+" characters too long."))})},t.compressImage=function(e){return new Promise(function(t,i){return c(e)?u(e.path+e.filename).size(function(a,r){return a?i(a):u(e.path+e.filename).strip().resize(r.width>1366?1366:null).quality(50).colorspace("RGB").write(e.path+e.filename,function(a){return a?i(a):t(e)})}):t(e)})},t.removeObsoleteFile=function(e,t,i){return new Promise(function(a,r){return c(t)&&c(i)?i.filename!==t.filename&&m(e,t).then(a):a()})}},function(e,t){e.exports=require("babel-runtime/helpers/asyncToGenerator")},function(e,t){e.exports=require("babel-runtime/regenerator")},function(e,t){e.exports=require("lodash")},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Команда",a.section="about",i.on("init",function(e){n.default.list("Participant").model.find().exec(function(t,i){a.team=i,e(t)})}),i.render("team")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Презентації",a.section="about",i.on("init",function(e){n.default.list("Presentation").model.find().exec(function(t,i){a.presentations=i,e()})}),i.render("presentations")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Новини",a.section="posts",i.on("init",function(e){n.default.list("Post").model.find().where("state","published").select({heading:1,briefDescription:1,heroImage:1,publishedDate:1,slug:1}).sort("-publishedDate").exec(function(t,i){a.posts=i?i.map(function(e){return(0,s.fixPublishedDate)(e,"DD/MM/YYYY")}):[],e(t)})}),i.render("posts")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.section="posts",a.filters={post:e.params.post},i.on("init",function(e){n.default.list("Post").model.findOne({state:"published",slug:a.filters.post}).populate({path:"sections",options:{sort:{sequenceNumber:1}}}).exec(function(i,r){a.title=r.title,a.post=r?(0,s.fixPublishedDate)(r,"DD/MM/YYYY"):t.redirect("/404"),e(i)})}),i.on("init",function(t){n.default.list("Post").model.find({slug:{$ne:e.params.post}}).where("state","published").select({heading:1,briefDescription:1,heroImage:1,publishedDate:1,slug:1}).sort("-publishedDate").limit(4).exec(function(e,i){a.posts=i?i.map(function(e){return(0,s.fixPublishedDate)(e,"DD/MM/YYYY")}):[],t(e)})}),i.render("post")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Партнери",a.section="about",i.on("init",function(e){n.default.list("Partner").model.find().exec(function(t,i){a.partners=i,e(t)})}),i.render("partners")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Місія",a.section="about",i.query("donation",n.default.list("Donation").model.findOne()),i.on("init",function(e){n.default.list("Mission").model.find().exec(function(t,i){a.missions=i,e(t)})}),i.render("mission")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.section="home",i.query("quotes",n.default.list("Quote").model.find()),i.query("layout",n.default.list("Layout").model.findOne()),i.query("partners",n.default.list("Partner").model.find()),i.on("init",function(e){n.default.list("Post").model.find().where("state","published").select({heading:1,briefDescription:1,heroImage:1,publishedDate:1,slug:1}).sort("-publishedDate").limit(4).exec(function(t,i){a.posts=i?i.map(function(e){return(0,s.fixPublishedDate)(e,"DD MMMM YYYY")}):[],e(t)})}),i.render("index")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Відгуки",a.section="about",i.render("feedback")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="FAQ",a.sections="about",i.query("faqs",n.default.list("Faq").model.find().populate({path:"sections",options:{sort:{sequenceNumber:1}}}).sort({sequenceNumber:1})),i.render("faq")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t);t.locals.section="500",t.status(500),i.render("errors/500")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t);t.locals.section="404",t.status(404),i.render("errors/404")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Курси",a.section="courses",i.query("courseFields",n.default.list("Coursefield").model.find()),i.query("courses",n.default.list("Course").model.find()),i.on("init",function(e){n.default.list("Course").model.find({active:!0}).distinct("age").exec(function(t,i){a.courseAges=i.sort(function(e,t){return e>t}),e(t)})}),i.render("courses")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.section="courses",a.filters={course:e.params.course},i.on("init",function(e){n.default.list("Course").model.findOne({active:!0,slug:a.filters.course}).populate({path:"relatedAlbum",populate:{path:"sections"}}).populate({path:"sections",options:{sort:{sequenceNumber:1}}}).exec(function(t,i){a.course=i,e(t)})}),i.on("init",function(t){n.default.list("Course").model.find({slug:{$ne:e.params.post},active:!0}).select({title:1,briefDescription:1,heroImage:1,slug:1,age:1}).limit(4).exec(function(e,i){a.title=i.title,a.courses=i,t(e)})}),i.render("course")}},function(e,t,i){"use strict";var a=i(0),r=a.list("Enquiry");e.exports=function(e,t){var i=new a.View(e,t);t.locals.section="contact";var n=e.body,s=n.name,l=n.phone,o=n.email,u=n.subject,d=n.message;r.model.create({name:s,phone:l,email:o,subject:u,message:d}).then(function(){return i.render("contact")}).catch(function(e){return console.log(e)})}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.title="Галерея",a.section="albums",i.on("init",function(e){n.default.list("Album").model.find({},{title:1,heroImage:1,publishedDate:1,slug:1}).sort("-publishedDate").exec(function(t,i){a.albums=i?i.map(function(e,t){return(0,s.fixPublishedDate)(e,"DD/MM/YYYY")}):[],e(t)})}),i.render("albums")}},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);e.exports=function(e,t){var i=new n.default.View(e,t),a=t.locals;a.section="albums",a.filters={album:e.params.album},i.on("init",function(e){n.default.list("Album").model.findOne({slug:a.filters.album}).populate("sections").exec(function(i,r){r?(a.title=r.title,a.album=(0,s.fixPublishedDate)(r,"DD/MM/YYYY")):t.redirect("/404"),e(i)})}),i.on("init",function(t){n.default.list("Album").model.find({slug:{$ne:e.params.album}}).select({title:1,heroImage:1,publishedDate:1,slug:1}).sort("-publishedDate").limit(4).exec(function(e,i){a.albums=i?i.map(function(e){return(0,s.fixPublishedDate)(e,"DD/MM/YYYY")}):[],t(e)})}),i.render("album")}},function(e,t,i){var a={"./album.js":20,"./albums.js":19,"./contact.js":18,"./course.js":17,"./courses.js":16,"./errors/404.js":15,"./errors/500.js":14,"./faq.js":13,"./feedback.js":12,"./home.js":11,"./mission.js":10,"./partners.js":9,"./post.js":8,"./posts.js":7,"./presentations.js":6,"./team.js":5};function r(e){var t=n(e);return i(t)}function n(e){var t=a[e];if(!(t+1)){var i=new Error('Cannot find module "'+e+'".');throw i.code="MODULE_NOT_FOUND",i}return t}r.keys=function(){return Object.keys(a)},r.resolve=n,e.exports=r,r.id=21},function(e,t){e.exports=require("webpack-requiredir")},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.flashMessages=t.initLocals=void 0;var a=n(i(0)),r=n(i(4));function n(e){return e&&e.__esModule?e:{default:e}}t.initLocals=function(e,t,i){t.locals.navLinks=[{label:"Головна",key:"home",href:"/"},{label:"Про нас",key:"about",href:"/team",pages:[{label:"Команда",key:"team",href:"/team"},{label:"Місія",key:"mission",href:"/mission"},{label:"Презентації",key:"presentations",href:"/presentations"},{label:"Партнери",key:"partners",href:"/partners"},{label:"Відгуки",key:"feedback",href:"/feedback"},{label:"FAQ",key:"faq",href:"/faq"}]},{label:"Курси",key:"courses",href:"courses"},{label:"Новини",key:"posts",href:"/posts"},{label:"Галерея",key:"albums",href:"/albums"},{label:"Контакти",key:"contacts",href:""}],t.locals.user=e.user,a.default.list("Common").model.findOne({},{_id:!1}).exec().then(function(e){t.locals.commonLayout=e,i()}).catch(i)},t.flashMessages=function(e,t,i){var a={info:e.flash("info"),success:e.flash("success"),warning:e.flash("warning"),error:e.flash("error")};t.locals.messages=!!r.default.some(a,function(e){return e.length})&&a,i()};t.requireUser=function(e,t,i){if(e.user)return i();e.flash("error","Please sign in to access this page."),t.redirect("/keystone/signin")}},function(e,t,i){"use strict";(function(t){var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};var s=i(23),l=i(22),o="production"===n.default.get("env")?l(i(21)):n.default.importer(t)("./views");n.default.pre("routes",s.initLocals),n.default.pre("render",s.flashMessages);var u={views:o};e.exports=function(e){e.get("/",u.views.home),e.get("/posts",u.views.posts),e.get("/post/:post",u.views.post),e.get("/team",u.views.team),e.get("/mission",u.views.mission),e.get("/presentations",u.views.presentations),e.get("/partners",u.views.partners),e.get("/feedback",u.views.feedback),e.get("/faq",u.views.faq),e.get("/courses",u.views.courses),e.get("/course/:course",u.views.course),e.get("/albums",u.views.albums),e.get("/album/:album",u.views.album),e.post("/contact",u.views.contact),e.get("/500",u.views.errors[500]),e.all("*",u.views.errors[404])}}).call(this,"/")},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};var s=n.default.Field.Types,l=new n.default.List("User");l.add({name:{type:s.Name,required:!0,index:!0},email:{type:s.Email,initial:!0,required:!0,unique:!0,index:!0},password:{type:s.Password,initial:!0,required:!0}},"Permissions",{isAdmin:{type:Boolean,label:"Can access Keystone",index:!0}}),l.schema.virtual("canAccessKeystone").get(function(){return this.isAdmin}),l.relationship({ref:"Post",path:"posts",refPath:"author"}),l.defaultColumns="name, email, isAdmin",l.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=n.default.Field.Types,d=(0,s.configStorage)("/images/quotesAuthors/"),c=new n.default.List("Quote",{map:{name:"author"},singular:"Quote",plural:"Quotes"});c.add({author:{type:String,required:!0},text:{type:u.Html,wysiwyg:!0,height:300},authorAvatar:{type:u.File,storage:d,note:"Will be resized to 64x64",thumb:!0},oldAuthorAvatar:{type:u.File,storage:d,hidden:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.authorAvatar,r=this.oldAuthorAvatar,e.next=3,(0,s.fileValidate)(d,i,{url:"/images/fallbacks/quotesAuthors.png",mimetype:"image/png"}).then((0,s.resizeImage)(i,64,64)).catch(t);case 3:return this.authorAvatar=e.sent,e.next=6,(0,s.removeObsoleteFile)(d,r,i);case 6:this.oldAuthorAvatar=i,t();case 8:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(d,this.coverImage,e)}),c.defaultColumns="author|20%, text",c.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);var l=n.default.Field.Types,o=new n.default.List("Presentation",{map:{name:"title"},singular:"Presentation",plural:"Presentations"});o.add({title:{type:String},text:{type:l.Html,wysiwyg:!0},viewLink:{type:l.Url},downloadLink:{type:l.Url}}),o.schema.pre("save",function(e){this.viewLink=(0,s.linkValidate)(this.viewLink),this.downloadLink=(0,s.linkValidate)(this.downloadLink),e()}),o.defaultColumns="title, text",o.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=(0,s.configStorage)("/images/posts/"),d=n.default.Field.Types,c=new n.default.List("Postsection",{map:{name:"subtitle"},singular:"Postsection",plural:"Postsections"});c.add({subtitle:{type:String},showSubtitle:{type:Boolean,default:!0},sequenceNumber:{type:d.Number,default:0},text:{type:d.Html,wysiwyg:!0,height:300},image:{type:d.File,storage:u,thumb:!0},oldImage:{type:d.File,storage:u,hidden:!0},relatedPost:{type:String,hidden:!0}}),c.schema.pre("save",(o=(0,r.default)(a.default.mark(function e(t){var i,r,l;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.image,r=this.oldImage,l=this._id,e.next=3,(0,s.updateChildWithRelatedParent)(n.default.list("Post").model,c.model,l).catch(t);case 3:if(!i.filename){e.next=9;break}return e.next=6,(0,s.fileValidate)(u,i,{mimetype:"image/jpeg"}).catch(t);case 6:e.t0=e.sent,e.next=10;break;case 9:e.t0={};case 10:return this.image=e.t0,e.next=13,(0,s.removeObsoleteFile)(u,r,i);case 13:this.oldImage=i,t();case 15:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(u,this.image,e)}),c.relationship({ref:"Post",refPath:"sections"}),c.defaultColumns="subtitle, relatedPost, sequenceNumber|20%",c.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=(0,s.configStorage)("/images/posts/"),d=n.default.Field.Types,c=new n.default.List("Post",{map:{name:"title"},autokey:{path:"slug",from:"title",unique:!0},singular:"Post",plural:"Posts"});c.add({title:{type:String,required:!0},author:{type:String},state:{type:d.Select,options:"draft, published, archived",default:"draft",index:!0},publishedDate:{type:d.Date,index:!0,dependsOn:{state:"published"}},coverImage:{type:d.File,storage:u,thumb:!0},oldCoverImage:{type:d.File,storage:u,hidden:!0},heroImage:{type:d.File,storage:u,note:"Small square image used on previews. Will be resized to 240x240.",thumb:!0},oldHeroImage:{type:d.File,storage:u,hidden:!0},briefDescription:{type:String,note:"50 characters max."},maxBriefDescriptionLength:{type:Number,hidden:!0,default:50,required:!0},sections:{type:d.Relationship,ref:"Postsection",many:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r,l,o,d,f=this;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.heroImage,r=this.coverImage,l=this.oldCoverImage,o=this.oldHeroImage,d=this.briefDescription,e.next=3,(0,s.updateChildrenWithRelatedParent)(c.model,n.default.list("Postsection").model,this).catch(t);case 3:return e.next=5,(0,s.fileValidate)(u,r,{url:"/images/fallbacks/homeCover.jpg",mimetype:"image/jpeg"}).catch(t);case 5:return this.coverImage=e.sent,e.next=8,(0,s.fileValidate)(u,i,{url:"/images/fallbacks/heroNews.jpg",mimetype:"image/jpeg"}).then((0,s.resizeImage)(i,240,240)).catch(t);case 8:return this.heroImage=e.sent,Promise.all([(0,s.removeObsoleteFile)(u,l,r),(0,s.removeObsoleteFile)(u,o,i)]).then(function(){f.oldCoverImage=r,f.oldHeroImage=i}).catch(t),e.next=12,(0,s.validateBriefDescLength)(d||"",50).catch(t);case 12:t();case 13:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(u,this.heroImage).then(e)}),c.defaultColumns="title, sections, author|10%, state|10%, publishedDate|15%",c.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=(0,s.configStorage)("/images/partners/"),d=n.default.Field.Types,c=new n.default.List("Partner",{map:{name:"title"},singular:"Partner",plural:"Partners"});c.add({title:{type:String,required:!0},text:{type:d.Html,wysiwyg:!0},image:{type:d.File,storage:u,note:"Will be resized to 150x75",thumb:!0},oldImage:{type:d.File,storage:u,hidden:!0},link:{type:d.Url}}),c.schema.pre("save",(o=(0,r.default)(a.default.mark(function e(t){var i,r,n;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.link,r=this.image,n=this.oldImage,this.link=(0,s.linkValidate)(i),e.next=4,(0,s.fileValidate)(u,r,{url:"/images/fallbacks/partner.jpg",mimetype:"image/jpeg"}).then((0,s.resizeImage)(r,150,75));case 4:return this.image=e.sent,e.next=7,(0,s.removeObsoleteFile)(u,n,r);case 7:this.oldImage=r,t();case 9:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(u,this.image,e)}),c.defaultColumns="title, text",c.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=n.default.Field.Types,d=(0,s.configStorage)("/images/team/"),c=new n.default.List("Participant",{map:{name:"person"},singular:"Participant",plural:"Participants"});c.add({person:{type:String,required:!0,index:!0},bio:{type:u.Html,wysiwyg:!0,height:300,required:!0,initial:!0,index:!0},facebookLink:{type:u.Url},instagramLink:{type:u.Url},avatar:{index:!0,type:u.File,storage:d,thumb:!0},oldAvatar:{type:u.File,storage:d,hidden:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r,n,l;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.facebookLink,r=this.instagramLink,n=this.avatar,l=this.oldAvatar,this.facebookLink=(0,s.linkValidate)(i),this.instagramLink=(0,s.linkValidate)(r),e.next=5,(0,s.fileValidate)(d,n,{url:"/images/fallbacks/participant.png",mimetype:"image/png"}).catch(t);case 5:return this.avatar=e.sent,e.next=8,(0,s.removeObsoleteFile)(d,l,n);case 8:this.oldAvatar=n,t();case 10:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){d.removeFile(this.avatar,e)}),c.defaultColumns="person, bio",c.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=n.default.Field.Types,d=(0,s.configStorage)("/images/missions/"),c=new n.default.List("Mission",{map:{name:"title"},singular:"Mission",plural:"Missions"});c.add({title:{type:String},showTitle:{type:Boolean},titlePosition:{type:u.Select,numeric:!0,required:!0,default:0,dependsOn:{showTitle:!0},emptyOption:!1,options:[{value:0,label:"Left"},{value:1,label:"Right"}]},subtitle:{type:String},image:{type:u.File,storage:d,thumb:!0},oldImage:{type:u.File,storage:d,hidden:!0},imagePosition:{type:u.Select,numeric:!0,default:0,emptyOption:!1,options:[{value:0,label:"Left"},{value:1,label:"Right"}]},leftColumn:{type:u.Html,wysiwyg:!0},rightColumn:{type:u.Html,wysiwyg:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.image,r=this.oldImage,e.next=3,(0,s.fileValidate)(d,i,{url:"/images/fallbacks/mission.jpg",mimetype:"image/jpeg"}).catch(t);case 3:return this.image=e.sent,e.next=6,(0,s.removeObsoleteFile)(d,r,i);case 6:this.oldImage=i,t();case 8:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(d,this.image,e)}),c.defaultColumns="title, subtitle",c.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=n.default.Field.Types,d=(0,s.configStorage)("/images/home/"),c=new n.default.List("Layout",{map:{name:"mainTitle"},singular:"Layout",plural:"Layouts",nocreate:!0,nodelete:!0});c.add({mainTitle:{type:String,required:!0},mainSubtitle:{type:String},coverImage:{type:u.File,storage:d,thumb:!0},oldCoverImage:{type:u.File,storage:d,hidden:!0},articleTitle:{type:String},articleLeftColumn:{type:u.Html,wysiwyg:!0},articleRightColumn:{type:u.Html,wysiwyg:!0},introSubtitle:{type:String},introText:{type:u.Html,wysiwyg:!0},registerLink:{type:u.Url}}),c.schema.pre("save",(o=(0,r.default)(a.default.mark(function e(t){var i,r,n;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.registerLink,r=this.coverImage,n=this.oldCoverImage,this.registerLink=(0,s.linkValidate)(i),e.next=4,(0,s.fileValidate)(d,r,{url:"/images/fallbacks/homeCover.jpg",mimetype:"image/jpeg"}).catch(t);case 4:return this.coverImage=e.sent,e.next=7,(0,s.removeObsoleteFile)(d,n,r).catch(t);case 7:this.oldCoverImage=r,t();case 9:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){removeFile(d,this.coverImage).then(e).catch(e)}),c.defaultColumns="mainTitle, mainSubtitle",c.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);var l=n.default.Field.Types,o=new n.default.List("Faqsection",{map:{name:"subtitle"},singular:"Faqsection",plural:"Faqsections"});o.add({subtitle:{type:String,required:!0},sequenceNumber:{type:l.Number,default:0},text:{type:l.Html,wysiwyg:!0},relatedParent:{_id:{type:String,hidden:!0},title:{type:String,hidden:!0,label:"Related FAQ"}}}),o.schema.pre("validate",function(e){(0,s.updateChildWithRelatedParent)(n.default.list("Faq").model,o.model,this._id).then(e).catch(e)}),o.relationship({ref:"Faq",refPath:"sections"}),o.defaultColumns="subtitle, relatedParent.title sequenceNumber|25%",o.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);var l=n.default.Field.Types,o=new n.default.List("Faq",{map:{name:"title"},singular:"Faq",plural:"Faqs"});o.add({title:{type:String,required:!0},sequenceNumber:{type:l.Number,default:0},sections:{type:l.Relationship,ref:"Faqsection",many:!0}}),o.schema.pre("save",function(e){(0,s.updateChildrenWithRelatedParent)(o.model,n.default.list("Faqsection").model,this).then(e).catch(e)}),o.defaultColumns="title, sections, sequenceNumber|25%",o.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};var s=n.default.Field.Types,l=new n.default.List("Enquiry",{nocreate:!0,noedit:!0});l.add({name:{type:String,required:!0},email:{type:s.Email},phone:{type:String},subject:{type:String},message:{type:s.Html,required:!0},createdAt:{type:Date,default:Date.now}}),l.defaultSort="-createdAt",l.defaultColumns="name, email, enquiryType, createdAt",l.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};var s=n.default.Field.Types,l=new n.default.List("Donation",{map:{name:"title"},singular:"Donation",plural:"Donation",nocreate:!0,nodelete:!0});l.add({title:{type:String,required:!0},text:{type:s.Html,wysiwyg:!0},putAfterMission:{type:Number,default:1,required:!0}}),l.defaultColumns="title, text",l.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);var l=n.default.Field.Types,o=new n.default.List("Coursesection",{map:{name:"title"},singular:"Course section",plural:"Course sections",label:"Course sections"});o.add({title:{type:String,required:!0},sequenceNumber:{type:l.Number,default:0},fancyTitlebar:{type:Boolean,default:!0,note:"Whether or not display large blue strip with the title on it or a simple subtitle."},text:{type:l.Html,wysiwyg:!0},relatedParent:{_id:{type:String,hidden:!0},title:{type:String,hidden:!0,label:"Related Course"}}}),o.schema.pre("validate",function(e){(0,s.updateChildWithRelatedParent)(n.default.list("Course").model,o.model,this._id).then(e).catch(e)}),o.relationship({ref:"Course",refPath:"sections"}),o.defaultColumns="title, relatedParent.title, sequenceNumber|25%",o.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a};n.default.Field.Types;var s=new n.default.List("Coursefield",{map:{name:"title"},singular:"Course field",plural:"Course fields",label:"Course fields"});s.add({title:{type:String,required:!0}}),s.relationship({ref:"Course",refPath:"field"}),s.defaultColumns="title",s.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=(0,s.configStorage)("/images/courses/"),d=n.default.Field.Types,c=new n.default.List("Course",{map:{name:"title"},autokey:{path:"slug",from:"title",unique:!0},singular:"Course",plural:"Courses"});c.add({title:{type:String,required:!0},active:{type:Boolean,required:!0,index:!0,initial:!0,default:!0,note:"Defines whether this course should be listed among the other, or should it be temporarily disabled."},field:{type:d.Relationship,index:!0,initial:!0,ref:"Coursefield",many:!1},age:{type:Number,required:!0,initial:!0,index:!0,default:0},price:{type:Number,note:"0 means for free",required:!0,initial:!0,index:!0,default:0},heroImage:{type:d.File,storage:u,note:"Small square image used on previews. Will be resized to 240x240.",thumb:!0},oldHeroImage:{type:d.File,storage:u,hidden:!0},briefDescription:{type:String,note:"50 characters max.",required:!0,initial:!0,index:!0},plan:{type:d.Html,wysiwyg:!0,label:"Course plan"},leftColumnSubtitle:{type:String},leftColumnText:{type:d.Html,wysiwyg:!0},rightColumnSubtitle:{type:String},rightColumnText:{type:d.Html,wysiwyg:!0},maxBriefDescriptionLength:{type:Number,hidden:!0,default:50,required:!0},applyToCourseLink:{type:d.Url},relatedAlbum:{type:d.Relationship,ref:"Album",many:!1},sections:{type:d.Relationship,ref:"Coursesection",many:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r,l,o;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.applyToCourseLink,r=this.heroImage,l=this.oldHeroImage,o=this.briefDescription,e.next=3,(0,s.updateChildrenWithRelatedParent)(c.model,n.default.list("Coursesection").model,this).catch(t);case 3:return e.next=5,(0,s.validateBriefDescLength)(o||"",50).catch(t);case 5:return this.applyToCourseLink=(0,s.linkValidate)(i),e.next=8,(0,s.fileValidate)(u,r,{url:"/images/fallbacks/heroNews.jpg",mimetype:"image/jpeg"}).then((0,s.resizeImage)(r,240,240)).then(s.compressImage).catch(t);case 8:return this.heroImage=e.sent,e.next=11,(0,s.removeObsoleteFile)(u,l,r);case 11:this.oldHeroImage=r,t();case 13:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(u,this.heroImage).then(e)}),c.defaultColumns="title, field, age, active",c.register()},function(e,t,i){"use strict";var a,r=i(0),n=(a=r)&&a.__esModule?a:{default:a},s=i(1);var l=n.default.Field.Types,o=new n.default.List("Common",{map:{name:"title"},singular:"Common Layout",plural:"Common Layouts",nocreate:!0,nodelete:!0});o.add({title:{type:String,default:"Common Layout",noedit:!0},header:{facebookLink:{type:l.Url},instagramLink:{type:l.Url}},footer:{primaryPhoneNumber:{type:String},secondaryPhoneNumber:{type:String},cityName:{type:String},address:{type:String},geoLat:{type:String,note:"This is used by Gmaps"},geoLng:{type:String,note:"This is used by Gmaps"}}}),o.schema.pre("save",function(e){var t=this.header,i=t.facebookLink,a=t.instagramLink;this.facebookLink=(0,s.linkValidate)(i),this.instagramLink=(0,s.linkValidate)(a),e()}),o.defaultColumns="title, footer.primaryPhoneNumber, footer.secondaryPhoneNumber, footer.address",o.register()},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u,d=(0,s.configStorage)("/images/albums/"),c=n.default.Field.Types,f=new n.default.List("Albumitem",{map:{name:"title"},singular:"Album item",plural:"Album items",label:"Album items"});f.add({title:{type:String,required:!0},type:{type:c.Select,options:["photo","video"],required:!0,initial:!0,index:!0,default:"photo"},photo:{type:c.File,storage:d,thumb:!0,dependsOn:{type:"photo"}},oldPhoto:{type:c.File,storage:d,hidden:!0},video:{type:c.Url,label:"YouTube link to a video",dependsOn:{type:"video"}},relatedParent:{_id:{type:String,hidden:!0},title:{type:String,hidden:!0,label:"Related Album"}}}),f.schema.pre("save",(o=(0,r.default)(a.default.mark(function e(t){var i,r,l,o,u;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this._id,r=this.type,l=this.photo,o=this.oldPhoto,u=this.video,e.next=3,(0,s.updateChildWithRelatedParent)(n.default.list("Album").model,f.model,i).catch(t);case 3:if("photo"!==r){e.next=13;break}return this.video=null,e.next=7,(0,s.fileValidate)(d,l,{url:"/images/fallbacks/mission.jpg",mimetype:"image/jpeg"}).then(s.compressImage).catch(t);case 7:return this.photo=e.sent,e.next=10,(0,s.removeObsoleteFile)(d,o,l).catch(t);case 10:this.oldPhoto=l,e.next=18;break;case 13:if(this.video=(0,s.linkValidate)(u),e.t0=(0,s.fileExists)(l),!e.t0){e.next=18;break}return e.next=18,(0,s.removeFileAsync)(d,l).catch(t);case 18:t();case 19:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),f.schema.pre("remove",(u=(0,r.default)(a.default.mark(function e(t){var i,r;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(i=this.type,r=this.photo,e.t0="photo"===i,!e.t0){e.next=5;break}return e.next=5,(0,s.removeFileAsync)(d,r).catch(t);case 5:t();case 6:case"end":return e.stop()}},e,this)})),function(e){return u.apply(this,arguments)})),f.relationship({ref:"Album",refPath:"sections"}),f.defaultColumns="type, title, relatedParent.title",f.register()},function(e,t){e.exports=require("gm")},function(e,t){e.exports=require("moment")},function(e,t){e.exports=require("babel-runtime/helpers/extends")},function(e,t){e.exports=require("babel-runtime/helpers/defineProperty")},function(e,t,i){"use strict";var a=l(i(3)),r=l(i(2)),n=l(i(0)),s=i(1);function l(e){return e&&e.__esModule?e:{default:e}}var o,u=(0,s.configStorage)("/images/albums/"),d=n.default.Field.Types,c=new n.default.List("Album",{map:{name:"title"},autokey:{path:"slug",from:"title",unique:!0},singular:"Album",plural:"Albums"});c.add({title:{type:String,required:!0},publishedDate:{type:d.Date,index:!0},heroImage:{type:d.File,storage:u,note:"Small square image used fpr previews. Will be resized to 240x240.",thumb:!0},oldHeroImage:{type:d.File,storage:u,hidden:!0},text:{type:d.Html,wysiwyg:!0},sections:{type:d.Relationship,ref:"Albumitem",many:!0}}),c.schema.pre("validate",(o=(0,r.default)(a.default.mark(function e(t){var i,r;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return i=this.heroImage,r=this.oldHeroImage,e.next=3,(0,s.updateChildrenWithRelatedParent)(c.model,n.default.list("Albumitem").model,this).catch(t);case 3:return e.next=5,(0,s.fileValidate)(u,i,{url:"/images/fallbacks/heroNews.jpg",mimetype:"image/jpeg"}).then((0,s.resizeImage)(i,240,240)).then(s.compressImage).catch(t);case 5:return this.heroImage=e.sent,e.next=8,(0,s.removeObsoleteFile)(u,r,i).catch(t);case 8:this.oldHeroImage=i,t();case 10:case"end":return e.stop()}},e,this)})),function(e){return o.apply(this,arguments)})),c.schema.pre("remove",function(e){(0,s.removeFile)(u,this.heroImage).then(e)}),c.relationship({ref:"Course",refPath:"relatedAlbum"}),c.defaultColumns="title, sections, publishedDate|15%",c.register()},function(e,t,i){var a={"./Album.js":47,"./Albumitem.js":42,"./Common.js":41,"./Course.js":40,"./Coursefield.js":39,"./Coursesection.js":38,"./Donation.js":37,"./Enquiry.js":36,"./Faq.js":35,"./Faqsection.js":34,"./Layout.js":33,"./Mission.js":32,"./Participant.js":31,"./Partners.js":30,"./Post.js":29,"./Postsection.js":28,"./Presentation.js":27,"./Quote.js":26,"./User.js":25};function r(e){var t=n(e);return i(t)}function n(e){var t=a[e];if(!(t+1)){var i=new Error('Cannot find module "'+e+'".');throw i.code="MODULE_NOT_FOUND",i}return t}r.keys=function(){return Object.keys(a)},r.resolve=n,e.exports=r,r.id=48},function(e,t){e.exports=require("dotenv")},function(e,t,i){"use strict";i(49).config();var a=i(0);if(a.init({name:"RoboClubIF",brand:"RoboClubIF",sass:"public",static:"public",favicon:"public/favicon.ico",views:"templates/views","view engine":"pug",mongo:process.env.MONGO_URI||"mongodb://127.0.0.1:27017/roboclubif",port:process.env.PORT||3e3,"session store":"mongo","wysiwyg images":!0,"wysiwyg additional buttons":"searchreplace visualchars, charmap ltr rtl pagebreak paste, forecolor backcolor, preview print","wysiwyg additional plugins":"example, table, advlist, anchor, autolink, autosave, charmap, contextmenu, directionality, hr, pagebreak, paste, preview, searchreplace, textcolor, visualblocks, visualchars, wordcount","wysiwyg additional options":{paste_as_text:!0,textcolor_map:["000000","Black","FFFFFF","White","ECECEC","Gray","F89F4F","Orange","D86761","Red","00A5B6","Blue"]},"auto update":!1,session:!0,auth:!0,"user model":"User"}),"production"===a.get("env")){var r=i(48);r.keys().forEach(r)}else a.import("models");a.set("locals",{_:i(4),env:a.get("env"),utils:a.utils,editable:a.content.editable}),a.set("routes",i(24)),a.set("nav",{home:["layouts","quotes"],about:["participants","missions","donations","presentations","partners"],faq:["faqs","faqsections"],posts:["posts","postsections"],courses:["courses","coursefields","coursesections"],albums:["albums","albumitems"],enquiries:"enquiries",common:"commons",users:"users"}),a.start()}]);