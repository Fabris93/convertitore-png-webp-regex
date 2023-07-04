const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


function convertToWebP(filePath) {
  // console.log('filePath', filePath);
  // const splitFolders = filePath.split('\\');
  // const folders = splitFolders.slice(0, splitFolders.length - 1);
  // folders[0] = 'output'; //Cambio input con output
  // const newPath = folders.toString().replaceAll(',', '\\'); //Trasformo array nella nuova path
  // console.log('newPath:::', newPath);

  const regex = /\\[^\\]+$/;
  const newFilePath = filePath.replace('input', 'output').replace(regex, ''); //Non toglie l'ultimo elemento.
  const fileStat = fs.statSync(filePath);
  if (!fs.existsSync(newFilePath)) { //Utilizzare existsSync() al posto di isDirectory()
    // console.log('newPath:::', newPath);
    fs.mkdirSync(newFilePath, { recursive: true });
  }


  const outputFilePath = newFilePath + '\\' + path.basename(filePath, path.extname(filePath)) + '.webp';
  console.log('outputFilePath:::', outputFilePath);
  // const outputFilePath = filePath.replace(path.extname(filePath), '.webp');

  sharp(filePath)
    .toFormat('webp')
    .toFile(outputFilePath, (err, info) => {
      if (err) {
        console.error(`Errore durante la conversione del file ${filePath}:`, err);
      } else {
        console.log(`File convertito: ${outputFilePath}`);
      }
    });
}

function readDirectoryRecursively(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {

      readDirectoryRecursively(filePath);
    } else {
      // Verifica se il file è un'immagine supportata (es. PNG, JPEG, etc.)
      const supportedImageFormats = ['.png', '.jpeg', '.jpg', '.gif'];
      const fileExtension = path.extname(file).toLowerCase();
      if (supportedImageFormats.includes(fileExtension)) {
        convertToWebP(filePath);
      }
    }
  });
}

const directoryPath = './input';
readDirectoryRecursively(directoryPath);
