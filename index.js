// Server initialization
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // In case PORT is missing in env, 3000 will be used in replace.

// Middleware Body parser
app.use(express.json());

// Welcoming server up
app.listen(PORT, () => { log(`${new Date().toISOString} -- Server is listening at port ${PORT}`) });

// ROUTES
app.post("/login");             // Authenticate
app.get("/users");              // Returns all info of user + hist ranking consumend dishes.
app.post("/users");             // Create a new user
app.get("/users/:id");          // Returns all info of all users.
app.put("/users/:id");          // Update user info
app.post("/users/:id/orders");  // Create a new order for the user.
app.get("/users/:id/orders/:id");  // Returns all info of all users.
app.delete("/users/:id/orders/:id");  // Cancell order.
app.get("/dishes");             // List all dishes
app.post("/dishes");            // Create a plate
app.put("/dishes");             // Modify the plate
app.delete("/dishes");          // Delete a plate
app.get("/orders", (req, res) => {  // List all orders
    const { at, before, after } = req.query;
});


// SQL
/*
Favourite plates will be the resulto of the following query
SELECT SUM(od.cantidad)
FROM Users as u INNER JOIN Orders as o ON u.id=o.id_user
INNER JOIN Order_Details as od ON o.id=od.id_order
WHERE u.id=1541231
*/