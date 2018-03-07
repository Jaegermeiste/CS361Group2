function deletePoke_Move(id){
    $.ajax({
        url: '/pokemon_moves/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
