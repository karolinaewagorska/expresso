const express = require('express');
const menuRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


menuRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'SELECT * FROM Menus WHERE menu.id = $menuId';
    const values = { $menuId: menuId }

    db.get(sql, values, (err, menu) => {
        if (err) {
            next(err);
        } else if (menu) {
            req.menu = menu;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

menuRouter.use('./menuId/menu-items', menuItemsRouter);

menuRouter.get('/', (req, res, next) => {
    db.all('SELECT * GROM Menus', (err, menus) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({menus: menus});
        }
    });
});

menuRouter.get('/:menuId', (req, res, next) => {
    res.sendStatus(200).json({menu: req.menu});
});


menuRouter.post('/', (req, res, next) => {
    const title = req.body.menu.title;
    if (!title) {
        res.sendStatus(400);
    }

    const sql = 'INSERT INTO Menus (title) VALUES ($title)';
    const values = {$title: title};

    db.run(sql, values, function(err) {
        if (err) {
            next(err)
        } else {
            db.get(`SELECT FROM Menus * WHERE Menus.id=${this.lastID}`, (error, menu) => {
                res.status(201).json({menu: menu});
            })
        }
     });
});


menuRouter.put('/:menuId', (req, res, next) => {
    const title = req.body.menus.title;
    if (!title) {
        res.sendStatus(400);
    };

    const sql = 'UPDATE Menus SET title=$title ' +
                'WHERE Menu.id=#menuId';
    const values = {
        $title: title,
        $menuId: req.params.menuId
    };
    db.run(sql, values, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`SELECT * FROM Menus WHERE Menus.id=${this.res.params.menusId}`, (err, menu) => {
                res.send(200).json({menu: menu});
            });
        }
    });
});


menuRouter.delete('/:menuId', (req, res, next) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id=$menuId';
    const values = { $menuId = req.params.menuId };
    db.get(sql, values, (err, menu) => {
        if (err) {
            next(err)
        } else if (menu) {
            return res.sendStatus(400)
        } else {
            const sqlDel = 'DELETE * FROM Menu WHERE Menu.id = $menuId';
            const valueDel = { $menuId: req.params.menuId };
            db.run(sqlDel, valueDel, function(err) {
                if (err) {
                    next(err);
                } else {
                    res.sendStatus(204);
                }
            });
        }
    });
});



module.exports = menuRouter