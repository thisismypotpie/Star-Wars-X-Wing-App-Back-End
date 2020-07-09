class Maneuver{
    constructor(id, maneuver_type, maneuver_color, range,range_symbol_path, maneuver_symbol_path){
        this.id = id;
        this.maneuver_type  = maneuver_type;
        this.maneuver_color = maneuver_color;
        this.range = range;
        this.maneuver_symbol_path = maneuver_symbol_path;
        this.range_symbol_path = range_symbol_path;
    }
}
//allows other files to use this class.
module.exports.Maneuver = Maneuver;

class Large_Maneuver extends Maneuver{
    constructor(id, maneuver_type, maneuver_color, range,range_symbol_path, maneuver_symbol_path,energy_symbol_path, energy_gained){
        super(id,maneuver_type, maneuver_color, range,range_symbol_path, maneuver_symbol_path);
        this.energy_symbol_path = energy_symbol_path;
        this.energy_gained = energy_gained;
    }
}
//allows other files to use this class.
module.exports.Large_Maneuver = Large_Maneuver;