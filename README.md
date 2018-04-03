# Udacity Neighbourhood Map - Sundharesan

This is as neighborhood map application that has different markers for the different places. If you want to handle a review comments for a place, you can click on the markers to find the one. Review Comments are populating from Foursquare API.

## Technologies Used

1. jQuery

2. Knockout JS

3. HTML & CSS

4. Google API

5. Foursquare API

## API used

Google Map API is used to get the map functionality based on latitude and longitude. For using Google API you need your own API Key.

Foursquare API is used to get the *venueid* based on latitude and longitude. Right now it is hardcoded in *main.js*. Based on *venueid* I'm getting recent comments of the places. You need your own Foursquare API Client Id and Client Secret. You can get this from [here](https://developer.foursquare.com/).

## Set Up

1. Clone the project from respository.

2. Open *script.js* and update Foursquare API with your *client_id* and *client_secret* in line number 29

3. Open *index.html* and update Google API key in the script tag src attribute before body tag closure in line number 44.

4. Now Open *index.html* in any browser.