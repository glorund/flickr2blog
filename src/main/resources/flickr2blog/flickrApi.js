var apiKey= '6999cfb48e503984938e6c9ab658b33f';
var pageSize = 40;
var apiBaseURL = 'https://api.flickr.com/services/rest/?';
var photos =[];
var storedPhotos = [];
var selectedPhotos = [];
var userId;
var currentPage;
var totalPages;

$(document).ready(function(){
    $('#loadUser').on('click', checkUserName);
    $('#btnShowHtml').on('click', showHtmlBox);

    $('#hideHtmlBox').on('click', hideHtmlBox);
    $('#preview').on('click', '.selector', function(){
        updateSelection($(this).prop('id'));
    });
    $('#btnShowHtml').hide();
    
});

function updateSelection(id) {
    var index = getPhotoById(id);
    if (index >= 0) {
        var selectedIndex = getSelectedPhotoById(id);
        if (selectedIndex >= 0) {
            selectedPhotos.splice( selectedIndex, 1 );
            $('#'+id).parent().removeClass("selected");
        } else {
            selectedPhotos.push(photos[index]);
            $('#'+id).parent().addClass("selected");
        }
    }
    preview();
    generateHtml();
}

function markSelected() {
    if (selectedPhotos.length > 0) {
        for (var index = 0; index < photos.length; index++) {
            if (getSelectedPhotoById(photos[index].id)>=0) {
                $('#'+photos[index].id).parent().addClass("selected");
            } else {
                $('#'+photos[index].id).parent().removeClass("selected");
            }
        }
    }
}

function getSelectedPhotoById(id) {
    for (var index = 0; index < selectedPhotos.length; index++) {
        if (selectedPhotos[index].id == id) return index;
    }
    return -1;
}
function getPhotoById (id) {
    for (var index = 0; index < photos.length; index++) {
        var photo = photos[index];
        if (photo.id == id) {
            return index;
        }
    }
    return -1;
}

function preview() {
    var html = '';
    for (var i = 0; i < selectedPhotos.length; i++) {
        var photo = selectedPhotos[i];
        var body = '<img id="selected_img_'+photo.id+'" alt="' + photo.title + '" />';
        html += '<div>'+body +'<a id="remove_'+photo.id+'"><img  width="16px" height="16px" src="Close.png"/></a></div>\n';
    }
    $("#lister").html(html);
    for (var i = 0; i < selectedPhotos.length; i++) {
        var photo = selectedPhotos[i];
        imageLoader("selected_img_",photo.id,photo.url_s);
    }
}

function checkUserName() {
    var username = $("#username").val();
    selectedPhotos = [];
    photos = [];
    currentPage = 1;
    totalPages = 0;
    $('#btnShowHtml').hide();
    preview();
    $.getJSON(apiBaseURL+'&method=flickr.people.findByUsername&'+
            'api_key='+apiKey+
            '&username='+username+
            '&format=json&nojsoncallback=1', 
        function(data) {
            if (data.stat == 'ok') {
              $('#message').html(data.user.nsid);
              userId = data.user.nsid;
              fetch(userId,currentPage);
            }
        }
    )
    
}

function generateHtml () {
    if (selectedPhotos.length > 0) {
        var html = '';
        var keywords = [];
        for (var i = 0; i < selectedPhotos.length; i++) {
            var photo = selectedPhotos[i];
            var body = '<a href="https://www.flickr.com/photos/'+userId+'/'+photo.id+'">';
            body += '<img style="position:relative" alt="' + photo.title + '"src="'+ photo.url_m + '" width="'+photo.width_m+'" hieght="'+photo.height_m+'"/>' ;
            body +=' </a>';
            html += '<div>'+body + '<div >'+photo.title+ '</div></div>\n';
            var tags = photo.tags.split(" ");
            for (var j =0 ; j< tags.length; j++) {
                if ($.inArray(tags[j], keywords) < 0) {
                    keywords.push(tags[j]);
                }
            }
        }
        $("#code").val(html);
        $("#keywords").val(keywords);
        $('#btnShowHtml').show();
    } else {
        $('#btnShowHtml').hide();
    }
}

function fetch(userId,page) {
    $.getJSON(apiBaseURL+'&method=flickr.people.getPublicPhotos&'+
            'api_key='+apiKey+
            '&user_id='+userId+
            '&extras=url_m,url_s,tags'+
            '&page='+page+
            '&per_page='+pageSize+
            '&format=json&nojsoncallback=1',
        function(data) {
            photos = [];
            currentPage = data.photos.page;
            totalPages = data.photos.pages;
            pageSize = data.photos.perpage;
            for (var i = 0; i < data.photos.photo.length; i++) {
                var photo = data.photos.photo[i];
                photos.push(photo);
            }
            generatePreview(data.photos.page,data.photos.pages);
        });
}

function generatePreview(page,pages) {
    var preview = "<div id=\"selected\">\n";
    var X = $("#preview").width()-50;
    var baseHeight = 100;
    var filler = 0;
    var line = [];
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        var aspect = baseHeight/Number(photo.height_s);
        if (filler + aspect*Number(photo.width_s) >= X ) {
            var multiplayer = (X)/filler;
            preview += generatePreviewLine(baseHeight,multiplayer,line);
            filler = 0;
            line = [];
        }
        filler += aspect*Number(photo.width_s);
        line.push(photo);
    }
    preview += generatePreviewLine(baseHeight,1,line);
    preview += "</div>";
    createPager(page,pages);

    $("#preview").html(preview);
    for (i = 0; i < photos.length; i++) {
        photo = photos[i];
        imageLoader("img_",photo.id,photo.url_s);
    }
    markSelected();
}
function generatePreviewLine(baseHeight,multiplayer,line) {
    var preview = '';
    for (var lineIndex = 0 ; lineIndex < line.length; lineIndex++) {
        var image = line[lineIndex];
        var body = '<img id="img_'+image.id+'"alt="' + image.title + '" height="'+(baseHeight*multiplayer)+'"/>'; //'+(image.width_s*multiplayer)+'
        preview += '<div class="thumbnail">' + body + '<div class="selector" id="'+image.id+'"/></div>\n';
    }
    return preview;
}
function imageLoader(prefix,id,url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      $("#"+prefix+id).attr('src', window.URL.createObjectURL(this.response));
    };
    xhr.send();
}
