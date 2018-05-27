const router = require('express').Router();
const db = require("../models/index.js");
const scrape = require('metatag-crawler');

//this route returns meta data from a url that's posted
router.post('/scrape', function(req, res) {
    let url = req.body.url;
    scrape(url, function(err, data) {
        if (err) return res.json({error: err});
        let meta;
        //check if there are facebook meta tags
        if(data.og) {
            meta = {
                title: data.og.title,
                description: data.og.description,
                url: data.og.url,
            }
            //ensure there's an image to return
            if(data.og.images[0]) meta.image = data.og.images[0].url
            res.json(meta);
        } else {
            meta = {
                title: data.meta.title,
                description: data.meta.description,
                url: data.meta.canonical,
            }
            if(data.images[0]) meta.image = data.images[0].url
            res.json(meta);
        }
    }); 
});

//create a new board
router.post('/newBoard', function(req, res) {
    db.Board.create({
        name: req.body.name
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//delete board
router.delete('/:board', function(req, res) {
    db.Board.destroy({
        where: {
            id: req.params.board
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

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


//create a new link
router.post('/:board/newLink', function(req, res) {
    db.Link.create({
        BoardId: req.params.board,
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        image_url: req.body.image_url
    }).then(function(results, err) {
        //tags should be an array of id numbers
        //if user sends tags, set those tags on newly created link
        if(req.body.tags) {
            results.setTags(req.body.tags)
            .then(result => res.json([results, result]))
            .catch(err => res.json(err));
        } else {
            res.json(results);
        }
    }).catch(err => res.json(err));
});

//edit link info
router.put('/:board/links/:linkId', function(req, res) {
    db.Link.update({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        image_url: req.body.image_url
    },
    {
        where: {
            BoardId: req.params.board,
            id: req.params.linkId
        }
    }
    ).then(results => {
        //tags should be an array of id numbers
        //if null is passed in, all associations will be removed,
        //therefore all tags are removed
        if(req.body.tags || req.body.tags === null) {
            db.Link.findOne({
                where: {
                    id : req.params.linkId
                }
            }).then(result => 
                result.setTags(req.body.tags)
                .then(tagResult => res.json([result, tagResult]))
                .catch(err => res.json(err))
            ).catch(err => res.json(err));
        } else {
            res.json(results);
        }
    }).catch(err => res.json(err));
});

//delete a link
router.delete('/:board/links/:linkId', function(req, res) {
    db.Link.destroy({
        where: {
            BoardId: req.params.board,
            id: req.params.linkId
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//get all tags
router.get('/:board/tags', function(req, res) {
    db.Tag.findAll({
        where: {
            BoardId: req.params.board
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//create a tag
router.post('/:board/newTag', function(req, res) {
    db.Tag.create({
        name: req.body.name,
        BoardId: req.params.board
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//delete a tag
router.delete('/:board/tags/:tagId', function(req, res) {
    db.Tag.destroy({
        where: {
            id: req.params.tagId
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//update a tag
router.put('/:board/tags/:tagId', function(req, res) {
    db.Tag.update(
        {
            name: req.body.name
        },
        {
            where: {
                id: req.params.tagId
            }
        }
    ).then(results => res.json(results))
    .catch(err => res.json(err));
});

//get all messages
router.get('/:board/msgs', function(req, res){
    db.Message.findAll({
        where: {
            BoardId: req.params.board
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//add a message
router.post('/:board/newMsg', function(req, res) {
    db.Message.create({
        msg: req.body.msg,
        author: req.body.author,
        BoardId: req.params.board
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//edit a message
router.put('/:board/msgs/:msgId', function(req, res) {
    db.Message.update({
        msg: req.body.msg,
        author: req.body.author,
    },{
        where: {
            BoardId: req.params.board,
            id: req.params.msgId
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

//delete a message
router.delete('/:board/msgs/:msgId', function(req, res) {
    db.Message.destroy({
        where: {
            id: req.params.msgId,
            BoardId: req.params.board
        }
    }).then(results => res.json(results))
    .catch(err => res.json(err));
});

module.exports = router;