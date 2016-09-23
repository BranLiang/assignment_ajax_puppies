var APP = APP || {};

APP.controller = (function () {
	"use strict"
	var stub = {};

	stub.init = function () {
		refreshListener();
		submitListener();
		adoptListener();
		statusNotification();
	};

	var statusNotification = function () {
		$(document).ajaxStart(function (event, xhr, settings) {
			waitingNotification();
			var myTimeoutNotification = setTimeout(function () {
				console.log(event);
				$(".log").text("Sorry it's taking forever...").show();
			}, 1000);

			$(document).ajaxError(function () {
				clearTimeout(myTimeoutNotification);
				errorNotification();
			});

			$(document).ajaxSuccess(function (event, xhr, settings) {
				clearTimeout(myTimeoutNotification);
				console.log(event);
				console.log(xhr);
				console.log(settings);
				successNotification();
			});
		});
	};

	var successNotification = function () {
		$(".log").text("success").css("background-color", "green").show();
		setTimeout(function () {
			$(".log").fadeOut(500);
		}, 2000)
	};

	var errorNotification = function () {
		$(".log").text("Error").css("background-color", "red").show();
		setTimeout(function () {
			$(".log").fadeOut(500);
		}, 2000)
	};

	var waitingNotification = function () {
		$(".log").text("Waiting...").css("background-color", "yellow").show();
	};

	// var myTimeoutNotification = setTimeout(function () {
	// 	$(".log").text("Sorry it's taking forever...").show();
	// }, 1000);

	var adoptListener = function () {
		$('ul').on('click', '.adopt', function (event) {
			event.preventDefault();
			var id = $(event.target).attr("puppyid");
			adoptPuppy(id, removeList)
		});
	};

	var adoptPuppy = function (id, removeList) {
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies/" + id + ".json",
			method: "delete",
			success: function (puppy) {
				// console.log(puppy);
				removeList(puppy);
			},
		});
	};

	var removeList = function (puppy) {
		$("li[objectid='" + puppy.id + "']").remove();
	};

	var submitListener = function () {
		$("form").submit(function (event) {
			event.preventDefault();
			var $el = $(event.target);
			createPuppy($el, addToList, displayError);
		});
	};

	var createPuppy = function ($form, addToList, displayError) {
		var formData = $form.serializeArray();
		var sendData = {
			name: formData[0].value,
			breed_id: Number(formData[1].value),
		};
		$.ajax({
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			method: "post",
			data: JSON.stringify(sendData),
			dataType: "json",
			contentType: "application/json",
			success: function (resultObjects) {
				// console.log(resultObjects);
				addToList(resultObjects);
			},
			error: function (response) {
				// console.log(response);
				displayError(response);
			},
		});
	};

	var addToList = function (resultObjects) {
		var $puppy = $("<li></li>").html(resultObjects.name + "(" + resultObjects.breed_id + ")");
		$('ul').prepend($puppy);
	};

	var displayError = function (response) {
		var $response = $("<p></p>").html(response.responseText);
		$("header").prepend($response);
	};

	var refreshListener = function () {
		$("a[name='refresh']").on('click', function (event) {
			event.preventDefault();
			getPuppies(listPuppies);
		});
	};

	var getPuppies = function (callback) {
		$.ajax({
			method: "GET",
			url: "https://ajax-puppies.herokuapp.com/puppies.json",
			success: function (data) {
				// console.log(data);
				callback(data);
			},
			error: function (xhr, error) {
				// console.log(error);
			}
		});
	};

	var listPuppies = function (objects) {
		for (var i = objects.length - 1; i >= 0; i--) {
			var $puppy = $("<li></li>").attr("objectid", objects[i].id).html(objects[i].name + "(" + objects[i].breed.name + ")" + "<a href='#' class='adopt' puppyid=" + objects[i].id + ">Adopt</a>");
			$('ul').append($puppy);
		};
	};


	return stub;
})();

$(document).ready(function () {
	APP.controller.init();
});
