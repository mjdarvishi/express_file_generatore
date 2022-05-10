## What is ``generatore``?
This is a useful package for generate files like controller and routes file in express project.

* you can create controller.
* you can create route.
* you can create controller while you are creating a route.
* you can modify destination of your generated file 


**Installation**

`npm i --save gen`

### how to use:

##### in nodejs:
These are the command:
* npx gen --help show manual pages
* npx gen generate:controller --help show manual pages of generating controller
* npx gen generate:controller -n [name of your controller] create a controller for you in ./controller directory
* npx gen generate:route --help show manual pages of generating routes
* npx gen generate:route -n [name of your route] create a route for you in ./route directory
* npx gen generate:route -n [name of your route] -c create a route for you in ./route directory and also create controller too
* npx gen change:config --help show manual pages of config page
* npx gen change:config -cont_dest [destination dir like /controller/test] change the destination directory of your generated controller
* npx gen change:config -route_dest [destination dir like /route/test] change the destination directory of your generated route
