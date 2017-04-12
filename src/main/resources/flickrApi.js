var apiKey= '6999cfb48e503984938e6c9ab658b33f';
var pageSize = 20;
var apiBaseURL = 'https://api.flickr.com/services/rest/?';
var photos;
var selectedPhotos = [];
$(document).ready(function(){
    $('#submit').on('click', checkUserName);
    $('#generate').on('click', generateHtml);
    
    $('#preview').on('click', '.selector', function(){
        updateSelection($(this).prop('id'));
    });

});

function updateSelection(id) {
    if ($.inArray(id, selectedPhotos) >= 0) {
        $('#'+id).parent().removeClass("selected");
        selectedPhotos.splice( $.inArray(id, selectedPhotos), 1 );
    } else {
        selectedPhotos.push(id);
        $('#'+id).parent().addClass("selected");
    }
    preview();
}

function preview() {
    var html = '';
    var pos = 1;
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        if ($.inArray(photo.id, selectedPhotos) >= 0) {
            var body = '<img width ="75" height = "75" class="preview" alt="' + photo.title + '"src="'+ photo.url_s + '"/>' ;
            html += '<div>'+body +'</div>\n';
            pos++;
        }
    }
    $("#lister").html(html);
}

function checkUserName() {
    var username = $("#username").val();

    $.getJSON(apiBaseURL+'&method=flickr.people.findByUsername&'+
            'api_key='+apiKey+
            '&username='+username+
            '&format=json&jsoncallback=?',
        function(data) {
            if (data.stat == 'ok') {
              $('#message').html(data.user.nsid);
              fetch(data.user.nsid);
            }
        }
    )
    
}

function generateHtml () {
    var html = '';
    var pos = 1;
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        if ($.inArray(photo.id, selectedPhotos) >= 0) {
            var t_url = photo.url_m;
            var body = '<img alt="' + photo.title + '"src="'+ t_url + '"/>' ;
            html += '<p>'+pos+'. '+photo.title+body + '</p>\n';
            pos++;
        }
    }
    $("#code").val(html);
}

function fetch(userId) {
    $.getJSON(apiBaseURL+'&method=flickr.people.getPublicPhotos&'+
            'api_key='+apiKey+
            '&user_id='+userId+
            '&extras=url_m,url_s'+
            '&per_page='+pageSize+
            '&format=json&jsoncallback=?',
        function(data) {
            photos = [];
            selectedPhotos = [];
            var header = "total number is: "
                    + data.photos.photo.length + "<br/>";
            var s = "";
            var preview = "<div id=\"selected\">\n";
            for (var i = 0; i < data.photos.photo.length; i++) {
                var photo = data.photos.photo[i];
                photos.push(photo);
                var t_url = photo.url_s;
                var body = '<img alt="' + photo.title + '"src="'+ t_url + '"/>' ;
                preview += '<div class="thumbnail">' + body + '<div class="selector" id="'+photo.id+'"/></div>\n';
            }
            preview += "</div>";
            $("#preview").html(header + preview);
        });
}


