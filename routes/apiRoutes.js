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
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
});

//delete board
router.delete('/:board', function(req, res) {
    db.Board.destroy({
        where: {
            id: req.params.board
        }
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
});

//access a specific board's links
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
    }).catch(function(err) {
        res.json(err);
    });
});

//get all board's links by tag
router.get('/:board/:tagId', function(req, res) {
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
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
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
        if(req.body.tags) {
            results.setTags(req.body.tags).then(function(result) {
                res.json([results, result]);
            }).catch(function(err) {
                res.json(err);
            });
        } else {
            res.json(results);
        }
    }).catch(function(err) {
        res.json(err);
    });
});

//edit link info
router.put('/:board/updateLink', function(req, res) {
    db.Link.update({
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        image_url: req.body.image_url
    },
    {
        where: {
            BoardId: req.params.board,
            id: req.body.id
        }
    }
    ).then(function(results) {
        //tags should be an array of id numbers
        //if null is passed in, all associations will be removed,
        //therefore all tags are removed
        if(req.body.tags || req.body.tags === null) {
            db.Link.findOne({where: {id : req.body.id}}).then(function(result){
                result.setTags(req.body.tags).then(function(tagResult) {
                    res.json([result, tagResult]);
                }).catch(function(err) {
                    res.json(err);
                });
            });
        } else {
            res.json(results);
        }
    }).catch(function(err) {
        res.json(err);
    });
});

//delete a link
router.delete('/:board/destroyLink', function(req, res) {
    db.Link.destroy({
        where: {
            BoardId: req.params.board,
            id: req.body.id
        }
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        res.json(err);
    });
});

//create a tag
router.post('/:board/newTag', function(req, res) {
    db.Tag.create({
        name: req.body.name,
        BoardId: req.params.board
    }).then(function(results) {
        res.json(results);
    }).catch(function(error){
        res.json(error);
    });
});

//delete a tag

//update a tag

module.exports = router;