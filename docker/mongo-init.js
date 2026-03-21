// This script runs on first startup of the MongoDB container.
// It creates the application database and a user with readWrite access only to that database.

const dbName = process.env.MONGO_INITDB_DATABASE;
const appUser = process.env.MONGO_DB_USER;
const appPassword = process.env.MONGO_DB_PASSWORD;

const appDb = db.getSiblingDB(dbName);

appDb.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: dbName }],
});

print(
  `Created user '${appUser}' with readWrite access to database '${dbName}'`,
);
