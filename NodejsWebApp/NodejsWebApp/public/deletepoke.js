function deletePoke(id){
    $.ajax({
        url: '/pokemon/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
