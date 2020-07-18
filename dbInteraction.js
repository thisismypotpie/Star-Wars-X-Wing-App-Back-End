
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
const { brotliDecompress } = require('zlib');
const { resolve } = require('path');
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
  all_conditions:[],
  all_upgrades:[],
};

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
    get_maneuver_data();
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
      save_game(body)  
    })
    response.end('ok');
  }
  else if(request.url == "/load_game")//Load a game.
  {
    establish_database_connection("saved_games");
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
    })
    response.end('ok');
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
var port = /*process.env.PORT||*/3000;
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
      var foreList = element.FrontCritImages.split('\n');
      var aftList = element.RearCritImages.split('\n');
      foreList.forEach(element => {
        var card_elements = element.split('*');
        fore_crit_cards.push(new card_page.criticalHitCard(card_elements[1], card_elements[0]));
      })
      aftList.forEach(element => {
        var card_elements = element.split('*');
        aft_crit_cards.push(new card_page.criticalHitCard(card_elements[1], card_elements[0]));
      })
  
  
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
  var game_id = 0;
  var team_name_and_id_list = [];
  body.pop();//Get rid of save name and phase.
    

    const savePromise = (new Promise((resolve, reject) => (insert_save_game_info(game_name, save_game_phase)))
    .then(game_id = await get_save_game_id(game_name))
    .then(await insert_teams_into_table(body, game_id))
    .then(team_name_and_id_list = await create_team_name_id_list())
    .then(console.log(team_name_and_id_list))
    .catch(err => console.log(err)))
}
  

function insert_save_game_info(game_name,save_game_phase)
{
  console.log("Begin insert_save_game_info...")
  db.run("INSERT INTO GameIdentifiers(GameName,GamePhase) VALUES(?,?)",game_name,save_game_phase)
  console.log("END insert_save_game_info...")
}

async function get_save_game_id(game_name)
{
  console.log("Begin get_save_game_id...")
  var game_id = 0;
  const tables = await query("SELECT ID FROM GameIdentifiers WHERE GameName = '"+game_name+"'")
  .then(tables=>{//Get ID
        for(var propName in tables) {
            game_id = tables[propName].ID
            console.log(`In get_save_game_id, before returning, game_id is ${game_id}`)
            return game_id;
        }
  })
  .catch(err => console.log(err))
  console.log(`END get_save_game_id... game_id is now ${game_id}`)
   return game_id;
}

  async function insert_teams_into_table(body,game_id)
  {
    console.log("Begin insert_teams_into_table...")
    for(var i =0; i < body.length;i++)
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
      var turnOrder = (i+1);
      db.run("INSERT INTO SavedTeamsTable(SavedGameID,TeamName,HasInitiative,TurnOrder) VALUES(?,?,?,?)",game_id,body[i].team_name,has_init,turnOrder)
    }
    console.log("END insert_teams_into_table...")
  }

  async function create_team_name_id_list()
  {
    console.log("Begin create_team_name_id_list...")
    var team_name_and_id_list=[];
    var team_tables = query("SELECT * FROM SavedTeamsTable") //WHERE SavedGameID = '"+game_id+"'")
    .then(team_tables=>{ //From here on out we will have to do a promise within a promise to keep order to events.
      console.log("team tables lengh: "+team_tables.length) ;
      team_tables.forEach(element=>{
         console.log("pushing new team.")
         team_name_and_id_list.push({team_name: element.TeamName, ID: parseInt(element.TeamID,10)});
         })
     })
     console.log("END create_team_name_id_list...")
     return team_name_and_id_list;
  }

function store_ships_in_db()
{
    console.log("Length: "+team_name_and_id_list.length);
    console.log("TEAM ID DISPLAY!")
    console.log(team_name_and_id_list);
    for(var i=0; i < body.length;i++)
    {
      for(var j=0; i < body[i].ship_list.length;j++)
      {
          var current_ship = body[i].ship_list[j];//Just to make things look better and more readable.
          var TeamID = 1;//placeholder.
          if(current_ship.ship_name.ship_type == "largeTwoCard")
          {
            
            db.run("INSERT INTO SavedShips(TeamID,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy,CurrentAftAgility,CurrentAftShields,CurrentAftHull,AftShowing)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",);
          }
          else if(current_ship.ship_name.ship_type == "largeOneCard")
          {
            db.run("INSERT INTO SavedShips(TeamID,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill,CurrentEnergy)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",);
          }
          else
          {
            db.run("INSERT INTO SavedShips(TeamID,TurnOrder,Upgrades,CritHitCards,Conditions,ChosenPilot,RosterNumber,ChosenManeuver,StressTokens,IonTokens,WeaponsDisabledTokens,FocusTokens,JamTokens,TractorBeamTokens,ReinforceTokens,EvadeTokens,CurrentAttack,CurrentAgility,CurrentShields,CurrentHull,CurrentPilotSkill)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",);
                                      
          }
      }
    }
}

function overwrite_game(body)
{
 db.run("UPDATE GameIdentifiers SET GamePhase = '"+body[body.length-1].save_game_phase+"' WHERE GameName = '"+body[body.length-1].save_game_name+"'")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////