module.exports = function (sequelize, DataTypes){
   var Saveditem = sequelize.define('saveditem', {
    item: DataTypes.STRING,
    userId: DataTypes.INTEGER
    })
    return Saveditem;
}; // close User function
