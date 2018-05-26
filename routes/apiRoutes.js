const router = require('express').Router();
const db = require("../models/index.js");

//create a new board
router.post('/newBoard', function(req, res) {
    db.Board.create({
        name: req.body.name
    });
});

//need to be able to access a specific board's links
router.get('/:board', function(req, res) {
    db.Link.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            BoardId: req.params.board
        },
        include: db.Tags
    }).then(function(results){
        res.json(results);
    });
});

//get all board's links by tag
router.get('/:board/:tagId', function(req, res) {
    db.Tag.findOne({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            id: req.params.tagId,
            BoardId: req.params.board
        },
        include: db.Links
    }).then(function(results) {
        res.json(results);
    });
});


//create a new link

//edit link info

//delete a link
module.exports = router;