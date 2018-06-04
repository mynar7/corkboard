let urlField;

$('document').ready(() => {
    console.log('ready')

    //filter buttons
    $('#filter').click(() => {
        $('.filterCard').toggle('blind');
        $('#close').show();
        $('#filter').hide();
        $('.dropAnnounce').hide('blind');


    })

    //show/hide announcements
    $('#announce').click(() => {
        $('.dropAnnounce').show('blind');
        $('#announce').hide();
        $('#closeAnn').show();
        $('#close').hide();
        $('#filter').show();


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
        $('.filterCard').hide();
        $('#close').hide();
        $('#filter').show();
        $('.dropAnnounce').hide();

    })

    //X for close
    $('#close').click(() => {
        $('.filterCard').hide('blind');
        $('#filter').show();
        $('#close').hide();
    })

    //close filter when clicking topMenu buttons
    $('.newLink').click(() => {
        $('.filterCard').hide('blind');
        $('#filter').show();
        $('#close').hide();

    })

    //topic submit function
    $('.link').click((e) => {
        e.preventDefault();
        const id = $('#boardName').attr("data-boardId")
        var field = $('#title').val().trim();
        console.log(field);
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
        console.log(newTitle);
        let data = {
            title: newTitle,
            description: newDescription,
            url: newUrl,
            image_url: newImageUrl
        }
        $.post('/api/boards/' + id + '/links/new', data, function (data) {
            console.log(data);
            location.reload();
        });
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
        const msgId = $('.cardDescription').attr('data-descId')
        e.preventDefault();
        var updateMsg = $('#putMsg').val().trim();
        //var updateAuthor = $('#putAuthor').val().trim();

        let data = {
            msg: updateMsg,
            //author: updateAuthor
        }
        $.put('/api/boards/' + id + '/msgs/' + id.description, data, function (data) {
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
            console.log(urlField);
            $.post('/api/scrape', {
                url: urlField
            }, function (data) {
                console.log(data);
                $('#postTitle').val(data.title);
                $('#postDescription').val(data.description);
                $('#postUrl').val(data.url);
                $('#postImgUrl').val(data.image);
            });
        }
    });
}) //end document.ready