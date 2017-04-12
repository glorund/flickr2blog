var apiKey= '6999cfb48e503984938e6c9ab658b33f';
var pageSize = 10;
var apiBaseURL = 'https://api.flickr.com/services/rest/?';
$(document).ready(function(){
    $('#submit').on('click', checkUserName);
});


function checkUserName() {
    var username = $("#username").val();
    generate('76388752@N05');
}
function getUserInfo(username) {
    $.getJSON(apiBaseURL+'&method=flickr.people.getPublicPhotos&');
}
function generate(userId) {
    $.getJSON(apiBaseURL+'&method=flickr.people.getPublicPhotos&'+
            'api_key='+apiKey+
            '&user_id='+userId+
            '&extras=url_m,url_s'+
            '&per_page='+pageSize+
            '&format=json&jsoncallback=?',
        function(data) {
            var header = "total number is: "
                    + data.photos.photo.length + "<br/>";
            var s = "";
            var preview = "<div id=\"selected\">\n";
            for (var i = 0; i < data.photos.photo.length; i++) {
                var photo = data.photos.photo[i];
                var t_url = photo.url_s;
                
                var body = '<img alt="' + photo.title + '"src="'+ t_url + '"/>' ;
                s += '<p>'+body + '</p>\n';
                preview += '<div class="thumbnail">' + body + '</div>\n';
            }
            $("#code").val(s);
            preview += "</div>";
            $("#preview").html(header + preview);
        });
}
