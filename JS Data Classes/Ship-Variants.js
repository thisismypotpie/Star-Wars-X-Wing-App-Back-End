const ship_types = {
    Small: 'small',
    Medium: 'medium',
    LargeOneCard: 'largeOneCard',
    LargeTwoCard: 'largeTwoCard'
}

class ship{
    constructor(id,ship_type, ship_name, attack, agility, shields, hull, maneuvers, card,role)
    {
        //constant ship info
        this.id = id;
        this.ship_type = ship_type;
        this.ship_name = ship_name;
        this.attack = attack;
        this.agility = agility;
        this.shields = shields;
        this.hull = hull;
        this.maneuvers = maneuvers;
        this.card = card;
        this.role = role;
    }
}

module.exports.ship = ship;

class Large_Ship_One_Card extends ship{
    constructor(id,ship_type, ship_name, attack, agility, shields, hull, maneuvers, energy,crit_hit_cards_fore, crit_hit_cards_aft, card,role)
    {
        super(id,ship_type, ship_name, attack, agility, shields, hull, maneuvers, card,role);
        this.energy = energy;
        this.crit_hit_cards_fore = crit_hit_cards_fore;
        this.crit_hit_cards_aft = crit_hit_cards_aft;
    }
}

module.exports.Large_Ship_One_Card = Large_Ship_One_Card;

class Large_Ship_Two_Cards extends Large_Ship_One_Card{
    constructor(id,ship_type, ship_name, attack, agility, shields, hull, maneuvers, 
        energy, aft_agility, aft_hull, aft_shields, crippled_attack, crippled_energy,crit_hit_cards_fore, crit_hit_cards_aft, card,role)
    {
        super(id,ship_type, ship_name, attack, agility, shields, hull, maneuvers,energy,crit_hit_cards_fore,crit_hit_cards_aft,card,role);
        //this.energy = energy;
        this.aft_agility = aft_agility;
        this.aft_hull = aft_hull;
        this.aft_shields = aft_shields;
        this.crippled_attack = crippled_attack;
        this.crippled_energy = crippled_energy;
        //this.crit_hit_cards_fore = crit_hit_cards_fore;
        //this.crit_hit_cards_aft = crit_hit_cards_aft;
    }
}
module.exports.Large_Ship_Two_Cards = Large_Ship_Two_Cards;