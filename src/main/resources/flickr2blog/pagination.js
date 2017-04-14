/**
 * 
 */

const maxPages = 3;

$(document).ready(function(){
    $('#pager').on('click','#pagerPrev', prevPage);
    $('#pager').on('click','#pagerNext', nextPage);
    $('#pager').on('click', '.pagerItem', {page: $(this).attr('id')}, moveToPage)
});

function createPager(page,pages) {
    if (pages == 0) {
        $("#pager").html("");
        return;
    }
    var html ='<a id="pagerPrev">&laquo;</a>';
    html += renderPagerItem(1,page);
    for (var i = 2; i <= pages-1; i++) {
        html += renderPagerItem(i,page); 
    }
    if (pages >= 2 ) {
        html += renderPagerItem(pages,page);
    }

    html += '<a id="pagerNext">&raquo;</a>'
    $("#pager").html(html);

    if (page == 1) {
        $('#pagerPrev').addClass("active");
    } else {
        $('#pagerPrev').removeClass("active");
    }

    if (page == pages) {
        $('#pagerNext').addClass("active");
    } else {
        $('#pagerNext').removeClass("active");
    }
}

function renderPagerItem(index,page) {
    var active = '';
    if (index== page) {
        active += ' active';
    }
    return '<a class="pagerItem'+active+'" id="pager'+index+'">'+index+'</a>';
}
function moveToPage(data) {
    var pageNum = data.currentTarget.id.substring(5);
    fetch(userId,pageNum);
}

function prevPage(data)
{
    if (currentPage > 1) {
        changePage(currentPage-1);
    }
}

function nextPage()
{
    if (currentPage < totalPages) {
        changePage(currentPage+1);
    }
}

function changePage(page)
{
    // Validate page
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    fetch(userId,page);
}