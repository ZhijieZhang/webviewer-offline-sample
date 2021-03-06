var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({
  path: '../public/lib',
  l: atob(window.licenseKey),
}, viewerElement);

var files = [
  '/files/webviewer-demo-annotated.xod',
  '/files/webviewer-demo-annotated.pdf',
  '/files/legal-contract.docx',
];

viewerElement.addEventListener('ready', function() {
  var store = localforage.createInstance({ name: 'store' });
  var viewerInstance = viewer.getInstance();
  var documentsDiv = document.getElementById('documents');
  var list = document.createElement('li');

  files.forEach(function(file) {
    var div = document.createElement('div');
    var button = document.createElement('button');
    var fileName = file.split('/').slice(-1)[0];

    div.innerHTML = fileName;
    button.innerHTML = 'Open';
    button.onclick = function() {
      if (button.innerHTML === 'Open') {
        store
          .getItem(fileName)
          .then(function(blob) {
            blob.name = fileName;
            viewerInstance.loadDocument(blob, { filename: fileName });
          });
      } else {
        fetch(file)
          .then(function(response) {
            return response.blob();
          })
          .then(function(blob) {
            store.setItem(fileName, blob);
            button.innerHTML = 'Open';
          })
          .catch(() => {
            console.log('Error fetching the file');
          });
      }
    };

    list.appendChild(div);
    list.appendChild(button);

    documentsDiv.appendChild(list);

    // Change button text to Open if the file is cached, otherwise set the text to Download
    store.keys().then(function(keys) {
      if (keys.indexOf(fileName) === -1) {
        button.innerHTML = 'Download';
      }
    });
  });
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js')
    .then(function(registration) {
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
} else {
  alert('This browser does not support service worker.');
}
