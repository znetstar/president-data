const {WikiDummyDataCreator} = require('@znetstar/wiki-dummy-data/lib/index');
const {DEFAULT_RECORD_OPTIONS} = require('@znetstar/wiki-dummy-data/lib/Record');
const fs = require('fs-extra');
const path =  require('path');
const outpath = path.join(__dirname, '..', 'data', fs.readJsonSync(require('path').join(__dirname, '..', 'package.json')).version);
const { EncodeTools } = require('@znetstar/encode-tools');

const chance = require('chance')();

(async () => {
  for (let [ name, url, col ] of [
      ['presidents', 'https://en.wikipedia.org/wiki/President_of_the_United_States', 'Presidents of the United States']
  ]) {
    let W = new WikiDummyDataCreator({
      ...DEFAULT_RECORD_OPTIONS,
      imageSize: {
        width: 960
      },
      encodeOptions: {
        serializationFormat: 'msgpack',
        hashAlgorithm: 'xxhash64',
        compressionFormat: 'zstd'
      }
    });

    let collection = W.createCollection(url, col, true);

    await fs.ensureDir(path.join(
      outpath,
      name));

    for await (let record of collection) {
      let recPath = path.join(
        outpath,
        name,
        record.pageId.replace(/[.]/i, '').replace(/\s/i, '-').toLowerCase()+'.msgpack'
      );

      if (!record.data.blobs?.mainImage?.contentType || record.data.blobs.mainImage.contentType.indexOf('image/') === -1 || await fs.pathExists(recPath) || record.data.title.indexOf('Presidency of') !== -1  || record.data.title.indexOf('Timeline of') !== -1)
        continue;

      let buf = await record.serialize();
      await fs.writeFile(`${recPath}`, buf);

      W.recordOptions.encodeOptions.imageFormat = chance.shuffle([ 'png', 'jpeg' ])[0];
      W.recordOptions.imageSize = {
        width: chance.integer({ min: 300, max: 960 })
      };


      console.log(`wrote ${record.data.title} → ${recPath}`);
    }
  }

  process.exit(0);
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
})
