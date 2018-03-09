function deleteAnomaly(id){
    $.ajax({
        url: '/anomalies/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
