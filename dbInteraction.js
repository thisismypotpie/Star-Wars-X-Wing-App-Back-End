/**
 * Require Section
 */
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
const ship_page = require('./JS Data Classes/Ship-Variants.js');
const maneuver_page = require('./JS Data Classes/Maneuvers.js');
const pilot_page = require('./JS Data Classes/Pilot-Variants');
const card_page = require('./JS Data Classes/card-Variants');
const gc_classes = require('./JS Data Classes/GC-Variants');
const http = require('http');
const { parse, resolve } = require('path');
const { Console } = require('console');

/**
 * End Require Section
 */

/**
 * Define Checker Variables
 */
var game_data_grab_checker ={
  get_crit_hit_cards: false,
  get_condition_cards: false,
  get_upgrade_cards: false,
  get_large_crit_hit_cards: false,
  get_maneuver_cards: false,
  get_large_maneuver_data: false,
  get_large_ship_data: false,
  get_ship_data: false,
  get_pilot_data: false,
  get_planet_data: false,
  get_planet_paths: false
}
function check_game_data_grabber()
{
  //console.log(game_data_grab_checker);
  if(game_data_grab_checker.get_crit_hit_cards == false ||
     game_data_grab_checker.get_condition_cards == false ||
     game_data_grab_checker.get_upgrade_cards == false ||
     game_data_grab_checker.get_large_crit_hit_cards == false ||
     game_data_grab_checker.get_maneuver_cards == false ||
     game_data_grab_checker.get_large_maneuver_data == false ||
     game_data_grab_checker.get_large_ship_data == false ||
     game_data_grab_checker.get_ship_data == false ||
     game_data_grab_checker.get_pilot_data == false ||
     game_data_grab_checker.get_planet_data == false ||
     game_data_grab_checker.get_planet_paths == false)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function reset_game_data_grabber()
{
  game_data_grab_checker.get_crit_hit_cards =false
  game_data_grab_checker.get_condition_cards= false
  game_data_grab_checker.get_upgrade_cards= false
  game_data_grab_checker.get_large_crit_hit_cards= false
  game_data_grab_checker.get_maneuver_cards= false
  game_data_grab_checker.get_large_maneuver_data= false
  game_data_grab_checker.get_large_ship_data= false
  game_data_grab_checker.get_ship_data= false
  game_data_grab_checker.get_pilot_data= false
  game_data_grab_checker.get_planet_data= false
  game_data_grab_checker.get_planet_paths= false
}

var game_data_save_checker={
game_info_saved: false,
turn_info_saved: false,
team_info_saved: false,
ship_info_saved: false,
upgrade_info_saved: false,
reminder_info_saved: false,
target_locks_saved: false
}
function check_game_data_save_checker()
{
    //console.log(game_data_save_checker);
    if(  game_data_save_checker.game_info_saved == false|| 
      game_data_save_checker.turn_info_saved== false||
      game_data_save_checker.team_info_saved== false||
      game_data_save_checker.ship_info_saved== false||
      game_data_save_checker.upgrade_info_saved== false||
      game_data_save_checker.reminder_info_saved== false||
      game_data_save_checker.target_locks_saved== false)
    {
      return false;
    }
    else
    {
      return true;
    }
}
function reset_game_data_save_checker()
{
  game_data_save_checker.game_info_saved = false
  game_data_save_checker.turn_info_saved= false
  game_data_save_checker.team_info_saved= false
  game_data_save_checker.ship_info_saved= false
  game_data_save_checker.upgrade_info_saved= false
  game_data_save_checker.reminder_info_saved= false
  game_data_save_checker.target_locks_saved= false
}

var game_data_overwrite_freeplay_checker={
   old_data_deleted:false
}
function check_game_data_overwrite_freeplay_checker()
{
  //console.log(game_data_overwrite_freeplay_checker);
  if(check_game_data_save_checker() == false ||
     game_data_overwrite_freeplay_checker == false)
     {
       return false;
     }
  else
  {
    return true;
  }
}
function reset_check_game_data_overwrite_freeplay_checker()
{
  reset_game_data_save_checker();
  game_data_overwrite_freeplay_checker.old_data_deleted = false;
}

var game_data_names_checker={
   freeplay_names_grabbed: false,
   gc_names_grabbed: false
}
function check_game_data_names_checker()
{
  //console.log(game_data_names_checker)
  if(game_data_names_checker.freeplay_names_grabbed == false ||
     game_data_names_checker.gc_names_grabbed == false)
  {
     return false;
  }
  else
  {
    return true;
  }
}
function reset_game_data_names_checker()
{
  game_data_names_checker.freeplay_names_grabbed = false;
  game_data_names_checker.gc_names_grabbed = false;
}

var game_data_freeplay_load_checker={
  team_data: false,
  ship_data: false,
  turn_data: false,
  target_lock_data: false,
  upgrade_data: false,
  reminder_data: false
}
function check_game_data_freeplay_load_checker()
{
  //console.log(game_data_freeplay_load_checker);
    if(  game_data_freeplay_load_checker.team_data== false ||
      game_data_freeplay_load_checker.ship_data== false ||
      game_data_freeplay_load_checker.turn_data== false ||
      game_data_freeplay_load_checker.target_lock_data== false ||
      game_data_freeplay_load_checker.upgrade_data== false ||
      game_data_freeplay_load_checker.reminder_data== false )
    {
      return false;
    }
    else
    {
      return true;
    }
}
function reset_game_data_freeplay_load_checker()
{
  game_data_freeplay_load_checker.team_data= false
  game_data_freeplay_load_checker.ship_data= false
  game_data_freeplay_load_checker.turn_data= false
  game_data_freeplay_load_checker.target_lock_data= false
  game_data_freeplay_load_checker.upgrade_data= false
  game_data_freeplay_load_checker.reminder_data= false
}

var game_data_gc_save_checker = {
  setup_data_saved: false,
  faction_data_saved: false,
  game_data_saved: false,
  pirate_data_saved: false
}
function check_data_gc_save_checker()
{
  //console.log(game_data_gc_save_checker);
    if(  game_data_gc_save_checker.setup_data_saved== false||
      game_data_gc_save_checker.faction_data_saved== false||
      game_data_gc_save_checker.game_data_saved== false||
      game_data_gc_save_checker.pirate_data_saved== false)
    {
      return false;
    }
    else
    {
      return true;
    }
}
function check_total_gc_save_and_save_checker()
{
    if(check_data_gc_save_checker() == false ||
       check_game_data_save_checker() == false)
    {
       return false;
    }
    else
    {
      return true;
    }
}
function reset_gc_save_checker()
{
  reset_game_data_save_checker();
  game_data_gc_save_checker.setup_data_saved= false
  game_data_gc_save_checker.faction_data_saved= false
  game_data_gc_save_checker.game_data_saved= false
  game_data_gc_save_checker.pirate_data_saved= false
}

var game_data_overwrite_gc_checker =
{
   gc_data_deleted: false
}
function check_game_data_overwrite_gc_checker()
{
  //console.log(game_data_overwrite_gc_checker);
  if(check_game_data_overwrite_freeplay_checker()==false ||
     game_data_overwrite_gc_checker.gc_data_deleted == false ||
     check_data_gc_save_checker()==false)
     {
       return false;
     }
  else
  {
    return true;
  }
}
function reset_gc_overwrite_checker()
{
  reset_check_game_data_overwrite_freeplay_checker();
  reset_gc_save_checker();
  game_data_overwrite_freeplay_checker.old_data_deleted = false;
}

var game_data_gc_load_checker={
  gc_turn_data: false,
  pirate_rosters: false,
  pirate_data: false,
  faction_data: false,
  dead_people_data: false,
  navy_data: false,
  planet_data: false,
  setup_data: false
}
function check_game_data_load_gc_checker()
{
  if(  game_data_gc_load_checker.gc_turn_data == false ||
    game_data_gc_load_checker.pirate_rosters == false||
    game_data_gc_load_checker.pirate_data == false||
    game_data_gc_load_checker.faction_data == false||
    game_data_gc_load_checker.dead_people_data == false||
    game_data_gc_load_checker.navy_data == false||
    game_data_gc_load_checker.planet_data == false||
    game_data_gc_load_checker.setup_data == false)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function check_game_Data_entire_gc_load_check()
{
  if(check_game_data_load_gc_checker() == false ||
  check_game_data_freeplay_load_checker() == false)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function reset_gc_load_checker()
{
  reset_game_data_freeplay_load_checker();
  game_data_gc_load_checker.gc_turn_data = false 
  game_data_gc_load_checker.pirate_rosters = false
  game_data_gc_load_checker.pirate_data = false
  game_data_gc_load_checker.faction_data = false
  game_data_gc_load_checker.dead_people_data = false
  game_data_gc_load_checker.navy_data = false
  game_data_gc_load_checker.planet_data = false
  game_data_gc_load_checker.setup_data = false
}
/**
 * End Checker Variables
 */


/**
 * Define Global Variables
 */
var db = undefined;//This will be used to store database connection when retriveing data.
var game_data = {
  all_maneuvers: [],
  ship_list:[],
  all_pilots:[],
  all_crit_cards:[],
  all_large_crit_hit_cards:[],
  all_conditions:[],
  all_upgrades:[],
  all_planets:[],
  map_paths:[]
};
var loading_raw_data={
  team_data: [],// <- This is where data when loading gc combat will be stored.
  ship_data: [],
  turn_data: undefined,
  target_lock_data:[],
  upgrade_data:[],
  reminders:[] 
}
var loading_raw_data_gc={
  turn_data: [],// .phase, .whosturn, .placementRoundHalf   <- data for who's turn it is and what phase we are in.
  pirate_roster_numbers: [],// This will be an array of ints to indicate which roster number to pull from when it comes to pirates.
  pirate_ship_quantities: [], //.#shipname  <- number of each ship available to use as pirates. Sorted by ship name.
  faction_data:[], // .faction, .fuel, .durasteel, .tibanna, .parts, .electronics, .currency, .highestSquadNumber, .highestFleetNumber, .highestArmadaNumber
  list_of_the_dead:[],// .name, .faction
  navies:[],// .groupName, .groupFaction, .groupLocation, .hasMoved
  planet_data:[],// .planetID, .controllingFaction, .resource, .imageURL, .resourceQuantity, .spawnChance
  set_up_data: [],// .playerFaction, .resrouceChosen, .planetCount, .pirateFaction, .planetAssignment, .location
  ship_and_combat_data: undefined
}
/**
  * End Define Global Variables Section
  */



/**
 * Main Responce Functon
 */
const server = http.createServer(function(request, response){
  response.setHeader('Content-Type', 'application/json');
  response.setHeader("Access-Control-Allow-Origin","*");
  //response.setHeader("Access-Control-Allow-Origin","null");
  ////console.log(request.url);
  main_response_function(request, response);
});
var port = /*process.env.PORT||*/3000;
server.listen(port);
/**
 * End Main Response Function
 */


 function main_response_function(request,response)
 {
   if(request.url == "/get_data")//Get all data at the start of the game.
   {
     establish_database_connection("game_data").then(()=>{
        get_crit_cards_data();
        get_condition_data();
        get_upgrade_data();   
        get_large_crit_hit_data();
        get_maneuver_data();
        get_planet_data();
        get_map_paths();
        var data_checker = setInterval(()=>{if(check_game_data_grabber()){ reset_game_data_grabber(); clearInterval(data_checker); response.end(JSON.stringify(game_data));}},500);
     })
   }
   else if(request.url == "/save_game")//Save a game.
   {
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
       body = JSON.parse(body);
       establish_database_connection("saved_games").then(()=>{
          save_game(body); 
          var data_checker = setInterval(()=>{if(check_game_data_save_checker()){ reset_game_data_save_checker(); clearInterval(data_checker); response.end(response.end('ok'));}},500);
       })
     })
   }
   else if(request.url == "/save_game_gc")//Save galactic conquest game.
   {
     //Add combat indicator to body to determine if we need to save a game in combat.
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
       body = JSON.parse(body);
       establish_database_connection("saved_games_gc").then(()=>{
        save_game_gc(body);
        var interval = setInterval(()=>{
          if(check_total_gc_save_and_save_checker() == true)
          {
             clearInterval(interval);
             reset_gc_save_checker();
             response.end('ok');
          }
        },500)
       })
     })
   }
   else if(request.url == "/overwrite_game_gc")//overwrite a gc.
   {
     //Add combat indicator to body to determine if we need to save a game in combat.
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
       body = JSON.parse(body);
       establish_database_connection("saved_games_gc").then(()=>{
        overwrite_game_gc(body);
        var interval = setInterval(()=>{if(check_game_data_overwrite_gc_checker()){clearInterval(interval);reset_gc_overwrite_checker();response.end('ok')}})
       })
     }) 
   }
   else if(request.url == "/load_game_gc")//Load a gc.
   {
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
       body = JSON.parse(body);
       establish_database_connection("saved_games_gc").then(()=>{
        load_game_gc(body);
        var interval = setInterval(()=>{
          if(check_game_Data_entire_gc_load_check() == true)
          {
            clearInterval(interval);
            reset_gc_load_checker();
            loading_raw_data_gc.ship_and_combat_data = loading_raw_data;
            response.end(JSON.stringify(loading_raw_data_gc));
          }
        },500)
       })
      })
   }
   else if(request.url == "/load_game")//Load a game.
   {
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
      body = JSON.parse(body);
      establish_database_connection("saved_games").then(()=>{
        load_game(body);
        var interval = setInterval(()=>{if(check_game_data_freeplay_load_checker()){clearInterval(interval); reset_game_data_freeplay_load_checker();response.end(JSON.stringify(loading_raw_data));}},500);
      })
     })
   }
   else if(request.url == "/overwrite_game")//overwite a game.
   {
     let body = '';
     request.on('data', chunk => {
     body += chunk.toString();});
     request.on('end', () => {
       body = JSON.parse(body);
       establish_database_connection("saved_games").then(()=>{
       overwrite_game(body);
       var interval = setInterval(()=>{if(check_game_data_overwrite_freeplay_checker()){clearInterval(interval);reset_check_game_data_overwrite_freeplay_checker();response.end('ok');}});
       })
     })
   }
   else if(request.url == "/get_game_names")//get all names of currently saved games.
   {
     establish_database_connection("saved_games").then(async()=>{
      var game_names = {
        reg_game_names: undefined,
        gc_game_names: undefined
      }
      game_names.reg_game_names = await get_game_names();
      var interval = setInterval(()=>{if(game_names.reg_game_names != undefined){
        clearInterval(interval);
        establish_database_connection("saved_games_gc").then(async()=>{
          game_names.gc_game_names = await get_game_names();
          var interval2 = setInterval(()=>{if(game_names.gc_game_names != undefined){
            clearInterval(interval2);
            var interval3 = setInterval(()=>{if(check_game_data_names_checker)
            {
              clearInterval(interval3);
              reset_game_data_names_checker();
              response.end(JSON.stringify(game_names))}})
          }},500);
        });
      }},500)
     })
   }
   else
   {
     response.statusCode = 400;
     response.statusMessage = "ERROR: Invlaid URL";
     response.end();
   }
 }
function get_ship_data()
{
  let ship_list = [];
  var tables = query("SELECT * FROM ShipTable").then(tables=>{
    tables.forEach(element => {
      var maneuvers_for_this_ship = [];//A list of maneuvers for this ship, starts empty but maneuvers belonging to this ship will be added.
      
      //get maneuver numbers and split each number.
      let maneuver_array = element.Manuevers.split('*');
      
      //Go through all of the maneuvers and add any that are a part of this ship to maneuvers_for_this_ship.
      maneuver_array.forEach(maneuver_id_of_ship =>{
        game_data.all_maneuvers.forEach(maneuvers_from_entire_list =>{
          if(maneuver_id_of_ship == maneuvers_from_entire_list.id)
          {
            maneuvers_for_this_ship.push(maneuvers_from_entire_list);
          }
        })
      })
      //Add everything from database and maneuver list to create a new ship.
      ship_list.push(new ship_page.ship(element.ID,element.ShipType, element.Name, element.Attack, element.Agility, element.Shields, element.Hull,maneuvers_for_this_ship,element.ManeuverCard,element.Role));
      });
      //console.log("SMALL/MEDUIM SHIP LOADED. LENGTH: "+ship_list.length);
      game_data.ship_list = ship_list;
      get_pilot_data();
      game_data_grab_checker.get_ship_data = true;
      return ship_list;
  })
}

function get_maneuver_data()
{
  var tables = query("SELECT * FROM ManeuverTable").then( tables=>{
    var all_maneuvers = [];
    tables.forEach(element => {
      all_maneuvers.push(new maneuver_page.Maneuver(element.ID,element.Maneuver,element.Color,element.Range, element.RangePath, element.ManeuverPath));
    })
    //console.log("SMALL/MEDIUM SHIP MANEUVERS LOADED. LENGTH: "+all_maneuvers.length);
    game_data.all_maneuvers = all_maneuvers;
    get_large_maneuver_data();
    game_data_grab_checker.get_maneuver_cards = true;
    return all_maneuvers;
  })

}

function get_planet_data()
{
  var tables = query("SELECT * FROM Planets").then( tables=>{
    var all_planets = [];
    tables.forEach(element => {
      all_planets.push({name: element.Name, id: element.ID, image_path:element.ImagePath, x_coordinate: element.X_Coordinate, y_coordinate: element.Y_Coordinate, sector: element.Sector, priority: element.Priority});
    })
    //console.log("PLANETS LOADED. LENGTH: "+all_planets.length);
    game_data.all_planets = all_planets;
    game_data_grab_checker.get_planet_data = true;
    return all_planets;
  })
}

function get_map_paths()
{
  var tables = query("SELECT * FROM MapPaths").then( tables=>{
    var all_paths = [];
    tables.forEach(element => {
      all_paths.push({x_coordinate:element.X_Coordinate, y_coordinate:element.Y_Coordinate});
    })
    //console.log("MAP PATHS LOADED. LENGTH: "+all_paths.length);
    game_data.map_paths = all_paths;
    game_data_grab_checker.get_planet_paths = true;
    return all_paths;
  })
}

function get_large_maneuver_data()
{
  var second_table = query("SELECT * FROM LargeManeuverTable").then(tables=>{
    var all_maneuvers = [];
    tables.forEach(element => {
      all_maneuvers.push(new maneuver_page.Large_Maneuver(element.ID,element.Maneuver,element.Color,element.Range, element.RangePath, element.ManeuverPath, element.EnergyPath,element.EnergyGained));
    })
  //console.log("LARGE SHIP MANEUVERS LOADED. LENGTH: "+all_maneuvers.length);
  game_data.all_maneuvers = game_data.all_maneuvers.concat(all_maneuvers);
  get_ship_data();
  game_data_grab_checker.get_large_maneuver_data = true;
  return all_maneuvers;
  })
}

function get_pilot_data()
{
  var all_pilots = [];
  var tables = query("SELECT * FROM PilotTable").then( tables=>{
    tables.forEach(element =>{
  
      //Determine if the pilot is unique or not.
      var unique_pilot = false;
      var ship_object = undefined;
      if(element.UniquePilot == 1)
      {
        unique_pilot = true;
      }
      else
      {
        unique_pilot = false;
      }
      //Add ship object to the pilot. I needed to use a while loop here because you cannot break a foreach loop in js.
      let iteration = 0;
      while(iteration < game_data.ship_list.length)
      {
        if(game_data.ship_list[iteration].id == element.ShipID)
        {
          ship_object = game_data.ship_list[iteration];
          console.log(game_data.ship_list[iteration]);
          break;
        }
        iteration ++;
      }
      all_pilots.push(new pilot_page.pilot(element.Name, element.Faction, element.PilotSkill, element.Cost,ship_object, element.ImagePath,unique_pilot,element.ID));
    })
    game_data.all_pilots = all_pilots;
    //console.log("PILOTS COMPLETE. LENGTH: "+all_pilots.length);
    add_large_ship_data();
    game_data_grab_checker.get_pilot_data = true;
    return all_pilots;
  })
}

function get_upgrade_data(){
  var all_upgrades = [];
  var tables = query("SELECT * FROM UpgradesTable")
  .then(tables=>{
    tables.forEach(element => {
        var ship_specific_names = [];
        var ship_size_specifics = [];
        var unique = false;
        var limited = false;
        var rebels = false;
        var imperials = false;
        var scum = false;
        //Convert numbers to booleans
        if(element.Unique == 1)
        {
           unique = true;
        }
        if(element.Limited == 1)
        {
          limited = true;
        }
        if(element.RebelFaction == 1)
        {
          rebels = true;
        }
        if(element.ImperialFaction == 1)
        {
          imperials = true;
        }
        if(element.ScumFaction == 1)
        {
          scum = true;
        }
        if(element.ShipSpecific != null)//Set ship specific list.
        {
          var holder = element.ShipSpecific.split('\n');
          for(var i=0; i < holder.length;i++)
          {
            ship_specific_names.push(parseInt(holder[i],10));
          }

        }
        if(element.ShipSizeSpecific !=null)//Set Ship size specificity list.
        {
          ship_size_specifics = element.ShipSizeSpecific.split('\n');
        }
      if(element.DualSided ==1)
      {
        ////console.log(element.Name+" is a dual sided upgrade.");
        all_upgrades.push(new card_page.DualSidedUpgrade(element.Name, element.Type, element.Cost, element.ImagePath,element.ID,unique,limited,ship_specific_names,ship_size_specifics,rebels,imperials,scum,true));
      }
      else
      {
        all_upgrades.push(new card_page.UpgradeCard(element.Name, element.Type, element.Cost, element.ImagePath,element.ID,unique,limited,ship_specific_names,ship_size_specifics,rebels,imperials,scum,false));  
      }
  
    })
    //console.log("UPGRADE CARDS COMPLETE. LENGTH: "+all_upgrades.length);
    game_data.all_upgrades = all_upgrades;
    game_data_grab_checker.get_upgrade_cards = true;
    return all_upgrades;
  })
}

function get_condition_data()
{
  var all_conditions = [];
  var tables = query("SELECT * FROM ConditionsTable")
  .then(tables=>{
    tables.forEach(element =>{
      all_conditions.push(new card_page.condition(element.Name, element.ImagePath,element.ID));
    })
    //console.log("CONDITION CARDS COMPLETE. LENGTH: "+all_conditions.length);
    game_data.all_conditions = all_conditions;
    game_data_grab_checker.get_condition_cards = true;
    return all_conditions;
  });
}

function get_crit_cards_data()
{
  var all_crit_cards = [];
  var tables = query("SELECT * FROM CriticalHitTable")
  .then(tables=>{
    tables.forEach(element => {
      all_crit_cards.push(new card_page.criticalHitCard(element.Name, element.ImagePath,element.ID));
    });
    //console.log("CRITICAL HIT CARDS COMPLETE. LENGTH: "+all_crit_cards.length);
    game_data.all_crit_cards = all_crit_cards;
    game_data_grab_checker.get_crit_hit_cards = true;
    return all_crit_cards;
  })
}

function get_large_crit_hit_data()
{
  var large_crit_hits = [];
  var tables = query("SELECT * FROM LargeShipCritHitCards").then( tables=>{
    tables.forEach(element=>{
      large_crit_hits.push(new card_page.criticalHitCard(element.CardName,element.ImagePath,element.ID));
    })
    //console.log("LARGE CRITICAL HIT CARD COMPLETE. LENGTH: "+large_crit_hits.length);
    game_data.all_large_crit_hit_cards = large_crit_hits;
    game_data_grab_checker.get_large_crit_hit_cards = true;
    return large_crit_hits;
  })
}

function get_game_names()
{
  var names = [];
  var tables = query("SELECT * FROM GameIdentifiers")
  .then(tables=>{
    tables.forEach(element=>{
      //console.log("Found game called: "+element.GameName);
      names.push(element.GameName);
    })
  });
  return names;
}


//This will promisify the query so I do not need to write a promise every time.
function query(sql,args)
{
  return new Promise((resolve,reject)=>{
    db.all(sql,args,(err,tables)=>{
      resolve(tables);
    })
  })
}

//Returns promises based on whether or not a connection is established.
function establish_database_connection(db_connection_name)
{
if(db_connection_name == "game_data")
{
  var dbExists = fs.existsSync('./GameDB.db');
if(dbExists)
{
//open the database connection
  db = new sqlite3.Database('./GameDB.db', sqlite3,(err)=>{
    if(err != null && err === 'SQLITE_BUSY')
    {
      return handle_rejected_busy_error(db_connection_name);
    }
    else if(err)
    {
      return new Promise((resolve,reject) => {
        //console.log(err);     
        reject();
      })
    }
 });
 return new Promise((resolve,reject) => {
  //console.log("Connection established with main game data db.");
  resolve();
})
}
}
else if(db_connection_name == "saved_games")
{
  var dbExists = fs.existsSync('./GameDB.db');
if(dbExists)
{
//open the database connection
  db = new sqlite3.Database('./SavedGameInfoDB.db', sqlite3,(err)=>{
    if(err != null && err === 'SQLITE_BUSY')
    {
      return handle_rejected_busy_error(db_connection_name);
    }
    else if(err != null)
    {
      return new Promise((resolve,reject) => {
        //console.log(err);     
        reject();
      }) 
    }
 });
 return new Promise((resolve,reject) => {
  //console.log("Connection established with saved games db.");
  resolve();
})
}
}
else if(db_connection_name == "saved_games_gc")
{
  var dbExists = fs.existsSync('./GameDB.db');
if(dbExists)
{
//open the database connection
  db = new sqlite3.Database('./GalactiConquestSavedGamesDB.db', sqlite3,(err)=>{
    if(err != null && err === 'SQLITE_BUSY')
    {
      return handle_rejected_busy_error(db_connection_name);
    }
    else if(err != null)
    {
      return new Promise((resolve,reject) => {
        //console.log(err);     
        reject();
      }) 
    }
 });
 return new Promise((resolve,reject) => {
  //console.log("Connection established with galactic conquest saves db.");
  resolve();
})
}
}
}

function handle_rejected_busy_error(db_connection_name)
{
  return setTimeout(()=>{establish_database_connection(db_connection_name)},500);
}

function close_database_connection()
{
   // close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  //console.log('Closing the database connection.');
});

}

function add_large_ship_data()
{
  var tables = query("SELECT * FROM LargeShipTable")
  .then(tables=>{
    tables.forEach(element =>{
      var maneuvers_for_this_ship = [];//A list of maneuvers for this ship, starts empty but maneuvers belonging to this ship will be added.
      var fore_crit_cards = [];
      var aft_crit_cards = [];
      var upgrade_types = [];
      //get maneuver numbers and split each number.
      let maneuver_array = element.Maneuvers.split('*');
      //Go through all of the maneuvers and add any that are a part of this ship to maneuvers_for_this_ship.
      maneuver_array.forEach(maneuver_id =>{
        game_data.all_maneuvers.forEach(maneuvers_from_entire_list =>{
      if(maneuver_id == maneuvers_from_entire_list.id)
      {
        maneuvers_for_this_ship.push(maneuvers_from_entire_list);
      }
    })
  })
      //Get the aft and fore critical hit cards for each ship.
      var fore_crit_cards = element.FrontCritImages.split('*');
      for(var i=0; i < fore_crit_cards.length;i++)
      {
        fore_crit_cards[i]  = parseInt(fore_crit_cards[i],10);
      }
      var aft_crit_cards = element.RearCritImages.split('*');
      for(var i=0; i < aft_crit_cards.length;i++)
      {
        aft_crit_cards[i]  = parseInt(aft_crit_cards[i],10);
      }
  
      if(element.LargeShipType == "largeTwoCard")
      {
        ////console.log("pushing one");
        let ship_to_push = new ship_page.Large_Ship_Two_Cards(element.ID,element.LargeShipType,element.Name,element.Attack,0,element.ForeShields, 
          element.ForeHull, maneuvers_for_this_ship, element.Energy,0,element.AftHull, element.AftShields,element.CrippledAttack,
          element.CrippledEnergy, fore_crit_cards, aft_crit_cards, element.ManeuverCard,element.Role)
          game_data.ship_list.push(ship_to_push);
          game_data.all_pilots.push(new pilot_page.largeShipTwoCardPilot(element.Name+" Pilot", element.Faction,element.PilotSkill, element.Cost, ship_to_push,element.ForeImage,false, element.AftImage, element.CrippledForeImage, element.CrippledAftImage,element.ID));
        }
      else if(element.LargeShipType == "largeOneCard")
      {
        ////console.log("pushing two");
        var ship_attack;
        if(element.Attack == null)
        {
          ship_attack = 0;
        }
        else
        {
          ship_attack = element.Attack;
        }
        let ship_to_push = new ship_page.Large_Ship_One_Card(element.ID,element.LargeShipType,element.Name,ship_attack,0,element.ForeShields, 
          element.ForeHull, maneuvers_for_this_ship, element.Energy, fore_crit_cards, aft_crit_cards, element.ManeuverCard,element.Role);
        game_data.ship_list.push(ship_to_push);
        game_data.all_pilots.push(new pilot_page.pilot(element.Name+" Pilot", element.Faction,element.PilotSkill, element.Cost, ship_to_push,element.ForeImage,false,element.ID));
      }
      else
      {
        //console.log("Could not determine the ship type of ship: "+ element.Name);
      }
    })
    //console.log("LARGE SHIP LOADED");
    game_data_grab_checker.get_large_ship_data = true;
  })
}


////CODE FOR Saving/OVERWRITING GAMES FOR GALACTIC CONQUEST///////////////////////////////////////////
async function save_game_gc(body)
{
  //console.log("Saving Galactic Conquest...")
  //console.log(body);
  insert_gc_setup_data_gc(body.game_name,body.setup_data);
  insert_faction_data_gc(body.game_name, body.faction_data);
  insert_game_data_gc(body.game_name,body.phase,body.whos_turn,body.first_or_second_half_of_round);

  if(body.setup_data.pirate_faction == "on")
  {
    insert_pirate_data_gc(body.game_name,body.setup_data.pirate_options)
  }
  else
  {
    game_data_gc_save_checker.pirate_data_saved = true;
  }

  //Insert each navy into the regular saved games db.
  var interval = setInterval(()=>{
    if( check_data_gc_save_checker() == true)//make sure all gc stuff is done first before going into the freeplay database.
    {
      clearInterval(interval);
      establish_database_connection("saved_games").then(()=>{
        insert_save_game_info(body.game_name);
        var all_ships = [];
        //Convert the gc body to a body the the regular save game db can understand.
        body.faction_data.forEach(faction=>{
          faction.navy.forEach(ship_group=>{
            all_ships.push({
              team_name: ship_group.group_name,
              has_initiative_token: false,
              ship_list: ship_group.team.ship_list
            })
          })
        })
        if(body.combat_data!= undefined && body.combat_data!= null)//Get combat teams if there is combat.
        {
          insert_turn_info(body.game_name,body.combat_data.save_game_phase);
          insert_teams_into_table(body.combat_data.combatting_teams, body.game_name);
          insert_ships_in_db(body.combat_data.combatting_teams,body.game_name);
          insert_upgrades_in_db(body.combat_data.combatting_teams,body.game_name);
        }
        else//Get gc faction teams.
        {
          game_data_save_checker.turn_info_saved = true;
          game_data_save_checker.team_info_saved = true;
          insert_ships_in_db(all_ships,body.game_name);
          insert_upgrades_in_db(all_ships,body.game_name);
        }
        if(body.combat_data!= undefined && body.combat_data!= null && 
           body.combat_data.reminders !=null && body.combat_data.reminders != undefined)
        {
          insert_reminders_in_db(body.combat_data.reminders,body.game_name)
        }
        else
        {
          game_data_save_checker.reminder_info_saved = true;
        }
        if(body.combat_data!= undefined && body.combat_data!= null &&
           body.combat_data.target_locks !=null && body.combat_data.target_locks != undefined)
        {
          if(body.combat_data.target_locks.length>0)
          {
            insert_target_locks_in_db(body.game_name,body.combat_data.target_locks);
          }
          else
          {
            game_data_save_checker.target_locks_saved = true;
          }
        }
        else
        {
          game_data_save_checker.target_locks_saved = true;
        }
      })
    }
  },500);
}

function insert_gc_setup_data_gc(game_name,setup_data)
{
  var queries = {
    setup_data: false,
    active_planets: false,
    converted_planets: false
  }
  db.run("INSERT INTO SavedSetUpData(GameName,FactionChosen,ResourcesChosen,PlanetCount,PirateFaction,PlanetAssignment,Location)VALUES(?,?,?,?,?,?,?)",game_name,setup_data.faction_chosen,setup_data.resources_chosen,setup_data.active_planets.length,setup_data.pirate_faction,setup_data.planet_assignment,setup_data.location);
  queries.setup_data = true;
  
  for(var i=0;i<setup_data.active_planets.length;i++)
  {
    var planet = setup_data.active_planets[i];
    db.run("INSERT INTO SavedPlanetData(GameName,PlanetID,ControllingFaction,ResourceName,ResourceImagePath,ResourceQuantity,ResourceSpawnChance,PlanetStatus) VALUES(?,?,?,?,?,?,?,?)",game_name,planet.planet.id,planet.controlling_faction,planet.resource.name,planet.resource.image_path,planet.resource.quantity,planet.resource.spawn_chance,"Active");
    if(i >= setup_data.active_planets.length-1)
    {
      queries.active_planets = true;
    }
  }
  if(setup_data.converted_planets.length == 0)
  {
    queries.converted_planets = true;
  }
  else
  {
    for(var i=0; i < setup_data.converted_planets.length;i++)
    {
      var planet = setup_data.converted_planets[i];
      db.run("INSERT INTO SavedPlanetData(GameName,PlanetID,ControllingFaction,ResourceName,ResourceImagePath,ResourceQuantity,ResourceSpawnChance,PlanetStatus) VALUES(?,?,?,?,?,?,?,?)",game_name,planet.id,"Unaligned","None",planet.image_path,0,0,"Converted");
      if(i >=setup_data.converted_planets.length-1)
      {
        queries.converted_planets = true;
      }
    }
  }
  var interval = setInterval(()=>{
    //console.log(queries)
    if(queries.active_planets == true && queries.converted_planets == true && queries.setup_data == true)
    {
      clearInterval(interval);
      game_data_gc_save_checker.setup_data_saved = true;
    }
  },500);
}

function insert_pirate_data_gc(game_name,pirate_options)
{
  var queries = { //makes sure all three queries have executed before giving the thumbs up for saving gc.
    pirate_data: false,
    list_of_the_dead: false,
    pirate_rosters: false
  }
  db.run("INSERT INTO PirateShipData(GameName,HWK290,KihraxzFighter,M3AInterceptor,M12LKimongilaFighter,G1AStarfighter,ProtectorateStarfighter,Quadjumper,ScurrgH6Bomber,StarViper,YWing,Z95Headhunter,Firespray31,HoundsTooth,Aggressor,JumpMaster5000,LancerClassPursuitCraft,YT1300,CROCCruiser)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,pirate_options.HWK_290,pirate_options.Kihraxz_Fighter,pirate_options.M3_A_Interceptor,pirate_options.M12_L_Kimongila_Fighter,pirate_options.G_1A_Starfighter,pirate_options.Protectorate_Starfighter,pirate_options.Quadjumper,pirate_options.Scurrg_H_6_Bomber,pirate_options.StarViper,pirate_options.Y_Wing,pirate_options.Z_95_Headhunter,pirate_options.Firespray_31,pirate_options.Hounds_Tooth,pirate_options.Aggressor,pirate_options.Jump_Master_5000,pirate_options.Lancer_Class_Pusuit_Craft,pirate_options.YT_1300,pirate_options.C_ROC_Cruiser)
  queries.pirate_data = true;
  if(pirate_options.list_of_the_dead.length == 0)
  {
    queries.list_of_the_dead = true;
  }
  else
  {
    for(var i=0; i < pirate_options.list_of_the_dead.length;i++)
    {
      db.run("INSERT INTO SavedListOfTheDead(GameName,Faction,Name)VALUES(?,?,?)",game_name,"Scum",pirate_options.list_of_the_dead[i]);
      if(i >= pirate_options.list_of_the_dead.length-1)
      {
        queries.list_of_the_dead = true;
      }
    }
  }
  if(pirate_options.roster_numbers.length == 0)
  {
    queries.pirate_rosters = true;
  }
  else
  {
    for(var i=0;i < pirate_options.roster_numbers.length;i++)
    {
      db.run("INSERT INTO PirateRosterNumbers(GameName,Roster)VALUES(?,?)",game_name,pirate_options.roster_numbers[i]);
      if(i >= pirate_options.roster_numbers.length-1)
      {
        queries.pirate_rosters = true;
      }
    }
  }
  //Once all three are done, then say pirate data is fully loaded.
  var interval = setInterval(()=>{
    //console.log(queries);
    if(queries.pirate_data == true && queries.list_of_the_dead == true && queries.pirate_rosters == true){
    clearInterval(interval);
    game_data_gc_save_checker.pirate_data_saved = true;
  }},500);
}

function insert_faction_data_gc(game_name,faction_data)
{
  var queries = {//Make sure all queries are complete before saying faction data is ready.
      saved_factions: false,
      list_of_dead: false,
      saved_navies: false
  }
  if(faction_data.length == 0)
  {
     queries.saved_factions = true;
  }
  else
  {
    for(var i=0; i < faction_data.length;i++)
    {
      db.run("INSERT INTO SavedFactions(GameName,Faction,Currency,Fuel,Durasteel,Parts,Electronics,Tibanna,HighestSquadNumber,HighestFleetNumber,HighestArmadaNumber)VALUES(?,?,?,?,?,?,?,?,?,?,?)",game_name,faction_data[i].faction,faction_data[i].currency,faction_data[i].fuel,faction_data[i].durasteel,faction_data[i].parts,faction_data[i].electronics,faction_data[i].tibanna,faction_data[i].highest_squad_number,faction_data[i].highest_fleet_number,faction_data[i].highest_armada_number)
      if(i >= faction_data.length-1)
      {
        queries.saved_factions = true;
      }
      
      if(faction_data[i].list_of_the_fallen.length == 0 && i >= faction_data.length-1)
      {
        //console.log("AINT NO DEAD PEOPLE!")
        queries.list_of_dead = true;
      }
      else
      {
        //console.log("DEATH DETECTED!");
        for(var j=0; j < faction_data[i].list_of_the_fallen.length;j++)
        {
          //console.log("INSERTING DEAD: "+ faction_data[i].list_of_the_fallen[j]);
          db.run("INSERT INTO SavedListOfTheDead(GameName,Faction,Name) VALUES(?,?,?)",game_name,faction_data[i].faction,faction_data[i].list_of_the_fallen[j]);
          if(j >= faction_data[i].list_of_the_fallen.length-1 && i >= faction_data.length-1)
          {
            queries.list_of_dead = true;
          }
        }
      }

      if(faction_data[i].navy.length == 0 && i >= faction_data.length-1)
      {
        queries.saved_navies = true;
      }
      else
      {
        for(var j=0; j < faction_data[i].navy.length;j++)
        {
          var ship_group = faction_data[i].navy[j];
          var has_moved = 0;
          if(ship_group.has_moved == true)
          {
            has_moved = 1
          }
          db.run("INSERT INTO SavedNavies(GameName,GroupName,GroupFaction,GroupLocation,HasMoved) VALUES(?,?,?,?,?)",game_name,ship_group.group_name,ship_group.faction,ship_group.location,has_moved);
          if(j >= faction_data[i].navy.length-1 && i >= faction_data.length-1)
          {
            queries.saved_navies = true;
          }
        }
      }
    }
  }
  var interval =setInterval(()=>{
    //console.log(queries);
    if(queries.list_of_dead == true && queries.saved_factions == true && queries.saved_navies == true){
    clearInterval(interval);
    game_data_gc_save_checker.faction_data_saved = true;
  }},500);
}

function insert_game_data_gc(game_name,phase,whos_turn,turn_half)
{
  db.run("INSERT INTO GameIdentifiers(GameName) VALUES(?)",game_name);
  db.run("INSERT INTO GameData(GameName,Phase,WhosTurn,PlacementRoundHalf) VALUES(?,?,?,?)",game_name,phase,whos_turn,turn_half);
  game_data_gc_save_checker.game_data_saved = true;
}

////CODE FOR SAVING/OVERWRITING GAMES////////////////////////////////////////////////////////////////
async function save_game(body)
{
  var game_name = body[body.length-1].save_game_name;
  var save_game_phase = body[body.length-1].save_game_phase;
  var target_locks = body[body.length-1].target_locks;
  var reminders = body[body.length-1].reminders;
  body.pop();//Get rid of save name and phase

  ////console.log(body);

  insert_save_game_info(game_name);
  insert_turn_info(game_name,save_game_phase);
  insert_teams_into_table(body, game_name);
  insert_ships_in_db(body,game_name);
  insert_upgrades_in_db(body,game_name);
  insert_reminders_in_db(reminders,game_name)
  if(target_locks !=null && target_locks != undefined)
  {
    if(target_locks.length>0)
    {
      insert_target_locks_in_db(game_name,target_locks);
    }
    else
    {
      game_data_save_checker.target_locks_saved = true;
    }
  }
  else
  {
    game_data_save_checker.target_locks_saved = true;
  }
}

function insert_target_locks_in_db(game_name,target_locks)
{
  target_locks.forEach(lock=>{
    db.run("INSERT INTO TargetLockList(SaveGameName,assignmentNumber,targettingTeamName,targettingRoster,targettedTeamName,targettedRoster) VALUES(?,?,?,?,?,?)",game_name,lock.assignment_number, lock.targetting_team, lock.targetting_roster, lock.targetted_team, lock.targetted_roster);
  })
  game_data_save_checker.target_locks_saved = true;
}

function insert_turn_info(game_name,save_game_phase)
{
  if(save_game_phase.phase == "attack" || save_game_phase.phase == "movement")
  {
    db.run("INSERT INTO TurnInfo(SaveGameName,Phase,MovementAttackIndex) VALUES(?,?,?)",game_name,save_game_phase.phase,save_game_phase.movement_attack_index);
  }
  else if(save_game_phase.phase == "maneuver-selection")
  {
    db.run("INSERT INTO TurnInfo(SaveGameName,Phase,TeamIndex,ShipIndex) VALUES(?,?,?,?)",game_name,save_game_phase.phase,save_game_phase.team_index,save_game_phase.ship_index)
  }
  else//pre-game squad building
  {
    db.run("INSERT INTO TurnInfo(SaveGameName,Phase) VALUES(?,?)",game_name,save_game_phase.phase);
  }
  game_data_save_checker.turn_info_saved = true;
   ////console.log("Phase: "+save_game_phase);
}

function insert_reminders_in_db(reminders,game_name)
{
  if(reminders == null || reminders.length <= 0)//If there are no reminders, then this will be null.
  {
    //console.log("There were no reminders.");
    game_data_save_checker.reminder_info_saved = true;
    return;
  }
  reminders.forEach(reminder=>{
    ////console.log(reminder);
    db.run("INSERT INTO SavedReminders(GameName,Message,Team,RosterNumber,ShipTurnManeuverSelection,ShipTurnMovementPhase,ShipTurnAttackPhase,WhenTargeted,BetweenManeuverAndMovement,BetweenMovementAndAttack,BetweenRounds) VALUES(?,?,?,?,?,?,?,?,?,?,?)",game_name,reminder.message,reminder.team,reminder.roster,(reminder.when_ships_turn_maneuver_selection ? 1:0),(reminder.when_ships_turn_movement_phase ? 1:0),(reminder.when_ships_turn_attack_phase ? 1:0),(reminder.when_targeted  ? 1:0),(reminder.between_select_and_movement_phase ? 1:0),(reminder.between_movement_and_attack_phase ? 1:0),(reminder.between_rounds ? 1:0));

  })
  //console.log("reminders loaded into db.");
  game_data_save_checker.reminder_info_saved = true;
}

function insert_save_game_info(game_name)
{
  //console.log("Begin insert_save_game_info...")
  db.run("INSERT INTO GameIdentifiers(GameName) VALUES(?)",game_name);
  game_data_save_checker.game_info_saved = true;
}

  function insert_teams_into_table(body,game_name)
  {
    for(var i=0; i < body.length;i++)
    {
      ////console.log("Pushing: "+body[i].team_name);
      if(body[i].has_initiative_token == true)
      {
        has_init = 1;
      }
      else
      {
        has_init = 0;
      }
      var turnOrder = i+1;
      db.run("INSERT INTO SavedTeamsTable(SavedGameName,TeamName,HasInitiative,TurnOrder) VALUES(?,?,?,?)",game_name,body[i].team_name,has_init,turnOrder);
    }
    //console.log("END insert_teams_into_table...");
    game_data_save_checker.team_info_saved = true;
  }

function insert_upgrades_in_db(body,game_name)
{
  for(var i=0; i < body.length;i++)
  {
    for(var j=0;j < body[i].ship_list.length;j++)
    {
        for(var k=0; k < body[i].ship_list[j].upgrades.length;k++)
        {
           var current_upgrade = body[i].ship_list[j].upgrades[k];
           var team_name = body[i].team_name;
           var roster_number = body[i].ship_list[j].roster_number;
           db.run("INSERT INTO upgradeList(GameName,UpgradeID,TeamName,RosterNumber,OrdnanceTokens,AllocatedEnergy,Orientation)VALUES(?,?,?,?,?,?,?)",game_name,current_upgrade.upgrade.id,team_name,roster_number,current_upgrade.ordnance_tokens,current_upgrade.energy_allocated,current_upgrade.orientation);
        }
    }
  }
  game_data_save_checker.upgrade_info_saved = true;
}

function insert_ships_in_db(body,game_name)
{
    for(var i=0; i < body.length;i++)
    {
      ////console.log("Team number = "+(i+1));
      for(var j=0; j < body[i].ship_list.length;j++)
      {
          ////console.log("Ship number = "+(j+1));
          var current_ship = body[i].ship_list[j];//Just to make things look better and more readable.
          var turnOrder = j+1;
          //var upgrade_numbers = "";
          var crit_hit_numbers = "";
          var condition_numbers = "";
          var aft_showing = 0;
          var chosen_maneuver = null;
          /*for(var k =0; k < current_ship.upgrades.length;k++)
          {
            upgrade_numbers+=current_ship.upgrades[k].id+"*";
          }
          if(upgrade_numbers.slice(-1)=="*")//trim end of string.
          {
            upgrade_numbers = upgrade_numbers.slice(0,-1);
          }*/
          for(var k=0; k < current_ship.critical_hit_cards.length;k++)
          {
            crit_hit_numbers+=current_ship.critical_hit_cards[k].id+"*";
          }
          if(crit_hit_numbers.slice(-1)=="*")//trim end of string.
          {
            cirt_hit_numbers = crit_hit_numbers.slice(0,-1);
          }
          for(var k=0; k < current_ship.conditions.length;k++)
          {
            condition_numbers+=current_ship.conditions[k].id+"*";
          }
          if(condition_numbers.slice(-1)=="*")//trim end of string.
          {
            condition_numbers = condition_numbers.slice(0,-1);
          }
          ////console.log("chosen maneuver: "+current_ship.chosen_maneuver);
          if(current_ship.chosen_maneuver!= null && current_ship.chosen_maneuver!= undefined)
          {
            ////console.log("we're in!");
            chosen_maneuver = current_ship.chosen_maneuver;
          }
          if(current_ship.aft_showing == true)
          {
            aft_showing = 1;
          }
          else
          {
            aft_showing = 0;
          }


          if(current_ship.chosen_pilot.ship_name.ship_type == "largeTwoCard")
          {    
            ////console.log("INSERTING LARGE SHIP TWO CARDS!");      
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy,CurrentAftAgility,CurrentAftShields,CurrentAftHull,AftShowing)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill,current_ship.current_energy,current_ship.current_aft_agility,current_ship.current_aft_shields, current_ship.current_aft_hull,aft_showing);
          }
          else if(current_ship.chosen_pilot.ship_name.ship_type == "largeOneCard")
          {
            ////console.log("INSERTING LARGE SHIP ONE CARD!");
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill,current_ship.current_energy);
          }
          else
          {
            ////console.log("INSERTING NORMAL SHIP!");
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill);
                                    //         1           2         3        4         5            6           7          8             9             10          11               12              13         14             15              16            17          18           19             20             21            22            23                                                                  1              2                  3            4                5                 6                    7                            8                    9                    10                         11                              12                            13                       14                           15                            17                         18                        19                        20                           21                           22                            23                         24
          }
      }
    }
    //console.log("ALL DONE WITH SHIPS!");
    game_data_save_checker.ship_info_saved = true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function overwrite_game(body)
{
  await delete_old_data(body[body.length-1].save_game_name);
  var interval = setInterval(()=>{if(game_data_overwrite_freeplay_checker.old_data_deleted == true){clearInterval(interval);save_game(body);}},500);
}

async function overwrite_game_gc(body)
{
  await delete_old_data_gc(body.game_name);
  establish_database_connection("saved_games").then(async ()=>{
    await delete_old_data(body.game_name);
    establish_database_connection("saved_games_gc").then(()=>{
      var interval = setInterval(()=>{if(game_data_overwrite_gc_checker.gc_data_deleted == true){clearInterval(interval);save_game_gc(body);}},500);
    });
  });
}

////////////FUNCTIONS FOR DELETEING OLD DATA/////////////////////////////////////////////////////////////////////////
function delete_old_data(game_name)
{
  db.run("DELETE FROM GameIdentifiers WHERE GameName = '"+game_name+"'");
  db.run("DELETE FROM SavedTeamsTable WHERE SavedGameName = '"+game_name+"'");
  db.run("DELETE FROM SavedShips WHERE SaveGameName = '"+game_name+"'");
  db.run("DELETE FROM TurnInfo WHERE SaveGameName = '"+game_name+"'");
  db.run("DELETE FROM TargetLockList WHERE SaveGameName = '"+game_name+"'");
  db.run("DELETE FROM upgradeList WHERE GameName = '"+game_name+"'");
  db.run("DELETE FROM SavedReminders WHERE GameName ='"+game_name+"'")
  //console.log("Old data from save db has been deleted.")
  game_data_overwrite_freeplay_checker.old_data_deleted = true;
}

function delete_old_data_gc(game_name)
{
  db.run("DELETE FROM GameData WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM GameIdentifiers WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM PirateRosterNumbers WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM PirateShipData WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM SavedFactions WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM SavedListOfTheDead WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM SavedNavies WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM SavedPlanetData WHERE GameName ='"+game_name+"'")
  db.run("DELETE FROM SavedSetUpData WHERE GameName ='"+game_name+"'");
  //console.log("Old data from gc save db has been deleted.")
  game_data_overwrite_gc_checker.gc_data_deleted = true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_game_gc(body)
{
  //Data from db comes back in arrays so I just wanted to grab element zero from those.
  var game_name = body;
   //console.log("GC LOAD BODY: "+body);
   query("SELECT * FROM GameData WHERE GameName = ?",game_name).then( turn_data=>{
    if(turn_data.length == 1)
    {
      loading_raw_data_gc.turn_data = turn_data[0];
    }
    else if(info.length > 1)
    {
      //console.log("ERROR: Data grabbed from the db for turn info came back with more than one array entry. Defaulting to first element of array.");
      loading_raw_data_gc.turn_data = turn_data[0];
    }
    else
    {
      //console.log("ERROR: Data grabbed from the db for turn info is invalid.");
      loading_raw_data_gc.turn_data = turn_data;
    }
    game_data_gc_load_checker.gc_turn_data = true;
})
   query("SELECT * FROM PirateRosterNumbers WHERE GameName = ?",game_name).then( all_roster_numbers=>{

    all_roster_numbers.forEach(roster=>{
      loading_raw_data_gc.pirate_roster_numbers.push(roster.Roster);
    })
    game_data_gc_load_checker.pirate_rosters = true;
})
   query("SELECT * FROM PirateShipData WHERE GameName = ?",game_name).then( pirate_ship_data=>{
    if(pirate_ship_data.length == 1)
    {
      loading_raw_data_gc.pirate_ship_quantities = pirate_ship_data[0];
    }
    else if(gc_set_up_data.length > 1)
    {
      //console.log("ERROR: Data grabbed from the db for setup info came back with more than one array entry. Defaulting to first element of array.");
      loading_raw_data_gc.pirate_ship_quantities = pirate_ship_data[0];
    }
    else
    {
      //console.log("ERROR: Data grabbed from the db for setup info is invalid.");
      loading_raw_data_gc.pirate_ship_quantities = pirate_ship_data;
    }
    game_data_gc_load_checker.pirate_data = true;
})
   query("SELECT * FROM SavedFactions WHERE GameName = ?",game_name).then( faction_data=>{
    loading_raw_data_gc.faction_data = faction_data;
    game_data_gc_load_checker.faction_data = true;
})
   query("SELECT * FROM SavedListOfTheDead WHERE GameName = ?",game_name).then( dead_people_list=>{
    loading_raw_data_gc.list_of_the_dead = dead_people_list;
    game_data_gc_load_checker.dead_people_data = true;
})
   query("SELECT * FROM SavedNavies WHERE GameName = ?",game_name).then( navy_data=>{
    loading_raw_data_gc.navies = navy_data;
    game_data_gc_load_checker.navy_data = true;
})
   query("SELECT * FROM SavedPlanetData WHERE GameName = ?",game_name).then( planet_data=>{
    loading_raw_data_gc.planet_data = planet_data;
    game_data_gc_load_checker.planet_data = true;
})
   query("SELECT * FROM SavedSetUpData WHERE GameName   = ?",game_name).then( gc_set_up_data=>{
    if(gc_set_up_data.length == 1)
    {
      loading_raw_data_gc.set_up_data = gc_set_up_data[0];
    }
    else if(gc_set_up_data.length > 1)
    {
      //console.log("ERROR: Data grabbed from the db for setup info came back with more than one array entry. Defaulting to first element of array.");
      loading_raw_data_gc.set_up_data = gc_set_up_data[0];
    }
    else
    {
      //console.log("ERROR: Data grabbed from the db for setup info is invalid.");
      loading_raw_data_gc.set_up_data = gc_set_up_data;
    }
    game_data_gc_load_checker.setup_data = true;
})
//Get ship data from saved ship db.
var interval = setInterval(()=>{if(check_game_data_load_gc_checker()){
  establish_database_connection("saved_games").then(()=>{
    clearInterval(interval);
    load_game(body);
  })
}},500);
}

function load_game(body)
{
    var game_name = body;
    ////console.log("game name is: "+game_name);
        query("SELECT * FROM SavedTeamsTable WHERE SavedGameName = ? ORDER BY TurnOrder Asc",game_name).then( team_names=>{
        loading_raw_data.team_data = team_names;
        game_data_freeplay_load_checker.team_data = true;
    })
        query("SELECT * FROM SavedShips WHERE SaveGameName = ? ORDER BY TurnOrder Asc",game_name).then(ships=>{
        loading_raw_data.ship_data = ships;
        game_data_freeplay_load_checker.ship_data = true;
    })
        query("SELECT * FROM TurnInfo WHERE SaveGameName = ?",game_name).then(info=>{
          loading_raw_data.turn_data = info;
          game_data_freeplay_load_checker.turn_data = true;
  })
        query("SELECT * FROM TargetLockList WHERE SaveGameName = ?",game_name).then(locks=>{
        loading_raw_data.target_lock_data = locks;
        game_data_freeplay_load_checker.target_lock_data = true;
})
        query("SELECT * FROM upgradeList WHERE GameName = ?",game_name).then(upgrades=>{
        loading_raw_data.upgrade_data = upgrades;
        game_data_freeplay_load_checker.upgrade_data = true;
})
        query("SELECT * FROM SavedReminders WHERE GameName = ?",game_name).then(reminders=>{
        loading_raw_data.reminders = reminders;
        game_data_freeplay_load_checker.reminder_data = true;
}) 
}