$(function(){
	invokeAPIMethod("randomvideo", function(result) {
		$(".player").YTPlayer({videoURL:result.url, startAt:result.startAt});
	});
});