var apiKey= '6999cfb48e503984938e6c9ab658b33f';
var pageSize = 80;
var apiBaseURL = 'https://api.flickr.com/services/rest/?';
var photos =[];
var storedPhotos = [];
var selectedPhotos = [];
var userId;

$(document).ready(function(){
    $('#submit').on('click', checkUserName);
    $('#generate').on('click', generateHtml);
    
    $('#preview').on('click', '.selector', function(){
        updateSelection($(this).prop('id'));
    });

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
        var body = '<img alt="' + photo.title + '"src="'+ photo.url_s + '"/>' ;
        html += '<div>'+body +'</div>\n';
    }
    $("#lister").html(html);
}

function checkUserName() {
    var username = $("#username").val();

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
    var html = '';
    var pos = 1;
    for (var i = 0; i < selectedPhotos.length; i++) {
        var photo = photos[i];
        var body = '<img alt="' + photo.title + '"src="'+ photo.url_m + '" width="'+photo.width_m+'" hieght="'+photo.height_m+'"/>' ;
        html += '<p>'+(i+1)+'. '+photo.title+body + '</p>\n';
        pos++;
    }
    $("#code").val(html);
}

function fetch(userId,currentPage) {
    $.getJSON(apiBaseURL+'&method=flickr.people.getPublicPhotos&'+
            'api_key='+apiKey+
            '&user_id='+userId+
            '&extras=url_m,url_s'+
            '&page='+currentPage+
            '&per_page='+pageSize+
            '&format=json&nojsoncallback=1',
        function(data) {
            photos = [];
            currentPage = data.photos.page;
            totalPages = data.photos.pages;
            pageSize = data.photos.perpage;
            var header = "Pages: [" + data.photos.page +"/"+data.photos.pages+"]"+ data.photos.photo.length +"/"+ data.photos.perpage +"<br/>";
            var preview = "<div id=\"selected\">\n";
            for (var i = 0; i < data.photos.photo.length; i++) {
                var photo = data.photos.photo[i];
                photos.push(photo);
                var body = '<img alt="' + photo.title + '"src="'+ photo.url_s + '"/>' ;
                preview += '<div class="thumbnail">' + body + '<div class="selector" id="'+photo.id+'"/></div>\n';
            }
            preview += "</div>";
            $("#preview").html(header + preview);
            markSelected();
        });
}


