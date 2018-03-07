function updatePoke(id){
    $.ajax({
        url: '/pokemon/' + id,
        type: 'PUT',
        data: $('#update-poke').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
