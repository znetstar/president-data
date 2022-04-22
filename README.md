# Presidents Data

[![NPM](https://nodei.co/npm/@znetstar/president-data.png)](https://nodei.co/npm/@znetstar/president-data/)

This package contains a data on presidents of the United States for use as sample data in other projects.

The data was compiled from a Wikipedia page located at [https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States](https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States).

The content is licensed under the [Creative Commons Attribution-Share-Alike License 3.0](https://creativecommons.org/licenses/by-sa/3.0/us/).

# Building

To build run `npm run build`. Output will be saved to the `data` folder. The output format is MessagePack.

# Using

```javascript
(async () => {
  let Pres = require('./');
  let b = await Pres.presidents[0];
  console.log(b);
})();
```
