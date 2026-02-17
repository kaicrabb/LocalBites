# LocalBites
### Summary of Project Plans
This is a cross-platform mobile application (iOS & Android) and website where users can view local restaurants near them, as well as give these local restaurants reviews. The end goal of the app is to show the user a map which displays their location (when permission is given) to show local restaurants near them, as well as a page listing the local restaurants (useful if the user denies location permission or prefers a list). From here they can filter restaurants on favorites, price point, type of food, rating, etc. The user will be able to leave reviews on any of the restaurants they’ve been to. The user will also be able to scroll through videos of restaurants near them. The user will have a profile page, which will display reviews written by the user, saved restaurants, and any personal information tied to a user account. 

### Planned Tools
- Backend: [Express](https://expressjs.com/)
- Frontend: [Expo](https://expo.dev/solutions/iteration-speed?utm_source=google&utm_medium=cpc&utm_campaign=30329111-App%20Quality%20with%20EAS%20Update&utm_content=update_creative_a&utm_term=expo%20app%20development&utm_campaign=Iteration+Speed&utm_source=adwords&utm_medium=ppc&hsa_acc=6617584976&hsa_cam=23330869816&hsa_grp=190613512938&hsa_ad=786713430636&hsa_src=g&hsa_tgt=kwd-473484702429&hsa_kw=expo%20app%20development&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23330869816&gbraid=0AAAAApZvKwEkagzuUibxU1ShBZbtnSvQe&gclid=CjwKCAiAssfLBhBDEiwAcLpwfn1tnwozQl9GOqqn2U1iaTOdKU8lHxRLLy6BbX-u4uRjh-aE2uObkhoCYFEQAvD_BwE)
- Database: [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)


### Starting expo-client
- Access the frontend by running ```cd expo-client```
- If required modules are not installed on your system run ```npm install```
    - expo
    - ```npx expo install react-native-maps``` (for our map functionality)
- To start the frontend run ```npx expo start --tunnel```

### Starting server
- Access the backend by running ```cd server``` 
- If required modules are not installed on your system run ```npm install```
    - express, cors, jsonwebtoken, body-parser, mongoose, bcryptjs, expo-image, expo-image-picker
- To start the server run ```node server.js```


### Backend File Structure
server/

│-- server.js           # entry point

│-- config/             # config files, e.g., db.js

│   --- db.js

│-- models/             # Mongoose models

│   --- user.js

│   --- restaurant.js

│-- routes/             # Express routes, e.g., authenticate.js

│   --- example_user.js




|Task|Team Members|Time Frame|
|---|---|---|
|Authentication| Chris, Kai, Brooklen|Feb 10 - Feb 24|
|Google Api Setup(pull)| Logan|Feb 10 - Feb 24|
|CSS/App Design| Hayden|Feb 10 - Feb 24|
|Google Api Map integration|||
|Restaurants Page|||
|Search and Filters |||
|Reels|||
