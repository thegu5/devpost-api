# (Unofficial) Devpost API Server

This project is an attempt to make a clean abstraction over [devpost](https://devpost.com/) for other projects. The goal is to cover all of the data available.

Documentation is generated from the [OpenAPI YAML](https://github.com/thegu5/devpost-api/blob/main/openapi/openapi.yaml) and can be found [here](https://elements-demo.stoplight.io/?spec=https://raw.githubusercontent.com/thegu5/devpost-api/main/openapi/openapi.yaml).


## Getting Started/Installation

I (thegu5) am hosting an instance of this at `devpost.gu5.org`. Please use it for testing purposes only.

You will need a relatively new version of nodejs.
```
npm i
node src/index.js
```
If you are contributing, you can use `nodemon` to auto-restart the server when a file is modified -
```
npm install -g nodemon
nodemon
```

## Project Status

This project is almost ready for my purposes, but it may not be for yours.

Routes defined in the spec but not implemented:
- Specific software updates
- Specific forum topics
- Error handling on 404s, invalid auth token, etc
- URL normalization for the default profile picture (starts with // instead of https://)

Issues with current routes:
- Listing of private users as members of projects in the project gallery
- Hackathon update content previews are messed up

Information that needs to be defined:
- Software search, staff picks (featured), popular
- Hackathon search
- Hackathon theme stats
- Featured hackathons
- Different currency prize amounts
- Software updates + comments on them

In the future:
- Look into cheerio extract/others
- Tests
- Documentation for the participants cookie