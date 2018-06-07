const router = require('express').Router();
const db = require("../models/index.js");
const path = require("path");


router.get('/boards/:board', function(req, res) {
    db.Board.findOne({
        where: {
            id: req.params.board,
        },
        order: [
            [{model: db.Link, as: "links"},'updatedAt', 'DESC'],
            [{model: db.Tag, as: "tags"},'name', 'ASC'],
            [{model: db.Message, as: "messages"},'updatedAt', 'DESC']            
            
        ],
        include: [
            {
                model: db.Link,
                as: "links",
                include: {
                    model: db.Tag,
                    as: 'Tags',
                    attributes: ['id', 'name']
                }
            },
            {
                model: db.Tag,
                as: "tags"
            },
            {
                model: db.Message,
                as: 'messages'
            }
        ]
    }).then(results => res.render('index', {board: results}))
    .catch(err => res.json(err));
});

router.get('/boards/:board/tags/:tagId', function(req, res) {
    db.Board.findOne({
        where: {
            id: req.params.board
        },
        order: [
            [{model: db.Link, as: "links"},'updatedAt', 'DESC'],
            [{model: db.Tag, as: "tags"},'name', 'ASC'],
            [{model: db.Message, as: "messages"},'updatedAt', 'DESC']            
            
        ],
        include: [
            {
                model: db.Link,
                as: "links",
                include: {
                    model: db.Tag,
                    as: 'Tags',
                    attributes: ['id', 'name'],
                    where: {
                        id: req.params.tagId
                    }
                }
            },
            {
                model: db.Tag,
                as: "tags"
            },
            {
                model: db.Message,
                as: 'messages'
            }
        ]
    }).then(results => res.render('index', {board: results}))
    .catch(err => res.json(err));
});

router.post('/boards/:boardId/tags', function(req, res) {
    db.Board.findOne({
        where: {
            id: req.params.boardId
        },
        order: [
            [{model: db.Link, as: "links"},'updatedAt', 'DESC'],
            [{model: db.Tag, as: "tags"},'name', 'ASC'],
            [{model: db.Message, as: "messages"},'updatedAt', 'DESC']
        ],
        include: [
            {
                model: db.Link,
                as: "links",
                include: {
                    model: db.Tag,
                    as: 'Tags',
                    attributes: ['id', 'name'],
                    through: {
                        where: {
                            TagId: {
                                [db.Sequelize.Op.in]: req.body.tags
                            }
                        }
                    },
                    required: true
                }
            },
            {
                model: db.Tag,
                as: "tags"
            },
            {
                model: db.Message,
                as: 'messages'
            }
        ]
    }).then(results => {
            res.render('index', {board: results})
    })//res.redirect(`/boards/${req.params.boardId}`))
    .catch(err => res.json(err));
});

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "../public/front2/parallax.html"));
});

router.get('/boards/:board/*', function(req, res) {
    res.redirect(`/boards/${req.params.board}`);
});
router.get('*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
