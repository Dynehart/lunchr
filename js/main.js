/* This code will check cookies to see if device has already voted */

if ($.cookie("voted") == "true")
{
  document.getElementById('submit').disabled = true;
  document.getElementById('submit').innerHTML = "You've already voted";
}

/* Handle iOS 10's insane decision to cripple web apps via accessiblity changes 

node.addEventListener('gesturestart', function (e) {
    e.preventDefault();
})

*/

$('#cafe_1a, #cafe_2a, #cafe_3a, #cafe_4a, #cafe_5a, #cafe_6a, #cafe_7a, #cafe_8a').click(function()
{
  $(this).toggleClass('disabled')
  $(this).toggleClass('secondary')
  if ($(this).hasClass('disabled')){
    $(this).parent()[0].id = '';
  } else {
    $(this).parent()[0].id = $(this).parent().children()[0].id.substr(0,6);
  }
})

$(function()
{
  $("#sorted_options").sortable().disableSelection();
});

/* serialize data then send it to server */

function submitVote()
{
  //Serializes the sortable's item ids into a form/ajax submittable string
  var rankedChoices = $("#sorted_options").sortable("serialize", { key:"cafe" });

  //prepend with a unique id before submission

  //Create a unique, non-permanent, private user id:
  var PUID = String(Math.floor(Math.random()*10**16)); //Multiply by 10^16 and floor to create a 16 character whole number
  //prepend
  rankedChoices = ('puid=').concat(PUID, '&', rankedChoices)


  postData(rankedChoices);

  document.getElementById('submit').disabled = true;
  document.getElementById('submit').innerHTML = "Thanks";


}

/* Send data to server and if successful set cookie */

function postData(rankedObject) {
  console.log(rankedObject)
  $.ajax({
    type: "POST",
    url: './main.py',
    data: rankedChoices,
    success: setCookie(),
    error: alert("Vote not recorded, please refresh and try again")
  })
}

/* Set cookies that expire the next day indicating user has voted */

function setCookie()
{
  var currentTime = new Date()
  var month = currentTime.getMonth()
  var day = currentTime.getDate()
  var year = currentTime.getFullYear()
  var date = new Date(year, month, day+1, 0, 0, 0, 0)
  $.cookie("voted", true, {expires: date})
}