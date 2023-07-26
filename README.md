# Byte
Byte is an npm package that allows you to run a NoSQL JSON database with ease.

## Usage
First, install the package then initialise the project by doing:
```js
const byte = require('@ethan-davies/byte')

byte.database.initialise()
byte.database.addDatabase('data.json') // Replace data.json with your database name (keep the .json)
```
And its as simple as that. You now have a working database and API running on Port 3000

## APIs
When working with the API to upload data you would call a `POST` request to `http://localhost:3000/databaseUpload/:data`

Replacing `:data` with the database name, for exmaple if you had your data in `data.json` you would put `http://localhost:3000/databaseUpload/data`

Then your body would be as an example:

```json
{
  "json": {"TEST": "This is some data", "TEST 2": "This is also some data"}
}
```

