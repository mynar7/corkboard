$('document').ready(() => {
    console.log('ready')


    //filter buttons
    $('#filter').click(() => {
        $('.filterCard').toggle('blind');
    })

    //show/hide announcements
    $('#announce').click(() => {
        $('.sidebar').toggle('blind');
    })

    //Small menu button
    $('.smallMenu').click(() => {
        $('.filterCard').hide();
        $('.sidebar').hide();
    })

    //Small add button
    $('.smallAdd').click(() => {
        $('.filterCard').hide();
        $('.sidebar').hide();
    })

    //topic submit function
    $('.link').click((e) => {
        const id = $('#boardName').attr("data-boardId")
        e.preventDefault();
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



















})