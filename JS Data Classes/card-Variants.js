class condition{
    constructor(name, image_path)
    {
        this.name = name;
        this.image_path = image_path;
    }
    
}
module.exports.condition = condition;

class criticalHitCard{
    constructor(name, image_path)
    {
        this.nam = name;
        this.image_path = image_path;
    }
}
module.exports.criticalHitCard = criticalHitCard;

class UpgradeCard{
    constructor(name, type, cost, characteristics, image_path )
    {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.characteristics = characteristics;
        this.image_path = image_path;
    }
}
module.exports.UpgradeCard = UpgradeCard;

class DualSidedUpgrade extends UpgradeCard{
    constructor(name, type, cost, characteristics, image_path)
    {
        this.orientation = "front";
    }
}
module.exports.DualSidedUpgrade = DualSidedUpgrade;