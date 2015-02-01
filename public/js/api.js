var API_DOMAIN = "http://flyover-am.herokuapp.com/"
if (document.location.hostname == "localhost")
{
	API_DOMAIN = "http://localhost:3000/"
}

function invokeAPIMethod(methodName, callback)
{
	$.ajax({
	  url: API_DOMAIN + methodName,
	  type: "GET",
	  dataType: "json"
	}).done(callback);
}