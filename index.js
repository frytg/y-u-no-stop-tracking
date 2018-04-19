/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

 var datastore = require('@google-cloud/datastore')();

exports.log = function importer1(req, res) {
        var key = datastore.key({namespace: "frytgdigital", path: ["y-u-no-stop-tracking"]});
        var request = {key: key, data: {
					pageId: req.body.pageId,
					pageTitle: req.body.pageTitle,
					sectionId: req.body.sectionId,
					sectionHandle: req.body.sectionHandle,
					url: req.body.url,
					language: req.body.language,
					createdAt: Math.floor(new Date() / 1000)
				}};

        console.log(request);
        console.log(process.env);

        datastore.save(request, function(err) {
          if (!err) {
            res.sendStatus(200);
          } else {
            console.error(err);
          }
        });

};
