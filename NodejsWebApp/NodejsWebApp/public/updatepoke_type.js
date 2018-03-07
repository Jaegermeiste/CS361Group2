function updatePoke_Type(id){
    $.ajax({
        url: '/pokemon_types/' + id,
        type: 'PUT',
        data: $('#update-poke_type').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
