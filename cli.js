#!/usr/bin/env node

"use strict";

const fs = require("fs");
const { exit } = require("process");
const {Dest}=require('./config.js')
const params = process.argv;
const PARAMS_1 = params[2];

//CONIG LOCATION
const CONFIG_LOCATION = `${__dirname}/config.js`;


// DESTINATION TARGER
const CONTROLLER_FOLDER_DESTINATION = `${process.cwd()}/${Dest.CONTROLLER_DEST}`;
const ROUTE_FOLDER_DESTINATION = `${process.cwd()}/${Dest.ROUTE_DEST }`;


// TEMPLATE
const CONTROLLER_TEMPLATE = `${__dirname}/core/stubs/controller.stub`;
const ROUTE_TEMPLATE = `${__dirname}/core/stubs/route.stub`;
const ROUTE_PLAIN_TEMPLATE = `${__dirname}/core/stubs/route_plain.stub`;


// MANULE
const MANUAL_HELP = `${__dirname}/core/manual/help.stub`;
const GENERATE_CONTROLLER_HELP = `${__dirname}/core/manual/generate_controller_help.stub`;
const CHANGE_CONFIG_HELP = `${__dirname}/core/manual/config_help.stub`;


//CHECK FILE AND FOLDER
function mkdirIfNotExist(target, ifNotExist = () => { }) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
    ifNotExist();
  }
}

// SHOW MANUAL
function showHelp(target) {
  const data = fs.readFileSync(target, "utf8");
  console.log(data);
  exit();
}





//CREATE ROUTE
const ROUTE_OPTIONS = {
  LIST: ["--help", "-n", "-c"],
  HELP: "--help",
  FILE_NAME: "-n",
  CONTROLLER: "-c",
};
let ROUTE_FILE_NAME
let CONTROLLER_ROUTE = false
function getRoutOptions() {
  params.forEach((o) => {
    switch (o) {
      case ROUTE_OPTIONS.HELP:
        showHelp(GENERATE_CONTROLLER_HELP);
        break;
      default:
        break;
    }
  });
  params.forEach((o, index) => {
    switch (o) {
      case ROUTE_OPTIONS.FILE_NAME:
        ROUTE_FILE_NAME = params[index + 1].toString()
        break;
      case ROUTE_OPTIONS.CONTROLLER:
        CONTROLLER_ROUTE = true
        break;
      default:
        break;
    }
  })

  console.log(`Generating Route:`);
  createRoute(ROUTE_FILE_NAME, CONTROLLER_ROUTE);
}
function createRoute(name, controller) {
  const dest = ROUTE_FOLDER_DESTINATION
  const temp = controller?ROUTE_TEMPLATE:ROUTE_PLAIN_TEMPLATE
  try {
  if (name == undefined) throw Error("required Route name");
    const filename = `${name.charAt(0).toUpperCase() + name.slice(1)}`
    const destination = `${dest}/${filename}Routing.js`;
    let data = fs.readFileSync(temp, "utf8");
    if(controller)
    data = data.replaceAll("$$NAME$$", filename)  
    
    // write model file
    mkdirIfNotExist(dest);

    if (fs.existsSync(destination) && !ROUTE_FORCE){
        console.log(`Route File at ${destination} already exists. To overwrite use --force`)
        return
    }

    fs.writeFile(destination, data, function (err) {
      if (err) return console.log('err');
      console.log(`Created: src > routes > api > ${filename}Routing.js`);
    });

    if (controller)
      createController(name);

  } catch (err) {
    console.error(err);
  }
}
//END OF CREATING ROUTE






//CREATE CONTROLLER
const CONTROLLER_OPTIONS = {
  LIST: ["--help", "-n",],
  HELP: "--help",
  FILE_NAME: "-n",
};
let CONTROLLER_FILE_NAME
function getControllerOptions() {
  params.forEach((o) => {
    const option = CONTROLLER_OPTIONS.LIST.includes(o) ? o : "";
    switch (option) {
      case CONTROLLER_OPTIONS.HELP:
        showHelp(GENERATE_CONTROLLER_HELP);
        break;
      default:
        break;
    }
  });
  params.forEach((o, index) => {
    switch (o) {
      case CONTROLLER_OPTIONS.FILE_NAME:
        CONTROLLER_FILE_NAME = params[index + 1].toString()
        break;
      default:
        break;
    }
  });

  console.log(`Generating Controller:`);
  createController(CONTROLLER_FILE_NAME);
}

function createController(name) {
  try {
  if (name == undefined) throw Error("required Controller name");
    const filename = `${name.charAt(0).toUpperCase() + name.slice(1)}`
    const temp = CONTROLLER_TEMPLATE
    const dest = CONTROLLER_FOLDER_DESTINATION  
    const destination = `${dest}/${filename}Controller.js`;
    let data = fs.readFileSync(temp, "utf8");
    data = data.replaceAll("$$MODEL_NAME$$", filename);
    mkdirIfNotExist(dest);
    if (fs.existsSync(destination)){
      console.log(`Controller File at ${destination} already exists`)
      return
    }
    fs.writeFile(destination, data, function (err) {
      if (err) return console.log('err');
      console.log(`Created: src > controllers > ${filename}Controller.js`)
    });
  } catch (err) {
    console.error(err);
  }
}
//END OF CREATING CONTROLLER



//CHANGE CONFIG
const CHANGE_CONFIG_OPTIONS = {
  LIST: ["--help", "--cont_dest","-route_dest"],
  HELP: "--help",
  CON_DES: "-cont_dest",
  ROU_DES: "-route_dest",
}
function getChangeConfigOptions() {
  params.forEach((o) => {
    const option = CHANGE_CONFIG_OPTIONS.LIST.includes(o) ? o : "";
    switch (option) {
      case CHANGE_CONFIG_OPTIONS.HELP:
        showHelp(CHANGE_CONFIG_HELP);
        break;
      default:
        break;
    }
  });
  let data = fs.readFileSync(CONFIG_LOCATION, "utf8");
  params.forEach((o, index) => {
    switch (o) {
      case CHANGE_CONFIG_OPTIONS.CON_DES:
        const dest=data.split('\n')
        dest[2]=`CONTROLLER_DEST: '${params[index + 1].toString()}',`
        data=dest.join("\n")
        break;
      case CHANGE_CONFIG_OPTIONS.ROU_DES:
        let dest_route=data.split('\n')
        dest_route[3]=`ROUTE_DEST: '${params[index + 1].toString()}',`
        data=dest_route.join("\n")
        break;
      default:
        break;
    }
  });
  fs.writeFile(CONFIG_LOCATION, data, function (err) {
    if (err) return console.log('err');
    console.log(`cofig file has been changed successfly`)
  });
}







//  MAIN COMMAND
const COMMAND = {
  LIST: [
    "--help",
    "generate:controller",
    "generate:route",
    "change:config"
  ],
  HELP: "--help",
  GENERATE_ROUTE: "generate:route",
  GENERATE_CONTROLLER: "generate:controller",
  CHANGE_CONFIG: "change:config",
};


//MAIN FUNCITON
function main(c) {
  const command = COMMAND.LIST.includes(c) ? c : "";
  switch (command) {
    case COMMAND.HELP:
      showHelp(MANUAL_HELP);
      break;

    case COMMAND.GENERATE_ROUTE:
      getRoutOptions()
      break;
    case COMMAND.GENERATE_CONTROLLER:
      getControllerOptions();
      break;
    case COMMAND.CHANGE_CONFIG:
      getChangeConfigOptions();
      break;

    default:
      console.log("ERROR: Unkown Command pls refer to --help");
      showHelp(MANUAL_HELP);
      exit();
  }
}


//  Start of main

main(PARAMS_1);
