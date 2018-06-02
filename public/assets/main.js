$('document').ready(()=>{
    console.log('ready')

    //filter buttons
    $('#filter').click(()=>{
        $('.filterCard').toggle('blind');
    })

    // btn newLink: = create new route-------------------------------------------
    //topic submit function
    $('.link').click((e)=>{
       const id =$('#boardName').attr("data-boardId")
       e.preventDefault();
       var field = $('#title').val().trim();
       console.log(field);
       let data = {
           name: field
       }
       $.post('/api/boards/'+id+'/tags/new', data, function(data){
           console.log(data);
           location.reload();
       });
    })
        
//----------------------------------------------------------------

    //show/hide announcements
    $('#announce').click(()=>{
        $('.sidebar').toggle('blind');
    })





















});