class condition{
    constructor(name, image_path,id)
    {
        this.name = name;
        this.image_path = image_path;
        this.id = id;
    }
    
}
module.exports.condition = condition;

class criticalHitCard{
    constructor(name, image_path,id)
    {
        this.name = name;
        this.image_path = image_path;
        this.id = id;
    }
}
module.exports.criticalHitCard = criticalHitCard;

class UpgradeCard{
    constructor(name, type, cost, image_path,id,is_unique,is_limited,ship_specifics,Ship_size_specifics,rebel_only,imperial_only,scum_only,dual_sided)
    {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.is_unique = is_unique;
        this.is_limited = is_limited;
        this.is_dual_sided = dual_sided;
        this.ship_specifics = ship_specifics;
        this.ship_size_specifics = Ship_size_specifics;
        this.rebel_only = rebel_only;
        this.imperial_only = imperial_only;
        this.scum_only = scum_only;
        this.image_path = image_path;
        this.id = id;
        this.ordnance_tokens = 0;
    }
}
module.exports.UpgradeCard = UpgradeCard;

class DualSidedUpgrade extends UpgradeCard{
    constructor(name, type, cost, image_path,id,is_unique,is_limited,ship_specifics,Ship_size_specifics,rebel_only,imperial_only,scum_only,dual_sided)
    {
        super(name, type, cost, image_path,id,is_unique,is_limited,ship_specifics,Ship_size_specifics,rebel_only,imperial_only,scum_only,dual_sided);
        this.orientation = "front";
    }
}
module.exports.DualSidedUpgrade = DualSidedUpgrade;