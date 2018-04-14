# roboclub-node
To install all required dependencies, run:
```
yarn install
```
To start the project in **development** mode, run:
```
yarn start
```
To start the project in **production** mode, you have to compile source into a bundle:
```
yarn build
```
To actually start the project, run:
```
node build.js
```
This project uses webpack to bundle backend side and gulp to do the same for frontend. To update frontend js bundle, run:
```
yarn build-front
```
*Note: SASS gets recompiles automatically by **/keystone.js***
___
Every post  being loaded at **/posts** is put into slick.js lazy slider, so no images will be requested from server until they're really needed. However, this page **queries every single post from DB**, so all post data needed for displaying previews is sent over the network. Someone might consider implementing some kind of pagination for scalability concerns. The same applies to **/courses**.


[Keystone.js](https://github.com/keystonejs/keystone) can't validate File type, so validation has been implemented in **/utils**. For further details see [#4575](https://github.com/keystonejs/keystone/issues/4575).