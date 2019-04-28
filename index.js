/*
 *
 *	yPageCount
 *
 *	For real, do we NEED all the data?
 *
 *	GIT		https://github.com/frytg/y-u-no-stop-tracking
 *
 *	AUTHOR		Daniel Freytag
 *			daniel@frytg.com
 *			https://twitter.com/FRYTG
 *
 */

// If you update these constants, do that in both index.js and table.js
const DATASET			= 'yPageCount'
const TABLE			= 'log'

const moment			= require('moment')

const {BigQuery}		= require('@google-cloud/bigquery');
const bigquery			= new BigQuery({
		projectId:	process.env.GCLOUD_PROJECT,
		keyFilename:	'./keys/bigquery.json'
	})

const {Datastore} 		= require('@google-cloud/datastore');
const datastore 		= new Datastore();


exports.yPageCount = async function log(req, res) { try {
        var isFaulty	= false;

        if(typeof req.body.pageId != "number") {	isFaulty = true; }
        if(typeof req.body.pageTitle != "string") {	isFaulty = true; }
        if(typeof req.body.sectionId != "number") {	isFaulty = true; }
        if(typeof req.body.sectionHandle != "string") {	isFaulty = true; }
        if(typeof req.body.url != "string") {		isFaulty = true; }
        if(typeof req.body.language != "string") {	isFaulty = true; }

        if(typeof req.body.windowWidth != "number") {	isFaulty = true; }
        if(typeof req.body.windowHeight != "number") {	isFaulty = true; }
        if(typeof req.body.screenWidth != "number") {	isFaulty = true; }
        if(typeof req.body.screenHeight != "number") {	isFaulty = true; }

        if(isFaulty == false) {
	        var request = {
			key: datastore.key({
				namespace: process.env.GCLOUD_PROJECT,
				path: ["yPageCount"]
			}),
			data: {
				pageId:		req.body.pageId,
				pageTitle:	req.body.pageTitle,
				sectionId:	req.body.sectionId,
				sectionHandle:	req.body.sectionHandle,
				url:		req.body.url,
				language:	req.body.language,
				windowWidth:	req.body.windowWidth,
				windowHeight:	req.body.windowHeight,
				screenWidth:	req.body.screenWidth,
				screenHeight:	req.body.screenHeight,
				createdAt:	moment().unix(),
				createdAtDay:	moment().format('YYYYMMDD'),
				createdAtStamp:	moment().toISOString()
	  		}
		}

	        var save = await datastore.save(request)

		var bigQueryData	= request.data
		var bigQueryResponse	= await bigquery
						.dataset(DATASET)
						.table(TABLE)
						.insert([bigQueryData])

		res.json(request)


        } else {
          console.warn("Found typeof check error")
          console.warn(req.body)
          res.send(403)
        }

} catch(err) {
	console.error({err})
} }
