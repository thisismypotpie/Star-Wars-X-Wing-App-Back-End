class pilot{
    constructor(pilot_name, faction, pilot_skill, cost, ship_name, image_path, is_unique,id)
    {
        this.pilot_name = pilot_name;
        this.faction = faction;
        this.pilot_skill = pilot_skill;
        this.cost = cost;
        this.ship_name = ship_name;
        this.image_path = image_path;
        this.is_unique = is_unique;
        this.id = id;
    }
    
}
module.exports.pilot = pilot;

class largeShipTwoCardPilot extends pilot{
    constructor(pilot_name, faction, pilot_skill, cost, ship_name, image_path, uniquePilot,
         aft_card_path, fore_crippled_path, aft_crippled_path,id)
    {
        super(pilot_name, faction, pilot_skill, cost, ship_name, image_path, uniquePilot,id);
        this.aft_card_path = aft_card_path;
        this.fore_crippled_path = fore_crippled_path;
        this.aft_crippled_path = aft_crippled_path;
    }
}
module.exports.largeShipTwoCardPilot = largeShipTwoCardPilot;