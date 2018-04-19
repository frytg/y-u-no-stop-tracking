/*
 *
 *	y-u-no-stop-tracking
 *
 *	For real, do we NEED all the data?
 *
 *	Version		0.0.1
 *
 *	GIT			  https://github.com/frytg/y-u-no-stop-tracking
 *
 *	DEBUG     -> README.md
 *
 *	AUTHOR		Daniel Freytag
 *				    daniel@frytg.com
 *				    https://twitter.com/FRYTG
 *
 *	CREATED		April 2018
 *
 */


var datastore = require('@google-cloud/datastore')();

exports.log = function log(req, res) {
        var key = datastore.key({namespace: process.env.GCLOUD_PROJECT, path: ["y-u-no-stop-tracking"]});
        var isFaulty = false;
        var d = new Date();

        if(typeof req.body.pageId != "number") { isFaulty = true; }
        if(typeof req.body.pageTitle != "string") { isFaulty = true; }
        if(typeof req.body.sectionId != "number") { isFaulty = true; }
        if(typeof req.body.sectionHandle != "string") { isFaulty = true; }
        if(typeof req.body.url != "string") { isFaulty = true; }
        if(typeof req.body.language != "string") { isFaulty = true; }

        if(isFaulty == false) {
          var request = {key: key, data: {
  					pageId: req.body.pageId,
  					pageTitle: req.body.pageTitle,
  					sectionId: req.body.sectionId,
  					sectionHandle: req.body.sectionHandle,
  					url: req.body.url,
  					language: req.body.language,
            createdAt: Math.floor(new Date() / 1000),
            createdAtDay: dateFormat(d, "yyyy-mm-dd")
  				}};

          datastore.save(request, function(err) {
            if (!err) {
              res.json(request);
            } else {
              console.error(err);
            }
          });
        } else {
          console.warn("Found typeof check error");
          console.warn(req.body);
          res.send(403);
        }

};
