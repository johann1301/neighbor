### Delete git after cloning the repo in the root folder of the project

```bash
$ rm -rf .git
```

### Change the name of the database in db/index.js

```js
// db/index.js

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/< name of the db>";
```