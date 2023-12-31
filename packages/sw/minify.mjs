import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { minify } from 'terser';

function getAllFiles({ arrayOfFiles = [], path }) {
  const files = readdirSync(path);

  files.forEach(file => {
    if (statSync(`${path}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles({ path: `${path}/${file}`, arrayOfFiles });
    } else {
      if (file.match(/\.js$/)) {
        arrayOfFiles.push(join(resolve(), `${path}/${file}`));
      }
    }
  });

  return arrayOfFiles; // .filter((path) => path.match(/\.js$/));
}

function minifyFiles(filePaths) {
  filePaths.forEach(async filePath => {
    const mini = await minify(readFileSync(filePath, 'utf8'), {
      compress: {
        keep_infinity: true,
        keep_fnames: true,
        keep_classnames: true,
      },
    });
    const minicode = mini.code;
    writeFileSync(filePath, minicode);
  });
}

const files = getAllFiles({ path: './dist' });
minifyFiles(files);
