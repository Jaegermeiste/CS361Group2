function updatePoke_Location(id){
    $.ajax({
        url: '/pokemon_locations/' + id,
        type: 'PUT',
        data: $('#update-poke_location').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
