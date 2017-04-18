
$(document).ready(function(){
    fixPreviewHeight();
    $(window).bind('resize', function () { 
        fixPreviewHeight();
    });
});

function fixPreviewHeight() {
    var y = $(window).height();
    var x = $(window).width();
    $('#message').html('<div>resized'+x+'x'+y+'</div>'); // 180
    // 33
    $('#preview').css('width',x-15);
    $('#preview').css('height',y-180); 
}

function showHtmlBox() {
    $('.floater').show();
}
function hideHtmlBox() {
    $('.floater').hide();
}

