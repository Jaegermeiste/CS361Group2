function deleteType(id){
    $.ajax({
        url: '/types/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
