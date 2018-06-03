$('document').ready(() => {

    //createboard function
    $('#createBoard').click((e) => {
        e.preventDefault();
        let boardName = $('#boardName').val().trim();
        let email = $('#ownerEmail').val().trim();
        let emailRegex = /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$)/;
        if(boardName &&  emailRegex.test(email) ) {
            $('#boardName').val("");
            $('#ownerEmail').val("");
            let data = {
                name: boardName
            }
            $.post("/api/boards/new", data, function (data) {
                if(data.errors) return console.log(data);
                $('#modalInvite').html(`Your Board URL is: <a href="${location.href}boards/${data.id}">
                ${location.href}boards/${data.id}<a>`);

                //code for emailing an invite
                let mailData = {
                    to: email,
                    subject: "Welcome to Corkboard",
                    bodyText: 
                    `Your Board's name is: ${data.name}
                    Your access url is: ${location.href}boards/${data.id}`,
                    htmlText: 
                    `<h1>Welcome to corkboard!</h1>
                    <h3>Your board name is: ${data.name}</h3>
                    Your Board URL is: <a href="${location.href}boards/${data.id}">
                    ${location.href}boards/${data.id}<a>
                    <p>Please bookmark your board page and save this email for reference</p>`,
                };
                //mail(req.body.to, req.body.subject, req.body.bodyText, req.body.htmlText);
                $.post("/api/mail", mailData, function(data2) {
                    $('#inviteModal').modal();
                });
            });
        } else {
            $('#errModalText').html('Must provide Board Name and valid Email address');
            $('#errorModal').modal();
        }
    });
});