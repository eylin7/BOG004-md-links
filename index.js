const fetch = require('node-fetch'); 
const { reject, ok } = require("assert");
let fs = require("fs");
const { resolve } = require("path");
let path = require("path");
let process = require("process");
const { promise } = require("readdirp");



//Transformar ruta
let absolutePath = (processpath) =>
  path.isAbsolute(processpath) ? processpath : path.resolve(processpath);




//verificar si es un directorio
//funcion recursiva //arraFiles es el array vacio
//const prueba = (userPath) => new Promise((resolve,reject)=>{
// getFiles devuelve un array de md's
const getFilesDirectory = (userPath, arraFiles) =>{
  return new Promise((resolve, reject)=>{
    if (fs.statSync(userPath).isFile()) {
      if(path.extname(userPath) === ".md"){
        arraFiles.push(userPath);
        console.log('user', userPath)
      }
    } else {
        let contentDirectory = fs.readdirSync(userPath);
        contentDirectory.forEach((element) => {
        let newRouter = path.join(userPath, element);
        getFilesDirectory(newRouter, arraFiles);
      });
    }
   resolve(arraFiles);
  })
}
//Leer archivo  y extraer links
const readArchive = (resultPath) =>
new Promise((resolve, reject) => {
const arrayLinks= [];
fs.readFile(resultPath, "UTF-8", (err, data) => {
  if (err) {
    console.log("linea42", err);
    reject("No se Lee el archivo");
  } else {
    const links= (data.match(/\[(.*?)\]\((.*)\)/g));
    // si links tiene links hago lo siguiente
    if(links !== null ){
      let objectLinks = links.map((link) => {
        const linkName = link.match(/\[.*\]/)[0].replace(/\[|\]/g, "");
        const linkUrl = link.match(/\(.*\)/)[0].replace(/\(|\)/g, "");
        return {
        text: linkName.substring(0, 50),
        href: linkUrl,
        file: resultPath,
        }
        })
        resolve(objectLinks)
      }
  }
});
});
//funcion para Validar
const validateObjects = (objects) => {
const arrayPromise = objects.map((link) =>{
  return fetch(link.href).then((response) =>{
        if(response.status >=200 && response.status <= 399) {
          link.status = response.status,
          link.result = 'OK'
          return link;
        } else if( response.status >=400 && response.status <= 599){
          link.status = response.status,
              link.result = 'FAIL'
              return link;
        }
  }) 
})
return Promise.allSettled(arrayPromise).then((res)=>res);
}

//funcion para traer el stats: links totales y unicos
const getStats = (arrayRespuesta) => {
  // console.log('arrayyyy', arrayRespuesta);
  return {
    total: arrayRespuesta.length,
    unicos: new Set(
      arrayRespuesta.map((elemto) => {
        return elemto.href;
      })
    ).size,
  };
};
//funcion para traer los links rotos
const broken = (arrayRespuesta) => { 
  const linksBroken = arrayRespuesta.filter((elem) => elem.status !== "OK");
  const stats = `${"Broken:"} ${linksBroken.length}\n`;
  return stats;
};


module.exports = {
absolutePath,
getFilesDirectory,
readArchive,
validateObjects, 
broken,
getStats,
}
