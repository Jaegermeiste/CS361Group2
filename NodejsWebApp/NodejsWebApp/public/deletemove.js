function deleteMove(id){
    $.ajax({
        url: '/moves/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
