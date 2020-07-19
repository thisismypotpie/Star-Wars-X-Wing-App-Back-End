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
    constructor(name, type, cost, characteristics, image_path,id)
    {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.characteristics = characteristics;
        this.image_path = image_path;
        this.id = id;
    }
}
module.exports.UpgradeCard = UpgradeCard;

class DualSidedUpgrade extends UpgradeCard{
    constructor(name, type, cost, characteristics, image_path,id)
    {
        super(name, type, cost, characteristics, image_path,id);
        this.orientation = "front";
    }
}
module.exports.DualSidedUpgrade = DualSidedUpgrade;