/**
 * Define Checker Variables
 * This is used to confirm that data retrieval is complete for at least one of the following datatypes. 
 */
module.exports = {

game_data_grab_checker: {
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
  },
  
  //Checks to see if any types of data have been retrieved. 
  check_game_data_grabber: function()
  {
    //console.log(game_data_grab_checker);
    if(this.game_data_grab_checker.get_crit_hit_cards == false ||
       this.game_data_grab_checker.get_condition_cards == false ||
       this.game_data_grab_checker.get_upgrade_cards == false ||
       this.game_data_grab_checker.get_large_crit_hit_cards == false ||
       this.game_data_grab_checker.get_maneuver_cards == false ||
       this.game_data_grab_checker.get_large_maneuver_data == false ||
       this.game_data_grab_checker.get_large_ship_data == false ||
       this.game_data_grab_checker.get_ship_data == false ||
       this.game_data_grab_checker.get_pilot_data == false ||
       this.game_data_grab_checker.get_planet_data == false ||
       this.game_data_grab_checker.get_planet_paths == false)
    {
      return false;
    }
    else
    {
      return true;
    }
  },
  //Sets all booleans that make up the data grabber to false.   
  reset_game_data_grabber: function() 
  {
    this.game_data_grab_checker.get_crit_hit_cards =false
    this.game_data_grab_checker.get_condition_cards= false
    this.game_data_grab_checker.get_upgrade_cards= false
    this.game_data_grab_checker.get_large_crit_hit_cards= false
    this.game_data_grab_checker.get_maneuver_cards= false
    this.game_data_grab_checker.get_large_maneuver_data= false
    this.game_data_grab_checker.get_large_ship_data= false
    this.game_data_grab_checker.get_ship_data= false
    this.game_data_grab_checker.get_pilot_data= false
    this.game_data_grab_checker.get_planet_data= false
    this.game_data_grab_checker.get_planet_paths= false
  },
  
  //Acts as a confrimation that a specific type of game data was saved to the database. 
  game_data_save_checker: {
  game_info_saved: false,
  turn_info_saved: false,
  team_info_saved: false,
  ship_info_saved: false,
  upgrade_info_saved: false,
  reminder_info_saved: false,
  target_locks_saved: false
  },
  
  //Checks to see if any of the game save datatypes are missing. 
  check_game_data_save_checker: function()
  {
      //console.log(game_data_save_checker);
      if(  this.game_data_save_checker.game_info_saved == false|| 
        this.game_data_save_checker.turn_info_saved== false||
        this.game_data_save_checker.team_info_saved== false||
        this.game_data_save_checker.ship_info_saved== false||
        this.game_data_save_checker.upgrade_info_saved== false||
        this.game_data_save_checker.reminder_info_saved== false||
        this.game_data_save_checker.target_locks_saved== false)
      {
        return false;
      }
      else
      {
        return true;
      }
  },
  
  //Resets all of the game data type variables to false. Usually used if we need to do multiple saves at once. 
  reset_game_data_save_checker: function()
  {
    this.game_data_save_checker.game_info_saved = false
    this.game_data_save_checker.turn_info_saved= false
    this.game_data_save_checker.team_info_saved= false
    this.game_data_save_checker.ship_info_saved= false
    this.game_data_save_checker.upgrade_info_saved= false
    this.game_data_save_checker.reminder_info_saved= false
    this.game_data_save_checker.target_locks_saved= false
  },
  
  //Verifies that the old game data has been overwritten when saving a game. 
  game_data_overwrite_freeplay_checker:{
     old_data_deleted:false
  },
  check_game_data_overwrite_freeplay_checker: function()
  {
    //console.log(game_data_overwrite_freeplay_checker);
    if(this.check_game_data_save_checker() == false ||
       this.game_data_overwrite_freeplay_checker == false)
       {
         return false;
       }
    else
    {
      return true;
    }
  },
  
  
  reset_check_game_data_overwrite_freeplay_checker: function()
  {
    this.reset_game_data_save_checker();
    game_data_overwrite_freeplay_checker.old_data_deleted = false;
  },
  
  game_data_names_checker: {
     freeplay_names_grabbed: false,
     gc_names_grabbed: false
  },

  check_game_data_names_checker: function()
  {
    //console.log(game_data_names_checker)
    if(this.game_data_names_checker.freeplay_names_grabbed == false ||
       this.game_data_names_checker.gc_names_grabbed == false)
    {
       return false;
    }
    else
    {
      return true;
    }
  },

  reset_game_data_names_checker: function()
  {
    this.game_data_names_checker.freeplay_names_grabbed = false;
    this.game_data_names_checker.gc_names_grabbed = false;
  },

  game_data_freeplay_load_checker:{
    team_data: false,
    ship_data: false,
    turn_data: false,
    target_lock_data: false,
    upgrade_data: false,
    reminder_data: false
  },

  check_game_data_freeplay_load_checker: function()
  {
    //console.log(game_data_freeplay_load_checker);
      if(  this.game_data_freeplay_load_checker.team_data== false ||
        this.game_data_freeplay_load_checker.ship_data== false ||
        this.game_data_freeplay_load_checker.turn_data== false ||
        this.game_data_freeplay_load_checker.target_lock_data== false ||
        this.game_data_freeplay_load_checker.upgrade_data== false ||
        this.game_data_freeplay_load_checker.reminder_data== false )
      {
        return false;
      }
      else
      {
        return true;
      }
  },

  reset_game_data_freeplay_load_checker: function()
  {
    this.game_data_freeplay_load_checker.team_data= false
    this.game_data_freeplay_load_checker.ship_data= false
    this.game_data_freeplay_load_checker.turn_data= false
    this.game_data_freeplay_load_checker.target_lock_data= false
    this.game_data_freeplay_load_checker.upgrade_data= false
    this.game_data_freeplay_load_checker.reminder_data= false
  },
  
  game_data_gc_save_checker : {
    setup_data_saved: false,
    faction_data_saved: false,
    game_data_saved: false,
    pirate_data_saved: false
  },

  check_data_gc_save_checker: function()
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
  },

  check_total_gc_save_and_save_checker : function()
  {
      if(this.check_data_gc_save_checker() == false ||
         this.check_game_data_save_checker() == false)
      {
         return false;
      }
      else
      {
        return true;
      }
  },

  reset_gc_save_checker: function()
  {
    this.reset_game_data_save_checker();
    game_data_gc_save_checker.setup_data_saved= false
    game_data_gc_save_checker.faction_data_saved= false
    game_data_gc_save_checker.game_data_saved= false
    game_data_gc_save_checker.pirate_data_saved= false
  },
  
  game_data_overwrite_gc_checker:
  {
     gc_data_deleted: false
  },

  check_game_data_overwrite_gc_checker: function()
  {
    //console.log(game_data_overwrite_gc_checker);
    if(this.check_game_data_overwrite_freeplay_checker()==false ||
       game_data_overwrite_gc_checker.gc_data_deleted == false ||
       this.check_data_gc_save_checker()==false)
       {
         return false;
       }
    else
    {
      return true;
    }
  },

  reset_gc_overwrite_checker:function()
  {
    this.reset_check_game_data_overwrite_freeplay_checker();
    this.reset_gc_save_checker();
    game_data_overwrite_freeplay_checker.old_data_deleted = false;
  },
  
  game_data_gc_load_checker:{
    gc_turn_data: false,
    pirate_rosters: false,
    pirate_data: false,
    faction_data: false,
    dead_people_data: false,
    navy_data: false,
    planet_data: false,
    setup_data: false
  },

  check_game_data_load_gc_checker: function()
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
  },

  check_game_Data_entire_gc_load_check: function()
  {
    if(this.check_game_data_load_gc_checker() == false ||
    this.check_game_data_freeplay_load_checker() == false)
    {
      return false;
    }
    else
    {
      return true;
    }
  },

  reset_gc_load_checker: function()
  {
    this.reset_game_data_freeplay_load_checker();
    this.game_data_gc_load_checker.gc_turn_data = false 
    this.game_data_gc_load_checker.pirate_rosters = false
    this.game_data_gc_load_checker.pirate_data = false
    this.game_data_gc_load_checker.faction_data = false
    this.game_data_gc_load_checker.dead_people_data = false
    this.game_data_gc_load_checker.navy_data = false
    this.game_data_gc_load_checker.planet_data = false
    this.game_data_gc_load_checker.setup_data = false
  }
  /**
   * End Checker Variables
   */
};