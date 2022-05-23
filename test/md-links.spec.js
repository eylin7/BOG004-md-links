const mdLinks = require('../md-links.js');
const processPath = 'prueba/documento.md'
const arrayData = [
    {
        text: 'Linea de comando CLI',
        href: 'https://medium.com/netscape/a-guide-to-creat-to-create-a-nodejs-command-line-package-c2166,       ad0452e',
        file: 'Prueba/prueba1.md',
        status: 503,
        result: 'no tengo idea'
    },
    {
        text: 'Path',
        href: 'https://nodejs.org/api/path.html',
        file: 'Prueba/prueba1.md',
        status: 200,
        result: 'OK'
      },
]
describe('mdLinks', () => {
  it('debe ser una funcion', () => {
    expect(typeof mdLinks).toBe('function');
 });
   it('debe retornar una promesa', (done) => {
    expect(mdLinks(processPath) instanceof Promise).toBeTruthy()
  });
 });

it('debe retornar una promesa',(done) => {
  return mdLinks(processPath).then((result)=> {
  expect(result).toEqual(arrayData);
  
  })
});