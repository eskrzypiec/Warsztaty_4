$(function () {
    var urlBooks = "http://localhost:8000/book/";

    function showBooks(result) {
        var name = $("#name");
        for (var i of result) {
            var newP = $("<div class='title'>" + i.title + "</div>");
            var newDiv = $("<div class='titleDiv'></div>");
            var newLink = $("<a>");
            newP.attr("data-id", i.id);
            newP.attr("data-type", "GET");
            newLink.addClass("delete");
            newLink.attr("href", "#");
            newLink.attr("data-type", "DELETE");
            newLink.text("usuń");
            newDiv.attr("data-id", i.id);
            newDiv.attr("data-type", "GET");
            name.append(newP);
            newP.append(" ");
            newP.append(newLink);
            name.append(newDiv);
        }
    }


    var ajax = function (url, data, type, method, selector) {
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType: "json"
        }).done(function (result) {
            if (method === "getBooks") {
                showBooks(result);

                $(".delete").on("click", function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    console.log($(this));
                    var deleteBook = $(this).parent();
                    var bookId = deleteBook.data("id");
                    var url = urlBooks + bookId;
                    var data = {};
                    var type = ($(this)).data("type");
                    ajax(url, data, type, "reload");
                });

                var titles = $(".title");
                $(".titleDiv").hide();
                titles.one("click", function (e) {
                    e.preventDefault();
                    var p = $(this);
                    var data = {};
                    var bookId = ($(this)).data("id");
                    var url = urlBooks + bookId;
                    var type = p.data("type");
                    $(this).next(".titleDiv").show();
                    ajax(url, data, type, "showTitles", p);


                });

            }
            else if (method === "reload") {
                location.reload();
            }
            else if (method === "showTitles") {
                selector.next(".titleDiv").append($("<ul>"));
                selector.next(".titleDiv").children().eq(0).append($("<li>ISBN: " + result.isbn + "</li>"));
                selector.next(".titleDiv").children().eq(0).append($("<li>AUTOR: " + result.author + "</li>"));
                selector.next(".titleDiv").children().eq(0).append($("<li>GATUNEK: " + result.genre + "</li>"));
                selector.next(".titleDiv").children().eq(0).append($("<li>WYDAWCA: " + result.publisher + "</li>"));
                var putForm = $(".form-post");
                putForm.clone().appendTo(selector.next(".titleDiv"));
                var parent = selector.next(".titleDiv");
                parent.children("form").children("fieldset").children("label.form").text("Edytuj książkę");
                editBook(parent);

            }
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });


    };


    function editBook(parent) {
        var submitPut = parent.children("form").children("div.form-group").children("#submit");
        submitPut.attr("data-type", "put");
        var authorPut = parent.children("form").children("fieldset").children("#div_id_author").children("div").children("#id_author");
        authorPut.attr("id", "id_author_put");
        var titlePut = parent.children("form").children("fieldset").children("#div_id_title").children("div").children("#id_title");
        titlePut.attr("id", "id_title_put");
        var isbnPut = parent.children("form").children("fieldset").children("#div_id_isbn").children("div").children("#id_isbn");
        isbnPut.attr("id", "id_isbn_put");
        var publisherPut = parent.children("form").children("fieldset").children("#div_id_publisher").children("div").children("#id_publisher");
        publisherPut.attr("id", "id_publisher_put");
        var genrePut = parent.children("form").children("fieldset").children("#div_id_genre").children("div").children("#id_genre");
        genrePut.attr("id", "id_genre_put");
        submitPut.on("click", function (event) {
            event.preventDefault();
            var bookEditId = parent.attr("data-id");
            var author = authorPut.val();
            var title = titlePut.val();
            var isbn = isbnPut.val();
            var publisher = publisherPut.val();
            var genre = genrePut.val();
            var url = urlBooks + bookEditId;
            var data = {author: author, title: title, isbn: isbn, publisher: publisher, genre: genre};
            var type = $(this).attr("data-type");
            ajax(url, data, type, "reload");
        });
    }

    function addBook(urlBooks) {
        $("#submit").on("click", function () {
            var author = $("#id_author").val();
            var title = $("#id_title").val();
            var isbn = $("#id_isbn").val();
            var publisher = $("#id_publisher").val();
            var genre = $("#id_genre").val();
            var data = {author: author, title: title, isbn: isbn, publisher: publisher, genre: genre};
            ajax(urlBooks, data, "POST", "reload");
        });
    }

    $(".titleDiv").hide();
    ajax(urlBooks, {}, "GET", "getBooks");
    addBook(urlBooks);
});