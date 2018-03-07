function deletePoke_Type(id){
    $.ajax({
        url: '/pokemon_types/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
