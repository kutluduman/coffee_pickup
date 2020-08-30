The Lighthouse Coffee House
=========

##  Project Description

 Our midterm project for the July 2020 Lighthouse Labs Midterm. It is a order for pickup website for a fictional Cafe. Allowing users to order menu items for pickup and recieve a text message confirmation (it also texts the store owner that they have a new order).

 It also provides basic admin functionality for the cafe owner to create, update, and delete menu items, as well as view currently active orders and mark them as ready for pickup or delayed which also sends a message to the customer.

## How to Setup
1. Create the .env by using .env.example as reference: cp .env.example .env
2. Update the .env file with your correct local information
- username: labber
- password: labber
- database: midterm
- Add relavent twillio credientials  as well

3. Install dependencies: 
``` 
npm i 
```
4. Reset database: npm run db:reset
5. Check the db folder to see what gets created and seeded in the SDB
6. Build TaildwindCSS file run command:
  ```javascript
    npx tailwindcss build ./styles/styles.css -o ./public/styles/output.css
   ````
7. Run Gulp to process css with PostCSS and drag output.css from ./dest into ./public/styles/
```
gulp css
```

8. Run the server: 
```javacript
npm run local
 ```
 9. Visit localhost:/home

Run the server: npm run local
Note: nodemon is used, so you should not have to restart your server
Visit http://localhost:8080/.

## Available Routes

- localhost:8080/login
  - allows a user to login
- localhost:8080/register
  - allows a user to register a account
- localhost:8080/home 
  - home page / menu for both admin & user

### Admin Routes

- localhost:8080/update
  - allows admin to preform CRUD functions on menu items
- localhost:8080/admin
  - allows admin to view active orders and send relavent text messages





## Warnings / Tips
1. Do not edit the output.css file directly, it is auto-generated after running the aboved mentioned npx command

2. Use the npm run db:reset command each time there is a change to the database schema or seeds.

3. If you need to add new css classes directlyf you can either add it to the styles.css file or configure Taildwind do so in the tailwind.config.js file




## Screenshots

!["Main page"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot1.png?raw=true)
!["Sign Up"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot2.png?raw=true)
!["Log in"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot3.png?raw=true)
!["Menu"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot11.png?raw=true)
!["Options menu"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot6.png?raw=true)
!["Order purchase"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot7.png?raw=true)
!["Contact"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot8.png?raw=true)
!["Admin"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot9.png?raw=true)
!["Admin Update"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot10.png?raw=true)



## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- bcrypt
- body parser
- cookie-session
- dotenv
- ejs
- express
- node-sass-middleware
- pg
- pg-native
- twilio
- jquery

## Dev Dependencies

  - autoprefixer
  - cssnano
  - gulp
  - gulp-postcss
  - nodemon
  - uncss
  - tailwindcss
  - nodemon
  - postcss-import
  - postcss-uncss
  - gulp-autoprefixer
  - morgan
  - chalk
