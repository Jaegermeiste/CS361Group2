function deletePoke_Location(id){
    $.ajax({
        url: '/pokemon_locations/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
