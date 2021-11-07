const {readdirSync, lstatSync, copyFileSync, mkdirSync} = require("fs");
const {join} = require("path");

const wDir = join(__dirname, 'dist/libs/esm2015/workers/');
try {
  lstatSync(wDir);
  const workers = readdirSync(wDir);
  try {
    mkdirSync(join(__dirname, 'dist/libs/fesm2015/workers/'));
  } catch (_43) {
  }
  workers.forEach(w => {
    const src = join(__dirname, 'dist/libs/esm2015/workers/', w);
    const dest = join(__dirname, 'dist/libs/workers/', w);
    copyFileSync(src, dest);
  });
  console.log('done copying esm2015');
} catch (e) {
  console.log(e.toString())
}


const wDir2 = join(__dirname, 'dist/libs/esm2020/workers/');
try {
  lstatSync(wDir2);
  const workers = readdirSync(wDir2);
  try {
    mkdirSync(join(__dirname, 'dist/libs/fesm2020/workers/'));
  } catch (_43) {
  }
  workers.forEach(w => {
    const src = join(__dirname, 'dist/libs/esm2020/workers/', w);
    const dest = join(__dirname, 'dist/libs/workers/', w);
    copyFileSync(src, dest);
  });
  console.log('done copying esm2020');
} catch (e) {
  console.log(e.toString())
}
