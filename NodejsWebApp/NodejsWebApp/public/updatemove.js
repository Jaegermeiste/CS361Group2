function updateMove(id){
    $.ajax({
        url: '/moves/' + id,
        type: 'PUT',
        data: $('#update-move').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
