function updateType(id){
    $.ajax({
        url: '/types/' + id,
        type: 'PUT',
        data: $('#update-type').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
