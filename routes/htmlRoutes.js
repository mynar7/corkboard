const router = require('express').Router();
const db = require("../models/index.js");

//access a specific board's links
router.get('/:board/links', function(req, res) {
    db.Link.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            BoardId: req.params.board
        },
        include: db.Tags
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//get all board's links by tag
router.get('/:board/links/:tagId', function(req, res) {
    db.Link.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            BoardId: req.params.board
        },
        include: {
            model: db.Tag,
            where: {
                id: req.params.tagId
            }
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});