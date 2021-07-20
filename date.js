module.exports.getdate=function(){
var today = new Date();
    var option = {
        weekday:"long",
        year : "numeric",
        month: 'long',
        day:'numeric'
    };

    var Day =today.toLocaleDateString("en-US", option);
   
    return Day;
}

exports.getday = function(){
    var today = new Date();
    var option={
        weekday:"long"
    }
    return today.toLocaleDateString("en-US", option);
}