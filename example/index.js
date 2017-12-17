const Demo = require('./Demo.re');

document.addEventListener('DOMContentLoaded', function(event) {
  document
    .querySelector('#demo')
    .appendChild(document.createTextNode(Demo.echo('This is calling from JS')));
});