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

const {BigQuery}		= require('@google-cloud/bigquery')
const bigquery			= new BigQuery({
		projectId:	process.env.GCLOUD_PROJECT,
		keyFilename:	'./keys/bigquery.json'
	})

const {Datastore} 		= require('@google-cloud/datastore')
const datastore 		= new Datastore()


const init = async function() { try {
	// Check if Dataset exists
	var [datasetsList]	= await bigquery.getDatasets()
	datasetsList		= datasetsList.map(obj => { return obj.id })
	console.log({datasetsList})

	if(datasetsList.indexOf(DATASET) === -1) {
		const [datasetCreated] = await bigquery.createDataset(DATASET, { location: 'EU' })
		console.warn('created dataset > ', DATASET)
		console.log({datasetCreated})

	} else {
		console.log('did not create new dataset');
	}

	// Check if table exists
	const [tablesList] = await bigquery.dataset(DATASET).getTables()
	console.log({tablesList});

	if(tablesList.indexOf(TABLE) === -1) {
		// For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
		const options =	{
			schema: 'pageId:integer, pageTitle:string, ' +
				'sectionId:integer, sectionHandle:string, ' +
				'url:string, language:string, ' +
				'windowWidth:integer, windowHeight:integer, ' +
				'screenWidth:integer, screenHeight:integer, ' +
				'createdAt:integer, createdAtDay:string, ' +
				'createdAtStamp:timestamp '
			}
		console.log({options})

		// Create a new table in the dataset
		const [tableCreated] = await bigquery.dataset(DATASET).createTable(TABLE, options);

		console.warn('created table >', TABLE);
		console.log({tableCreated})

	} else {
		console.log('did not create new table');
	}

} catch(err) {
	console.error({err})
} }

init()
