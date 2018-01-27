# :round_pushpin: dePINdable
### Microsoft's Code.Fun.Do Project by [Sahil Khokhar](https://github.com/sahil505) & [Deepak Korku](https://github.com/Korku02)
---
dePINdable gives you trustworthy travel recommendations from your 'known' facebook friends. See which all places your friends have visited in a particular country or a city. View their recommendations & reviews of these exciting places to check out whenever you visit a new city or country.

This app also gives recommendations of the nearby places (of same category) that match the recommendation given by your friend. We have also integrated Zomato food/restaurant services recommendations in our app, so basically if the recommendation given by the user is of the category food then you can see places of food nearby the recommendation given by your friend. You can also read the reviews of the of that place that users have given on the Zomato app.
## Technologies Used
- AngularJS
- Django
- Facebook Login & Graph API.
- Google Maps & Places API.
- Zomato API
## Why this application?
- Technology/Internet: Connecting people to resources or providing people with the information they require in the most efficient and best possible way. To access any information or to communicate with anyone from anywhere in the world in the most efficient way.
- Imagine you are visiting a new city or a new country and don't know what all you can explore in the city or the country. This application or service will come in handy to gain trustworthy recommendations given by your facebook friends who have already visited the city or the country and have pin marked the locations using their profile in the application.
- Integration of already existing services (such as Zomato: For restaurants/food, TripAdvisor: For things to do in the city you are currently in) in a single place making it way easier for user to search and gain the required information.
## Features implemented
- Used Facebook to login the user.
- Used AngularJS to build the framework.
- Used Django to manage the database in the backend.
- Used Facebook Graph API to extract the entire user graph (info, location, friends etc.).
- Used Google Maps API to allow user to drop a pin and mark a location.
- User was able to submit the rating and feedback based on his or her pinned locations.
- Provided functionality to the user to view the pinned location of friends with the feedback on the google maps.
- Used Zomato API to give recommendations to the user regarding food restaurants.
- Used Ranking algorithm to show most relevant recommendations.
- This application is completely responsive and good to go for production setup.
## Functionality / Features
- Extracting connections through Facebook: Connectivity.
- Real time Location Check-in/tagging Service.
- Reverse Geocoding.
- Trustworthy recommendations by Facebook Friends.
- Search by city or country you are about to visit.
- Other Recommendation based on tagged location by a friend.
## Future Goals
- Implement some sort of friend tagging mechanism so that a user can get notified instantly about the location that his friend has tagged/recommended him.
- Integrate all popular travel/food recommendation APIs.
- Use other services to login such as Instagram, Twitter, Outlook/Gmail to make the application more universal.
- Allow users to share their pinned locations on social media such as facebook, Instagram etc.
- Use Machine learning to understand the types of places / things that user loves to do more often or what kind of food taste an individual has and then recommend locations to users accordingly.
- Currently there is no service provided by Google Places API to submit a review from the application. Once they include this feature in their API, it can be a huge upgrade for this application.
