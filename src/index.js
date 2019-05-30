var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({
  path: '../public/lib',
  l: window.licenseKey
}, viewerElement);

var files = [
  '/public/files/webviewer-demo-annotated.xod',
  '/public/files/webviewer-demo-annotated.pdf',
  '/public/files/office.docx'
];

viewerElement.addEventListener('ready', function() {
  var viewerInstance = viewer.getInstance();
  var documentsDiv = document.getElementById('documents');
  var store = localforage.createInstance({ name: 'store' });

  files.forEach(function(file) {
    var div = document.createElement('div');
    var fileName = file.split('/').slice(-1)[0];
    div.innerHTML = fileName;

    var button = document.createElement('button');
    button.innerHTML = 'Open';
    button.onclick = function() {
      if (button.innerHTML === 'Open') {
        store
          .getItem(fileName)
          .then(function(blob) {
            viewerInstance.loadDocument(blob, { filename: fileName });
          });
        viewerInstance.loadDocument(file);
      } else {
        fetch(file)
          .then(function(response) {
            return response.blob();
          })
          .then(function(blob) {
            blob.name = fileName;
            store.setItem(fileName, blob);
            button.innerHTML = 'Open';
          })
          .catch(error => {
            console.log('Error fetching the file');
          });
      }
    };

    var list = document.createElement('li');
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
