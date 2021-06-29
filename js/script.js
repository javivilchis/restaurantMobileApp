/* 
## Js script first take on trying to get the APIs to work. 
√ applied travel advisor api.  
. create a switch statement to call different methods from a single function. 
. apply an id to generate page template from a function. 
. apply google maps to the details page. 
. add some sort of backend distro for contact form.
*/
$(document).foundation(); // use to start foundation js utilities
//homeRestaurantList();
/*var nutrition = function(){
     fetch("",{
     "method": "GET",
     "headers" : {
          "x-app-id": "", 
          "x-app-key": "",
          "x-remote-user-id" : ""
          }
     })
     .then( response => {

     })
     .then( data => {

     })
     .catch(err => {
          console.error(err);
     });
}*/
// Treating the form
var form = document.getElementById("restaurant-form");
form.addEventListener("submit", function(e){
     e.preventDefault();
     var city = form.elements['city'].value;
     var cuisine = form.elements['cuisine'].value;
     //console.log(city+" " + cuisine);
     locationSearch(city,cuisine);
});
var locationSearch = function(city,cuisine){
     fetch("https://travel-advisor.p.rapidapi.com/locations/auto-complete?query="+ city+"&lang=en_US&units=mi", {
          "method": "GET",
          "headers": {
               "x-rapidapi-key": "b9b5183d85msh693e7ff1575baf9p1c92abjsnf938cef3869b",
               "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
          }
     })
     .then(response => {
          console.log(response.statusText);
          if(!response.ok){
               throw Error("ERROR with the response from API");
          }
          return response.json();
     })
     .then(data => {
          console.log(data);
     })
     .catch(err => {
          console.error(err);
     });
}
//searched only for location ID generated for the Irving TX area.
// I hope nobody steals my key that would suck. I wish we could protect them.
var homeRestaurantList = function(){
     fetch("https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=56032&restaurant_tagcategory=10591&restaurant_tagcategory_standalone=10591&currency=USD&lunit=mi&limit=5&open_now=false&lang=en_US", {
          "method": "GET",
          "headers": {
               "x-rapidapi-key": "b9b5183d85msh693e7ff1575baf9p1c92abjsnf938cef3869b",
               "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
          }
     })
     .then(response => {
          console.log(response.statusText);
          if(!response.ok){
               throw Error("ERROR with the response from API");
          }
          return response.json();
     })
     .then(data => {
          console.log(data.data);
     
          var restaurantName = data.data
          .map(restaurant => {
               console.log(restaurant.name);
               if(restaurant.name != undefined){
               return `
               <div class="media-object" data-animate="slide-in-down">
               <div class="media-object-section">
               <img class="thumbnail" src="${pictures(restaurant.photo)}">
               </div>
               <div class="media-object-section">
               <h5>${restaurant.name}</h5>
               <p><span class="label primary">${restaurant.parent_display_name}</span>
               ${restaurant.is_closed ? '<span class="label success">Open</span>': '<span class="label success">Open</span>'}
               </p>
               <p>Address: ${restaurant.address}</p>
               <p>${restaurant.description}</p>
               <p>Restaurant Website: <a href="${restaurant.web_url}">${restaurant.website}</a><br>
               <i class="fas fa-phone"></i> ${restaurant.phone}<br>
               Price Level: ${restaurant.price_level}
               <p>
               <p>Cuisine: ${cuisine(restaurant.cuisine)}</p>
               </div>
          </div>`
               };
               
          }).join("");
          document.querySelector("#restaurants").insertAdjacentHTML("afterbegin",restaurantName);
     })
     .catch(err => {
          console.error(err);
     });
}


var cuisine = function(cuisine){
     return `
     ${cuisine.map(function(food){
          return `
          <span class="label primary">${food.name}</span> 
          `
     }).join('')}
     `
}

var pictures = function(pictures){
      return pictures.images['small'].url;
}

// google map inclusion researched and applied by jv.
     var map;
     function initMap() {
          var mapCenter = new google.maps.LatLng(47.6145, -122.3418); //Google map Coordinates
          map = new google.maps.Map($("#map")[0], {
               center: mapCenter,
               zoom: 8
               });
     }
  
  $("#find_btn").click(function (){
    if ("geolocation" in navigator){ //this line check to see if geolocation is in the DOM.
        navigator.geolocation.getCurrentPosition(function(position){ //this line gets current position
            infoWindow = new google.maps.InfoWindow({map: map}); //this is setting the information window within the map
            var pos = {lat: position.coords.latitude, lng: position.coords.longitude}; //this sets the lat lon object
            infoWindow.setPosition(pos); //this writes to the info window your lat lon and on the second line it tells the viewer it found their lat lon
            infoWindow.setContent("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
            map.panTo(pos); //this pans the map over to the location.
          });
      }else{
        console.log("Browser doesn't support geolocation!");
    }
  });

