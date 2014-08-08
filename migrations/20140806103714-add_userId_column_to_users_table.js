module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn(
    	"saveditems",
    	"userId",
    	{
    		type:DataTypes.INTEGER,
    		foreignKey:true
    	})
    .complete(done)
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn("saveditems", "userId")
    .complete(done)
  }
}
