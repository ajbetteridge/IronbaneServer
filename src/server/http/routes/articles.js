// article.js - dynamic web pages, stored in markdown
var util = require('util');

module.exports = function(app, db) {
    var Article = require('../../entity/article')(db);

    // get a list of articles, minus content
    app.get('/api/article', app.ensureAuthenticated, app.authorize('EDITOR'), function(req, res) {
        Article.get({$fields: ['articleId', 'title', 'author', 'created', 'views']}).then(function(articles) {
            res.send(articles);
        }, function(err) {
            res.send(500, err);
        });
    });

    // create article
    app.post('/api/article', app.ensureAuthenticated, app.authorizeAny(['ADMIN', 'EDITOR']), function(req, res) {
        Article.create(req.body).then(function(article) {
            // send back the completed details
            res.send(article);
        }, function(err) {
            res.send(500, err);
        });
    });

    app.post('/api/article/:articleId', function(req, res){
        Article.get(req.params.articleId).then(function(article){
            console.log("retrieved article");
            console.log(req.body);
            article.update({title: req.body.title, body: req.body.body, articleId: req.body.articleId}).then(function(updatedarticle){
                console.log("updated article");

                res.send(updatedarticle);
            }, function(error){
                console.log(error);
                res.send(500, error);
            });
    }, function(err) {
        console.log(err);
        res.send(500, err);
    });
    });

    // get specific article (public view)
    app.get('/api/article/:articleId', function(req, res) {
        Article.get(req.params.articleId).then(function(article) {
            res.send(article);
        }, function(err) {
            if(err.code === 404) {
                res.send(err.code, err.msg);
            } else {
                // unknown server error
                res.send(500, err);
            }
        });
    });

    // update existing article

    // delete article

    // mark article viewed? do we care, or just use GA?
};