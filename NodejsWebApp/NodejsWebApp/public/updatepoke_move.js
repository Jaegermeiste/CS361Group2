function updatePoke_Move(id){
    $.ajax({
        url: '/pokemon_moves/' + id,
        type: 'PUT',
        data: $('#update-poke_move').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
