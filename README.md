# Dashjs-Player-jQuery-Plugin

## Introduce

![img](./assets/screenshots.png)

## Getting Start

````
yarn start // start localhost:3000

yarn test // start karma to test src code.
````

## Usage

````javascript
// html
<div id="player"></div>

// app.js
var playlist = [...src];

$('#player').caphDashjsPlayer({
    datas : playlist // datas can not rename
});
````

## About

-   [CAPH3 for jQuery](https://developer.samsung.com/onlinedocs/tv/caphdocs/main.html?type=jquery&doc=demo&p1=0)
-   [shaka-player](https://github.com/google/shaka-player)
-   [dash.js](https://github.com/Dash-Industry-Forum/dash.js)