function deleteAnomaly(id){
    $.ajax({
        url: '/anomalies-delete?id=' + id,
        type: 'GET',
        success: function(result){
            window.location.reload(true);
        }
    })
};