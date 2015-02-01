$(function(){
		console.log("INVOKING RANDOM VIDEO")
	invokeAPIMethod("randomvideo", function(result) {
		console.log("GOT RANDOM VIDEO", result)
		$(".player").YTPlayer({videoURL:result.url});
	});
});