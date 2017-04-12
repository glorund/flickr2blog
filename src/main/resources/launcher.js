chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('flickr2blog.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});