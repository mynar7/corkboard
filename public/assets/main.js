let urlField;
const put = function(url, data, callback){

    if ( $.isFunction(data) ){
      type = type || callback,
      callback = data,
      data = {}
    }
   
    return $.ajax({
      url: url,
      type: 'PUT',
      success: callback,
      data: JSON.stringify(data),
      contentType:'application/json'
    });
   }

$('document').ready(() => {
    // console.log('ready')

    //filter buttons
    $('#filter, .filterBtn').click(() => {
        $('.filterCard').toggle('blind');
        $('#close').show();
        $('#filter').hide();
        $('.dropAnnounce').hide('blind');
    });


    //show/hide announcements
    $('#announce').click(() => {
        $('.dropAnnounce').show('blind');
        $('#announce').hide();
        $('#closeAnn').show();
        $('#close').hide();
        // $('#filter').show();


    })

    $('#closeAnn').click(() => {
        $('.dropAnnounce').hide('blind');
        $('#announce').show();
        $('#closeAnn').hide();

    })

    //Small menu button
    $('.smallMenu').click(() => {
        $('.filterCard').hide();
        $('.dropAnnounce').hide();
    })

    //Small add button
    $('.smallAdd').click(() => {
        $('#close').hide();
        $('.dropAnnounce').hide();

    })

    //X for close
    $('#close').click(() => {
        $('.filterCard').hide('blind');
        $('#filter').show();
        $('#close').hide();
    })

    //close filter when clicking topMenu buttons
    $('.newLink, .newLink2').click(() => {
        $('.filterCard').hide('blind');
        // $('#filter').show();
        $('#close').hide();

    })
    //delete link
    $('.cardDelete').click((event) => {
        let linkId = $(event.target).attr("data-linkId");
        const boardId = $('#boardName').attr("data-boardId");
        $.ajax({
            method: "DELETE",
            url: `/api/boards/${boardId}/links/${linkId}`,
            success: function (results) {
                location.reload();
            }
        });
    });

    //topic submit function
    $('.link').click((e) => {
        e.preventDefault();
        const id = $('#boardName').attr("data-boardId")
        var field = $('#title').val().trim();
        // console.log(field);
        let data = {
            name: field
        }
        $.post('/api/boards/' + id + '/tags/new', data, function (data) {
            console.log(data);
            location.reload();
        });
    })

    //post submit function
    $('.postButton').click((e) => {
        const id = $('#boardName').attr("data-boardId")
        e.preventDefault();
        var newTitle = $('#postTitle').val().trim();
        var newUrl = $('#postUrl').val().trim();
        var newDescription = $('#postDescription').val().trim();
        var newImageUrl = $('#postImgUrl').val().trim();

        let data = {
            title: newTitle,
            description: newDescription,
            url: newUrl,
            image_url: newImageUrl
        }
        let tags = [];
        //loop through checkboxes and push checked box values to array
        $('.postTags').find('input').each((index, element) => {
            if ($(element).is(":checked")) {
                tags.push($(element).val());
            }
        });

        data.tags = tags;

        $.post('/api/boards/' + id + '/links/new', data, function (data) {
            console.log(data);
            location.reload();
        });
    });

    //submit edit card data to DB
    $('.editButton').click((e) => {
        const boardId = $('#boardName').attr("data-boardId");
        let linkId = $(e.target).attr('data-linkid');
        let data = {
            title: $('#editTitle').val().trim(),
            url: $('#editUrl').val().trim(),
            description: $('#editDescription').val().trim(),
            image_url: $('#editImgUrl').val().trim()
        }

        let tags = [];
        //loop through checkboxes and push checked box values to array
        $('.editTags').find('input').each((index, element) => {
            if ($(element).is(":checked")) {
                tags.push($(element).val());
            }
        });
        if (tags.length > 0) {
            data.tags = tags;
        } else {
            data.tags = null;
        }

        //console.log(linkId, data);
        $.ajax({
            method: "PUT",
            url: `/api/boards/${boardId}/links/${linkId}`,
            data: data,
            success: (results) => {
                location.reload();
            }
        })
    });

    //populates edit modal with data
    $('.cardEdit').click((e) => {
        //grab card data
        let linkId = $(e.target).attr("data-linkid").trim();
        let title = $('#cardTitleLinkNum' + linkId).text().trim();
        let url = $('#cardUrlLinkNum' + linkId).text().trim();
        let desc = $('#cardDescLinkNum' + linkId).text().trim();
        let imgUrl = $('#cardImgLinkNum' + linkId).attr("src");
        if (imgUrl) {
            imgUrl = imgUrl.trim();
        }

        let currentTags = [];
        //grab current tags off of card
        $('.tags' + linkId).find('a').each((index, element) => {
            currentTags.push($(element).attr("data-tagid"));
        });

        //loop through checkboxes and check those that are currently tags of card
        $('.editTags').find('input').each((index, element) => {
            if (currentTags.indexOf($(element).val()) > -1) {
                $(element).prop("checked", true);
            } else {
                $(element).prop("checked", false);
            }
        });

        //populate edit modal fields with current card data
        $('#editTitle').val(title);
        $('#editUrl').val(url);
        $('#editDescription').val(desc);
        $('#editImgUrl').val(imgUrl);
        $('.editButton').attr("data-linkid", linkId);
    });

    //add a announcement
    $('.announcementButton').click((e) => {
        const id = $('#boardName').attr("data-boardId")
        e.preventDefault();
        var newMsg = $('#postMsg').val().trim();
        var newAuthor = $('#postAuthor').val().trim();
        console.log(newMsg);
        let data = {
            msg: newMsg,
            author: newAuthor
        }
        $.post('/api/boards/' + id + '/msgs/new', data, function (data) {
            console.log(data);
            location.reload();
        });
    });

    //edit message
    $('.editSubmit').click((e) => {
        const id = $('#boardName').attr("data-boardId")
        const linkId = $('.cardDescription').attr('data-descId')
        e.preventDefault();
        var updateMsg = $('#putMsg').val().trim();
            
        let data = {
            title: newTitle,
            description: newDescription,
            url: newUrl,
            image_url: newImageUrl
        }
        put('/api/boards/' + id + '/links/' + linkId, data, function (data) {
            console.log(data);
            location.reload();
        });
    });

    $('#postUrl').change(function (event) {
        let urlInput = event.target.value;
        if (!urlInput.startsWith('http')) {
            urlInput = 'http://' + urlInput;
            //$('#postUrl').val(urlInput);
        }
        if (urlInput !== urlField) {
            urlField = urlInput;
            // console.log(urlField);
            $.post('/api/scrape', {
                url: urlField
            }, function (data) {
                // console.log(data);
                $('#postTitle').val(data.title);
                $('#postDescription').val(data.description);
                $('#postUrl').val(data.url);
                $('#postImgUrl').val(data.image);
            });
        }
    });
}) //end document.ready