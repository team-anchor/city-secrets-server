CitySecrets
=====

[Live link](https://citysecrets.herokuapp.com)

[App repo](https://github.com/team-anchor/city-secrets-app)

CitySecrets is a photo-driven web app for exploring little-known features of cities you live in or visit. It was made using React/Redux for the frontend and Mongo/Node/Express for the backend, and tested with Mocha/Chai.

## Get Started
1. Fork and clone the repo.
1. Run `npm i` inside the directory to install all the necessary packages.
1. Make your own `.env` with the correct MongoDB URI, PORT, and APP_SECRET. Look at the `.env.example` file as a guide.
1. In a new terminal window, run your Mongo server.
1. Run `npm start` to start the server.
1. Run `npm run test:watch` to run the tests and build the necessary collections in your MongoDB.
1. Run `npm run db:load:all` to use provided mock data.

## API/Paths with methods
### Users:
* POST - `/api/auth/signup` - signs up a new user.
* POST - `/api/auth/signin` - signs in an existing user.

### Tours:
* POST - `/api/tours` - posts a tour.
* GET - `/api/tours` - gets a list of all tours.
* GET - `/api/tours/:id` - gets a tour by id.
* GET - `/api/tours/city/:search` - gets tours by search term for city.
* PUT - `/api/tours/:id` - allows user to update their tour details.
* PUT - `/api/tours/stops/:id` - allows user to update their tour stops.

### Created by:
Mark Myers, Mario Quintana, and Injoong Yoon.

### Acknowledgements:
Thanks so much to Marty Nelson, Megan Nelson, Andrew Potter, Ryan Manro, Andrew Bodey, Jordan Levine, Ryan Mehta, and the whole Alchemy Code Lab Summer 2018 cohort. None of this would have happened without all of your time, energy, and patience.
