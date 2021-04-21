class ship_group{
    constructor(group_name,faction,location)
    {
        this.group_name = group_name;
        this.faction = faction;
        this.border = get_correct_border(group_name.split(" ")[2],faction);
        this.team = new team(group_name);
        this.location = location;
        this.image = undefined;
        this.has_moved = false;
        if(faction == "Rebels")
        {
            this.image = "https://i.imgur.com/mO0iijb.png";
        }
        else if(faction == "Imperial")
        {
            this.image = "https://i.imgur.com/XgIWtvd.png";
        }
        else
        {
            alert("ERROR: Could not find faction for ship group.")
        }
    }
}
module.exports.ship_group = ship_group;


class gc_team{
    constructor(faction)
    {
        this.faction = faction;
        this.navy = [];
        this.currency = 0;
        this.fuel = 0;
        this.durasteel = 0;
        this.parts = 0;
        this.electronics = 0;
        this.tibanna = 0;
        this.list_of_the_fallen= [];
        this.highest_squad_number = 1;
        this.highest_fleet_number = 1;
        this.highest_armada_number = 1;
        this.image = undefined;
        if(faction == "Rebels")
        {
            this.image = "url(https://i.imgur.com/mO0iijb.png)";
        }
        else if(faction == "Imperial")
        {
            this.image = "url(https://i.imgur.com/XgIWtvd.png)";
        }
    }
}
module.exports.gc_team = gc_team;

class in_game_planet{
    constructor(planet)
    {
        this.controlling_faction= "Unaligned";
        this.planet = planet;
        this.resource = {
            name: undefined,
            image_path: undefined,
            quantity: 0,
            spawn_chance: 0
        };
    }
}
module.exports.in_game_planet = in_game_planet;