const target_lock_status = {
    red: 'red',
    blue: 'blue'
}

class target_lock{
    constructor(assignment_number, image_path, status)
    {
        
        this.assignment_number = assignment_number;
        this.image_path = image_path;
        this.status = status;
    }
}

class in_game_ship_status{
    //This constructor will set a default state based on the pilot sent to it.
    constructor(incoming_pilot, team_name)
    {
        this.upgrades = [];
        this.target_locks = [];
        this.critical_hit_cards = [];
        this.chosen_pilot = incoming_pilot;
        this.roster_number = 0;
        this.chosen_maneuver = undefined;
        this.team_name = team_name;
        this.conditions = [];
        this.stress_tokens = 0;
        this.ion_tokens = 0;
        this.weapons_disabled_tokens = 0;
        this.focus_tokens = 0;
        this.jam_tokens = 0;
        this.tractor_beam_tokens = 0;
        this.reinforce_tokens = 0;
        this.cloak_tokens = 0;
        this.evade_tokens = 0;
        this.current_attack = this.chosen_pilot.ship_name.attack;
        this.current_agility = this.chosen_pilot.ship_name.agility;
        this.current_sheilds = this.chosen_pilot.ship_name.shields;
        this.current_hull = this.chosen_pilot.ship_name.hull;
        this.current_pilot_skill = this.chosen_pilot.pilot_skill;
    }
}

class large_one_card_in_game_ship_status extends in_game_ship_status{
        constructor(incoming_pilot,team_name)
        {
            super(incoming_pilot, team_name);
            this.current_energy = incoming_pilot.ship_name.energy;
        }
}

class large_two_card_in_game_ship_status extends in_game_ship_status{
    constructor(incoming_pilot, team_name)
    {
        super(incoming_pilot, team_name);
        this.current_energy = incoming_pilot.ship_name.energy;
        this.current_aft_agility = incoming_pilot.ship_name.aft_agility;
        this.current_aft_shields = incoming_pilot.ship_name.aft_shields;
        this.current_aft_hull = incoming_pilot.ship_name.aft_hull;
        this.fore_crippled = false;
        this.aft_crippled = false;
    }
}

class team{
    constructor(name)
    {
        this.team_name = name;
        this.has_initiative_token = false;
        this.ship_list = [];
    }
}

//Calculate cost of a single ship. input: ship.
function Calculate_cost_of_ship(to_calculate)
{
    var cost = 0;
    //add cost of pilot.
    cost += to_calculate.chosen_pilot.cost;
    //Add cost of each upgrade.
    to_calculate.upgrades.forEach(upgrade =>{
    cost+= upgrade.cost;
    })
    return cost;
}
//Calculate cost of a team input: team.
function Calculate_cost_of_team(to_calculate)
{
    var cost = 0;
    if(to_calculate.ship_list != undefined && to_calculate.ship_list != null)
    {
        to_calculate.ship_list.forEach(ship =>{
            cost += Calculate_cost_of_ship(ship);
        })
    }
    return cost;
}