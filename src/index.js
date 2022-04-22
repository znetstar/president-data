const fs = require('fs-extra');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data', fs.readJsonSync(require('path').join(__dirname, '..', 'package.json')).version);
const presData = path.join(dataDir, 'presidents');
const {  Record } = require('@znetstar/wiki-dummy-data');
const { EncodeTools } = require('@znetstar/encode-tools');
const presidents = fs.pathExistsSync(presData) ? fs.readdirSync(presData).map(f => path.join(presData, f)) : [];
function createDataProxy(data) {
    const dataProxy = new Proxy(data, {
        set: () => false,
        deleteProperty: () => false,
        has: function (target, prop) {
            if ((typeof(prop) !== 'number' && typeof(prop) !== 'string') && !Number.isInteger(Number(prop)))
                return void(0);

            return Number(prop) in target;
        },
        get: function (target, prop) {
            if (prop === 'length')
                return target.length;
            if ((typeof(prop) !== 'number' && typeof(prop) !== 'string') && !Number.isInteger(Number(prop)))
                return void(0);

            return (async () => {
                let filePath = target[Number(prop)];
              // filePath = filePath && filePath.replace('.text', '');
                if (!filePath || ! await fs.pathExists(`${filePath}`))
                    return void(0);

                const buf = await fs.readFile(`${filePath}`);

                const recordData = await Record.deserializeData(buf, new EncodeTools({
                  serializationFormat: 'msgpack',
                  hashAlgorithm: 'xxhash64',
                  compressionFormat: 'zstd'
                }));

                return recordData;
            })();
        }
    });

    return dataProxy;
}

const mod = {
    presidents: createDataProxy(presidents)
};

Object.freeze(mod);

module.exports = mod;
