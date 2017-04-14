chrome.app.runtime.onLaunched.addListener(function() {
//    window.open('https://www.google.com'); 
//    window.open('flickr2blog.html');
    
  chrome.app.window.create('flickr2blog.html', {
     id: 'MainWindowId',
     'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});