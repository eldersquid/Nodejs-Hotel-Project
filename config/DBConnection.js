const { admin } = require('googleapis/build/src/apis/admin');
const mySQLDB = require('./DBConfig');
// const user = require('../models/User');
// const Admin = require('../models/Admin.js');
const Supplier = require('../models/Supplier.js');
const Inventory = require('../models/Inventory.js');
const Orders = require('../models/Orders.js');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Hotel La Bodo database connected');
        })
        .then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            // user.hasMany(video);

            // Supplier
            Supplier.hasMany(Inventory, { foreignKey: 'supplierId', as: "SupplierID" });
            Inventory.belongsTo(Supplier, { foreignKey: 'supplierId', as: "SupplierID" });

            Supplier.hasMany(Orders, { foreignKey: 'supplierId', as: "Supplier_ID" });
            Orders.belongsTo(Supplier, { foreignKey: 'supplierId', as: "Supplier_ID" });

            // Inventory
            // admin.hasMany(Inventory, {foreignKey: 'inventory_id'});
            // inventory.belongsTo(Admin, {foreignKey: 'inventory_id'});

            // Orders
            // admin.hasMany(Orders, { foreignKey: 'order_id' });
            // order.belongsTo(Admin, { foreignKey: 'order_id' });

            Orders.hasOne(Inventory, { foreignKey: 'ordersId', as: "OrdersID" });
            Inventory.belongsTo(Orders, { foreignKey: 'ordersId', as: "OrdersID" });

            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };