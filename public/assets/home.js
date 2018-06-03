$('document').ready(() => {
    console.log('ready')

    //createboard function
    $('#createBoard').click((e) => {
        e.preventDefault();
        const id = $('#boardName');
        const email = $('#ownerEmail');
        console.log(id);
        console.log(email);

        var field = $('#boardName').val().trim();
        console.log(field);
        let data = {
            name: field
        }
        $.post("/api/boards/new", data, function (data) {
            console.log(data);
            // location.reload();
        });
    });
});