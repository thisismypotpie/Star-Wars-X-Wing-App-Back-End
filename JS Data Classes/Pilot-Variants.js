class pilot{
    constructor(pilot_name, faction, pilot_skill, cost, upgrade_types, ship_name, image_path, is_unique)
    {
        this.pilot_name = pilot_name;
        this.faction = faction;
        this.pilot_skill = pilot_skill;
        this.cost = cost;
        this.upgrade_types = upgrade_types;
        this.ship_name = ship_name;
        this.image_path = image_path;
        this.is_unique = is_unique;
    }
    
}
module.exports.pilot = pilot;

class largeShipTwoCardPilot extends pilot{
    constructor(pilot_name, faction, pilot_skill, cost, upgrade_types, ship_name, image_path, uniquePilot,
         aft_card_path, fore_crippled_path, aft_crippled_path)
    {
        super(pilot_name, faction, pilot_skill, cost, upgrade_types, ship_name, image_path, uniquePilot);
        this.aft_card_path = aft_card_path;
        this.fore_crippled_path = fore_crippled_path;
        this.aft_crippled_path = aft_crippled_path;
    }
}
module.exports.largeShipTwoCardPilot = largeShipTwoCardPilot;