/**
 * Require Section
 */
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
const ship_page = require('./JS Data Classes/Ship-Variants.js');
const maneuver_page = require('./JS Data Classes/Maneuvers.js');
const pilot_page = require('./JS Data Classes/Pilot-Variants');
const card_page = require('./JS Data Classes/card-Variants');
const http = require('http');
const { parse } = require('path');
const { Console } = require('console');

/**
 * End Require Section
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
  team_data: [],
  ship_data: [],
  turn_data: undefined,
  target_lock_data:[]
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
  console.log(request.url);
  if(request.url == "/get_data")//Get all data at the start of the game.
  {
    establish_database_connection("game_data");
    get_crit_cards_data();
    get_condition_data();
    get_upgrade_data();   
    get_large_crit_hit_data();
    get_maneuver_data();
    get_planet_data();
    get_map_paths();
    //I needed to use chain function calling here because I was not able to achieve the load order that I wanted in any other way. 
    //Therefore, each function will call the next one within its promise to ensure the load order of the database while the response
    //must wait three seconds before returning to ensure that the game_data object is fully created before returning.
    /*get_ship_data();
    get_pilot_data();
    add_large_ship_data();
    close_database_connection();*/
    setTimeout(()=>{response.end(JSON.stringify(game_data))},3000);
  }
  else if(request.url == "/save_game")//Save a game.
  {
    establish_database_connection("saved_games");
    let body = '';
    request.on('data', chunk => {
    body += chunk.toString();});
    request.on('end', () => {
      body = JSON.parse(body);
      save_game(body); 
    })
    setTimeout(()=>{response.end('ok')},10000); 
  }
  else if(request.url == "/load_game")//Load a game.
  {
    establish_database_connection("saved_games");
    let body = '';
    loading_raw_data.team_data = [];
    loading_raw_data.ship_data = [];
    loading_raw_data.target_lock_data = [];
    loading_raw_data.turn_data = undefined;
    request.on('data', chunk => {
    body += chunk.toString();});
    request.on('end', () => {
      body = JSON.parse(body);
      load_game(body);
    })
    setTimeout(()=>{response.end(JSON.stringify(loading_raw_data))},3000);
  }
  else if(request.url == "/overwrite_game")//overwite a game.
  {
    establish_database_connection("saved_games");
    let body = '';
    request.on('data', chunk => {
    body += chunk.toString();});
    request.on('end', () => {
      body = JSON.parse(body);
      overwrite_game(body);
      //delete_old_data(body);
    })
    setTimeout(()=>{response.end('ok')},10000);
  }
  else if(request.url == "/get_game_names")//get all names of currently saved games.
  {
    establish_database_connection("saved_games");
    var game_names = get_game_names();
    setTimeout(()=>{response.end(JSON.stringify(game_names))},3000);
  }
  else
  {
    response.statusCode = 400;
    response.statusMessage = "ERROR: Invlaid URL";
    response.end();
  }
});
var port = process.env.PORT||3000;
server.listen(port);
/**
 * End Main Response Function
 */

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
      ship_list.push(new ship_page.ship(element.ShipType, element.Name, element.Attack, element.Agility, element.Shields, element.Hull,maneuvers_for_this_ship,element.ManeuverCard,element.Role));
      });
      console.log("SMALL/MEDUIM SHIP LOADED. LENGTH: "+ship_list.length);
      game_data.ship_list = ship_list;
      get_pilot_data();
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
    console.log("SMALL/MEDIUM SHIP MANEUVERS LOADED. LENGTH: "+all_maneuvers.length);
    game_data.all_maneuvers = all_maneuvers;
    get_large_maneuver_data();
    return all_maneuvers;
  })

}

function get_planet_data()
{
  var tables = query("SELECT * FROM Planets").then( tables=>{
    var all_planets = [];
    tables.forEach(element => {
      all_planets.push({name: element.Name, id: element.ID, image_path:element.ImagePath, x_coordinate: element.X_Coordinate, y_coordinate: element.Y_Coordinate});
    })
    console.log("PLANETS LOADED. LENGTH: "+all_planets.length);
    game_data.all_planets = all_planets;
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
    console.log("MAP PATHS LOADED. LENGTH: "+all_paths.length);
    game_data.map_paths = all_paths;
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
  console.log("LARGE SHIP MANEUVERS LOADED. LENGTH: "+all_maneuvers.length);
  game_data.all_maneuvers = game_data.all_maneuvers.concat(all_maneuvers);
  get_ship_data();
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
        if(game_data.ship_list[iteration].ship_name == element.ShipName)
        {
          ship_object = game_data.ship_list[iteration];
          break;
        }
        iteration ++;
      }
      all_pilots.push(new pilot_page.pilot(element.Name, element.Faction, element.PilotSkill, element.Cost,element.UpgradeTypes.split('*'),ship_object, element.ImagePath,unique_pilot,element.ID));
    })
    game_data.all_pilots = all_pilots;
    console.log("PILOTS COMPLETE. LENGTH: "+all_pilots.length);
    add_large_ship_data();
    return all_pilots;
  })
}

function get_upgrade_data(){
  var all_upgrades = [];
  var tables = query("SELECT * FROM UpgradesTable")
  .then(tables=>{
    tables.forEach(element => {
      if(element.Characteristics != null && Array.from(element.Characteristics.split('*')).includes("Dual"))
      {
        console.log(element.Name+" is a dual sided upgrade.");
        all_upgrades.push(new card_page.DualSidedUpgrade(element.Name, element.Type, element.Cost, element.Characteristics, element.ImagePath,element.ID));
      }
      else
      {
        all_upgrades.push(new card_page.UpgradeCard(element.Name, element.Type, element.Cost, element.Characteristics, element.ImagePath,element.ID));  
      }
  
    })
    console.log("UPGRADE CARDS COMPLETE. LENGTH: "+all_upgrades.length);
    game_data.all_upgrades = all_upgrades;
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
    console.log("CONDITION CARDS COMPLETE. LENGTH: "+all_conditions.length);
    game_data.all_conditions = all_conditions;
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
    console.log("CRITICAL HIT CARDS COMPLETE. LENGTH: "+all_crit_cards.length);
    game_data.all_crit_cards = all_crit_cards;
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
    console.log("LARGE CRITICAL HIT CARD COMPLETE. LENGTH: "+large_crit_hits.length);
    game_data.all_large_crit_hit_cards = large_crit_hits;
    return large_crit_hits;
  })
}

function get_game_names()
{
  var names = [];
  var tables = query("SELECT * FROM GameIdentifiers")
  .then(tables=>{
    tables.forEach(element=>{
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

function establish_database_connection(db_connection_name)
{
if(db_connection_name == "game_data")
{
  var dbExists = fs.existsSync('./GameDB.db');
if(dbExists)
{
//open the database connection
  db = new sqlite3.Database('./GameDB.db', sqlite3,(err)=>{
    if(err != null)
    {
        console.log(err);    
        return;  
    }
 });
 console.log("Connection Established");
}
}
else if(db_connection_name == "saved_games")
{
  var dbExists = fs.existsSync('./GameDB.db');
if(dbExists)
{
//open the database connection
  db = new sqlite3.Database('./SavedGameInfoDB.db', sqlite3,(err)=>{
    if(err != null)
    {
        console.log(err);    
        return;  
    }
 });
 console.log("Connection Established");
}
}
}



function close_database_connection()
{
   // close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closing the database connection.');
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
        console.log("pushing one");
        let ship_to_push = new ship_page.Large_Ship_Two_Cards(element.LargeShipType,element.Name,element.Attack,0,element.ForeShields, 
          element.ForeHull, maneuvers_for_this_ship, element.Energy,0,element.AftHull, element.AftShields,element.CrippledAttack,
          element.CrippledEnergy, fore_crit_cards, aft_crit_cards, element.ManeuverCard,element.Role)
          game_data.ship_list.push(ship_to_push);
          game_data.all_pilots.push(new pilot_page.largeShipTwoCardPilot(element.Name+" Pilot", element.Faction,element.PilotSkill, element.Cost, 
          element.UpgradeTypes.split('*'), ship_to_push,element.ForeImage,false, element.AftImage, element.CrippledForeImage, element.CrippledAftImage,element.ID));
        }
      else if(element.LargeShipType == "largeOneCard")
      {
        console.log("pushing two");
        let ship_to_push = new ship_page.Large_Ship_One_Card(element.LargeShipType,element.Name,0,0,element.ForeShields, 
          element.ForeHull, maneuvers_for_this_ship, element.Energy, fore_crit_cards, aft_crit_cards, element.ManeuverCard,element.Role);
        game_data.ship_list.push(ship_to_push);
        game_data.all_pilots.push(new pilot_page.pilot(element.Name+" Pilot", element.Faction,element.PilotSkill, element.Cost, element.UpgradeTypes.split('*'), ship_to_push,element.ForeImage,false,element.ID));
      }
      else
      {
        console.log("Could not determine the ship type of ship: "+ element.Name);
      }
    })
    console.log("LARGE SHIP LOADED");
  })
}





////CODE FOR SAVING/OVERWRITING GAMES////////////////////////////////////////////////////////////////
async function save_game(body)
{
  var game_name = body[body.length-1].save_game_name;
  var save_game_phase = body[body.length-1].save_game_phase;
  var target_locks = body[body.length-1].target_locks;
  body.pop();//Get rid of save name and phase

  insert_save_game_info(game_name);
  insert_turn_info(game_name,save_game_phase);
  insert_teams_into_table(body, game_name);
  insert_ships_in_db(body,game_name);
  if(target_locks !=null && target_locks != undefined)
  {
    if(target_locks.length>0)
    {
      insert_target_locks_in_db(game_name,target_locks);
    }
  }
}

function insert_target_locks_in_db(game_name,target_locks)
{
  target_locks.forEach(lock=>{
    db.run("INSERT INTO TargetLockList(SaveGameName,assignmentNumber,targettingTeamName,targettingRoster,targettedTeamName,targettedRoster) VALUES(?,?,?,?,?,?)",game_name,lock.assignment_number, lock.targetting_team, lock.targetting_roster, lock.targetted_team, lock.targetted_roster);
  })
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
   console.log(save_game_phase);
}

function insert_save_game_info(game_name)
{
  console.log("Begin insert_save_game_info...")
  db.run("INSERT INTO GameIdentifiers(GameName) VALUES(?)",game_name);
}

  function insert_teams_into_table(body,game_name)
  {
    for(var i=0; i < body.length;i++)
    {
      console.log("Pushing: "+body[i].team_name);
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
    console.log("END insert_teams_into_table...")
  }

function insert_ships_in_db(body,game_name)
{
    for(var i=0; i < body.length;i++)
    {
      console.log("Team number = "+(i+1));
      for(var j=0; j < body[i].ship_list.length;j++)
      {
          console.log("Ship number = "+(j+1));
          var current_ship = body[i].ship_list[j];//Just to make things look better and more readable.
          var turnOrder = j+1;
          var upgrade_numbers = "";
          var crit_hit_numbers = "";
          var condition_numbers = "";
          var aft_showing = 0;
          var chosen_maneuver = null;
          for(var k =0; k < current_ship.upgrades.length;k++)
          {
            upgrade_numbers+=current_ship.upgrades[k].id+"*";
          }
          if(upgrade_numbers.slice(-1)=="*")//trim end of string.
          {
            upgrade_numbers = upgrade_numbers.slice(0,-1);
          }
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
          console.log("chosen maneuver: "+current_ship.chosen_maneuver);
          if(current_ship.chosen_maneuver!= null && current_ship.chosen_maneuver!= undefined)
          {
            console.log("we're in!");
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
            console.log("INSERTING LARGE SHIP TWO CARDS!");      
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy,CurrentAftAgility,CurrentAftShields,CurrentAftHull,AftShowing)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,upgrade_numbers,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill,current_ship.current_energy,current_ship.current_aft_agility,current_ship.current_aft_shields, current_ship.current_aft_hull,aft_showing);
          }
          else if(current_ship.chosen_pilot.ship_name.ship_type == "largeOneCard")
          {
            console.log("INSERTING LARGE SHIP ONE CARD!");
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,upgrade_numbers,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill,current_ship.current_energy);
          }
          else
          {
            console.log("INSERTING NORMAL SHIP!");
            db.run("INSERT INTO SavedShips(SaveGameName,TeamName,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,CloakTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",game_name,current_ship.team_name,turnOrder,upgrade_numbers,crit_hit_numbers,condition_numbers,current_ship.chosen_pilot.id,current_ship.roster_number,chosen_maneuver,current_ship.stress_tokens,current_ship.ion_tokens,current_ship.weapons_disabled_tokens,current_ship.focus_tokens,current_ship.jam_tokens,current_ship.tractor_beam_tokens,current_ship.reinforce_tokens,current_ship.cloak_tokens,current_ship.evade_tokens,current_ship.current_attack,current_ship.current_agility,current_ship.current_sheilds,current_ship.current_hull,current_ship.current_pilot_skill);
                                    //         1           2         3        4         5            6           7          8             9             10          11               12              13         14             15              16            17          18           19             20             21            22            23                                                                  1              2                  3            4                5                 6                    7                            8                    9                    10                         11                              12                            13                       14                           15                            17                         18                        19                        20                           21                           22                            23                         24
          }
      }
    }
    console.log("ALL DONE WITH SHIPS!");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function overwrite_game(body)
{
  delete_old_data(body);
  setTimeout(()=>{save_game(body)},1000);
}


////////////FUNCTIONS FOR DELETEING OLD DATA/////////////////////////////////////////////////////////////////////////
function delete_old_data(body)
{
  var game_name = body[body.length-1].save_game_name;
  db.run("DELETE FROM GameIdentifiers WHERE GameName = '"+game_name+"'");
  db.run("DELETE FROM SavedTeamsTable WHERE SavedGameName = '"+game_name+"'");
  db.run("DELETE FROM SavedShips WHERE SaveGameName = '"+game_name+"'");
  db.run("DELETE FROM TurnInfo WHERE SaveGameName = '"+game_name+"'");
  db.run("DELETE FROM TargetLockList WHERE SaveGameName = '"+game_name+"'");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var loading_raw_data={
  game_phase: "",
  team_data: [],
  ship_data: []
}
*/
function load_game(body)
{
    var game_name = body;
    console.log("game name is: "+game_name);
        query("SELECT * FROM SavedTeamsTable WHERE SavedGameName = ? ORDER BY TurnOrder Asc",game_name).then( team_names=>{
        team_names.forEach(element=>{
        loading_raw_data.team_data.push(element);
        })
    })
        query("SELECT * FROM SavedShips WHERE SaveGameName = ? ORDER BY TurnOrder Asc",game_name).then(ships=>{
        ships.forEach(element=>{
        loading_raw_data.ship_data.push(element);
        })
    })
        query("SELECT * FROM TurnInfo WHERE SaveGameName = ?",game_name).then(info=>{
      info.forEach(element=>{
      loading_raw_data.turn_data = element;
      })
  })
        query("SELECT * FROM TargetLockList WHERE SaveGameName = ?",game_name).then(locks=>{
        locks.forEach(element=>{
        loading_raw_data.target_lock_data.push(element);
    })
})
}