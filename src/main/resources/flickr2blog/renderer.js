var currentPage = 1;
var totalPages = 0;

function prevPage()
{
    if (currentPage > 1) {
        currentPage--;
        changePage(currentPage);
    }
}

function nextPage()
{
    if (currentPage < totalPages) {
        currentPage++;
        changePage(currentPage);
    }
}

function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    // Validate page
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    fetch(userId,page);
    
    if (page == 1) {
        $('#btn_prev').hide();
    } else {
        $('#btn_prev').show();
    }

    if (page == totalPages) {
        $('#btn_next').hide();
    } else {
        $('#btn_next').show();
    }
}

function showHtmlBox() {
    $('.floater').show();
}
function hideHtmlBox() {
    $('.floater').hide();
}