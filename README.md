# yPageCount

This project inserts a noSQL object when being triggered by a JSON POST request through a Cloudfunctions HTTP trigger.


## INSTALL

### Preparation

Navigate to the local project folder and run `yarn` or `npm install` depending on your setup.  

Make sure `gcloud` (beta) CLI is installed and set up to the appropriate account, then set `GCLOUD_PROJECT` in your command line
```
export GCLOUD_PROJECT=YOUR_PROJECT_NAME
```

Make sure to set up a BigQuery table by creating an IAM user with permission "_BigQuery Data Owner_", then save that access key to `./keys/bigquery.json` and run `npm run table`. This will create a table in the EU region with all required parameters.

### Deploy



Deploy the Cloud Function by running
```
npm run deploy
```
Note: Make sure gcloud is installed and set up to the appropriate account


### Call

To call this script I recommend setting a proxy_pass rule in your nginx configuration (usually `/etc/nginx/nginx.conf`) like this:
```
location /api/yPageCount/ {
        proxy_pass YOUR_CLOUDFUNCTIONS_URL/yPageCount/;
        proxy_redirect off;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;
        }
```
Don't forget to save and reload the configuration, then reboot nginx.

Now set up a JS snippet on your website to call the `/api/yPageCount/` endpoint like this example from my Craft CMS template:

```js
{% if not currentUser %}
<script>
	var json = {};
	json.pageId = {{ pageId }};  
	json.pageTitle = "{{ pageTitle|raw }}";  
	json.sectionId = {{ sectionId }};  
	json.sectionHandle = "{{ sectionHandle }}";
	json.url = "{{ craft.app.request.absoluteUrl }}";
	json.language = window.navigator.userLanguage || window.navigator.language;

	json.windowWidth = window.innerWidth
	json.windowHeight = window.innerHeight
	json.screenWidth = screen.width
	json.screenHeight = screen.height

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/api/yPageCount/');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify(json));

</script>
{% endif %}
```
