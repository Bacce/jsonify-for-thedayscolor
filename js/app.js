var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, apiCall) {
	$scope.getColours = function(){
		apiCall.getPageContent().then(function (data){
			var pageContent = data.data;
			var result = {};
			result.data = [];
			var resultPos = 0;
			var previousResult = 0;

			while (resultPos > -1) {
				//Right colour
				resultPos = pageContent.indexOf('<div class="swatch_content"', previousResult+1);
				resultPosEnd = pageContent.indexOf('>', resultPos+1);
				var tempColour1 = pageContent.substring(resultPos, resultPosEnd+1);
				if(tempColour1=="<!doctype html>"){
					continue;
				}
				var colourRight = /#([0-9a-f]{6}|[0-9a-f]{3})/ig.exec(tempColour1);
				previousResult = resultPos;

				//Sub colours
				var subResultPos = resultPos;
				var subColours = [];
				for(var i=0; i<5; i++){
					var subResultPos = pageContent.indexOf('<div class="swatch"', previousSubResult + 1);
					var subResultPosEnd = pageContent.indexOf('>', subResultPos + 1);

					var tempColour2 = pageContent.substring(subResultPos, subResultPosEnd+1)
					var toPush = /#([0-9a-f]{6}|[0-9a-f]{3})/ig.exec(tempColour2);
					if(toPush[0] != null){
						subColours.push(toPush[0]);
					}
					var previousSubResult = subResultPos;
				}

				//Left Colour
				var resultLeftPos = pageContent.indexOf('<div class="swatch_content_left"', previousSubResult + 1);
				var resultLeftPosEnd = pageContent.indexOf('>', resultLeftPos+1);
				
				var tempColour3 = pageContent.substring(resultLeftPos, resultLeftPosEnd+1);
				var colourLeft = /#([0-9a-f]{6}|[0-9a-f]{3})/ig.exec(tempColour3);

				//put the result together
				var colourObject = {"rightColor": colourRight[0], "subColours": subColours, "leftColor": colourLeft[0]};
				result.data.push(colourObject);
			}
			console.log(result);
			
			//send to api, save to file
			apiCall.saveToJson(result);
		});
	}
});

app.factory('apiCall', function ($http, $q) {
	var apiCall = {
		getPageContent: function () {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: 'api/getcontent.php'
			})
			.success(function (data, status, headers, config){
				if(data.status == "OK"){deferred.resolve(data);}
				else{console.log("data error");}
			})
			.error(function (data, status, headers, config) {
				console.error('request failed');
			});
			return deferred.promise;
		},
		saveToJson: function (res) {
			var deferred = $q.defer();
			$http({
				method: "POST",
				url: 'api/savetojson.php',
				data: res
			})
			.success(function (data, status, headers, config){
				deferred.resolve(data);
				
			});
			return deferred.promise;
		}
	}
	return apiCall;
});