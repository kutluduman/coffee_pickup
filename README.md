The Lighthouse Coffee House
=========

##  Project Description

The following steps are only for _one_ of the group members to perform. Our midterm project for the July 2020 Lighthouse Labs Midterm. It is a order for pickup website for a fictional Cafe.

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
7. Run Gulp to use process css with PostCSS and drag output.css from ./dest into ./public/styles/
```
gulp css
```
8. Add your twillio and 
8. Run the server: 
```javacript
npm run local
 ```
 9. Visit localhost:/home

Run the server: npm run local
Note: nodemon is used, so you should not have to restart your server
Visit http://localhost:8080/



## Warnings / Tips
1. Do not edit the output.css file directly, it is auto-generated after running the aboved mentioned npx command

2. Use the npm run db:reset command each time there is a change to the database schema or seeds.

3. If do not add classes directly to css if you need configure Taildwind do so in the tailwind.config.js file




## Screenshots

!["Main page"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot1.png?raw=true)
!["Sign Up"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot2.png?raw=true)
!["Log in"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot3.png?raw=true)
!["Menu"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot5.png?raw=true)
!["Options menu"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot6.png?raw=true)
!["Order purchase"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot7.png?raw=true)
!["Contact"](https://github.com/kutluduman/midterm_coffee_pickup/blob/master/public/images/screenshots/screenshot8.png?raw=true)



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
