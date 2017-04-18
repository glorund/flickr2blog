chrome.app.runtime.onLaunched.addListener(function() {

  chrome.app.window.create('flickr2blog.html', {
     id: 'MainWindowId',
     'outerBounds': {
      'width': 800,
      'height': 600
    }
  });
});