const router = require('express').Router();
const db = require("../models/index.js");

/*
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
    }).then(results => res.render('index', results))
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
    }).then(results => res.render('index', results))
    .catch(err => res.json(err));
});
*/
//access a specific board's links
router.get('/:board/links', function(req, res) {
    let results = {};
    db.Link.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            BoardId: req.params.board
        },
        include: [
            {
                model: db.Tag,
                attributes: ["name", "id"]
            }
        ]
    }).then(links => {
        results.links = links;
        db.Tag.findAll({
            where: {
                BoardId: req.params.board
            }
        }).then(tags => {
            results.tags = tags;
            db.Message.findAll({
                where: {
                    BoardId: req.params.board
                }
            }).then(msgs => {
                results.msgs = msgs;
                res.render("index", results);
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
});

//get all board's links by tag
router.get('/:board/links/:tagId', function(req, res) {
    /*
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
    */
    let results = {};
    db.Link.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            BoardId: req.params.board
        },
        include: [
            {
                model: db.Tag,
                attributes: ["name", "id"],
                where: {
                    id: req.params.tagId
                }
            }
        ]
    }).then(links => {
        results.links = links;
        db.Tag.findAll({
            where: {
                BoardId: req.params.board
            }
        }).then(tags => {
            results.tags = tags;
            db.Message.findAll({
                where: {
                    BoardId: req.params.board
                }
            }).then(msgs => {
                results.msgs = msgs;
                res.render("index", results);
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
});

router.get('/:board', function(req, res) {
    res.redirect(`/${req.params.board}/links`);
});

router.get('*', function(req, res) {
    res.render('home');
});

module.exports = router;