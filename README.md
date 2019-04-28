# yPageCount

This project inserts a noSQL object when being triggered by a JSON POST request through a Cloudfunctions HTTP trigger.


## Preparation

Navigate to the local project folder and run `yarn` or `npm install` depending on your setup.  
Make sure to set up a BigQuery table by creating an IAM user with permission "_BigQuery Data Owner_" for Bigquery, then save that access key to `./keys/bigquery.json` and run `npm run table`. This will create a table in the EU region with all required parameters

## Deploy

Set cloudProjectId in your command line
```
export GCLOUD_PROJECT=YOUR_PROJECT_NAME
```

Deploy the Cloud Function by running
```
npm run deploy
``
Note: Make sure gcloud is installed and set up to the appropriate account
