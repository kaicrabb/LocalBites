# LocalBites
### Summary of Project Goal
This is a cross-platform mobile application (iOS & Android) and website where users can view local restaurants near them, as well as give these local restaurants reviews. The end goal of the app is to show the user a map which displays their location (when permission is given) to show local restaurants near them, as well as a page listing the local restaurants. From here they can filter restaurants on favorites, price point, type of food, rating, etc. The user will be able to leave reviews on any of the restaurants they’ve been to. The user will also be able to scroll through videos of restaurants near them. The user will have a profile page, which will display reviews written by the user, saved restaurants, and any personal information tied to a user account. 

### Planned Tools
- Backend: [Express](https://expressjs.com/)
- Frontend: [Expo](https://expo.dev/solutions/iteration-speed?utm_source=google&utm_medium=cpc&utm_campaign=30329111-App%20Quality%20with%20EAS%20Update&utm_content=update_creative_a&utm_term=expo%20app%20development&utm_campaign=Iteration+Speed&utm_source=adwords&utm_medium=ppc&hsa_acc=6617584976&hsa_cam=23330869816&hsa_grp=190613512938&hsa_ad=786713430636&hsa_src=g&hsa_tgt=kwd-473484702429&hsa_kw=expo%20app%20development&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23330869816&gbraid=0AAAAApZvKwEkagzuUibxU1ShBZbtnSvQe&gclid=CjwKCAiAssfLBhBDEiwAcLpwfn1tnwozQl9GOqqn2U1iaTOdKU8lHxRLLy6BbX-u4uRjh-aE2uObkhoCYFEQAvD_BwE)
- Database: [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- Reels Database: [Firebase](https://firebase.google.com/)


### Starting expo-client
- Access the frontend by running ```cd expo-client```
- If required modules are not installed on your system run ```npm install```
    - expo
    - ```npx expo install``` (should hopefully give all required expo packages)
- To start the frontend run ```npx expo start --tunnel```

### Starting server
- Access the backend by running ```cd server``` 
- If required modules are not installed on your system run ```npm install```
- To start the server run ```node server.js```

### File Structure


    ├── expo-client/
    
    │   └── app/
    
    │       ├── admin/
    
    │       │   ├── banUser.tsx   //admin page for banning users
    
    │       │   ├── manageContent.tsx //admin page for managing user uploaded content(WIP)
    
    │       │   ├── managePlaces.tsx //admin page for managing stored restaurants
    
    │       │   ├── manageReviews.tsx //admin page for managing reviews of restaurants
    
    │       │   ├── manageUsers.tsx //admin page for managing users (bans, unbans, account info)
    
    │       │   ├── unbanUser.tsx //admin page to unban users
    
    │       │   └── viewUsers.tsx //admin page to view all users and their information
    
    │       ├── main/
    
    │       │   ├── layout.tsx       //sets redirects for app
    
    │       │   ├── admin.tsx       //admin control page, only visible if user is an admin
    
    │       │   ├── home.tsx        //home page, contains most of our main functionalities
    
    │       │   ├── profile.tsx       //page to view user info
    
    │       │   ├── reels.tsx          //page to watch reels uploaded by others
    
    │       │   └── upload.tsx       //page to upload reels
    
    │       ├── button.tsx       // a button format for the settings page
    
    │       ├── changePassword.tsx       //change password page
    
    │       ├── deleteAccount.tsx        //delete account page
    
    │       ├── deleteReview.tsx        //module for deleting reviews
    
    │       ├── fetchUser.tsx       //module with various user grabbing functions
    
    │       ├── ImageViewer.tsx       //used to display an image in settings menu
    
    │       ├── index.tsx          //provides links to login or signup
    
    │       ├── login.tsx           //login page
    
    │       ├── review.tsx        //module for creating reviews
    
    │       ├── settings.tsx      //settings page, delete account, change password, etc
    
    │       ├── signup.tsx       //signup page
    
    │       └── config/
    
    │           └── firebaseConfig.tsx       //connection to firebase provided by firebase
    
    ├── server/
    
    │   ├── Config/
    
    │   │   └── db.js               //builds database connection for mongo
    
    │   ├── Models/
    
    │   │   ├── bans.js             //stores user ban information
    
    │   │   ├── places.js           //stores restaurant information
    
    │   │   ├── reviews.js          //stores user reviews of restaurants
    
    │   │   └── user.js             //stores user information
    
    │   ├── Routes/
    
    │   │   ├── Admin/
    
    │   │   │   ├── admin_ban_user_account.js    //admin option to ban a users account
    
    │   │   │   ├── admin_delete_review.js       //admin option to delete users reviews
    
    │   │   │   ├── admin_delete_user_account.js //admin option to delete a users account
    
    │   │   │   ├── admin_get_all_bans.js        //admin option to get all banned users from database
    
    │   │   │   ├── admin_get_all_restaurants.js //admin option to get all restaurants from database
    
    │   │   │   ├── admin_get_all_users.js       //admin option to get all users info from database
    
    │   │   │   ├── admin_remove_restaurant.js   //admin option to delete restaurants from database
    
    │   │   │   └── admin_unban_user_account.js  //admin option to unban user accounts
    
    │   │   ├── Authentication/
    
    │   │   │   ├── authtoken.js                 //middleware for jwt, checks proper login
    
    │   │   │   ├── change_password.js           //user option to change passwords
    
    │   │   │   ├── delete_account.js            //user option to delete their account
    
    │   │   │   ├── firebase_admin.js            //serverside administrative rights for firebase
    
    │   │   │   ├── firebase_token.js            //gives users a token to access firebase resources
    
    │   │   │   ├── login.js                     //logs users in, gives them a jwt token
    
    │   │   │   └── signup.js                    //creates accounts, runs login after account details saved
    
    │   │   ├── Google_Api/
    
    │   │   │   ├── get_location.js              //reverse geocodes coordinates into town names
    
    │   │   │   ├── http_search_places.js        //uses http requests to Google Places API to get nearby restaurants
    
    │   │   │   ├── nearby_restaurants.js        //gets the basic details of nearby restaurants stored in the database
    
    │   │   │   ├── restaurant_details.js          //gets all the details for a specific restaurant
    
    │   │   │   └── search_places.js               //original Google Places API code (Deprecated)
    
    │   │   ├── Reviews/
    
    │   │   │   ├── add_reviews.js        //adds a review to the database
    
    │   │   │   ├── delete_reviews.js       //deletes a review from the database
    
    │   │   │   └── get_reviews.js         //pulls reviews by userId or restuarantId
    
    │   │   ├── example_review.js    //testing file for putting a review in database
    
    │   │   ├── example_user.js      //testing file for putting a user in database
    
    │   │   └── user_info            //pulls the info for logged in user
    
    │   └── server.js            //runs all server setup code
    
    ├── .gitignore
    
    └── README.md
    
