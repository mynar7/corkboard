$('document').ready(()=>{
    console.log('ready')

    //filter buttons
    $('#filter').click(()=>{
        $('#filterDropdown').toggle('blind');
    })


    //show/hide announcements
    $('#announce').click(()=>{
        $('.sidebar').toggle('blind');
    })





















});