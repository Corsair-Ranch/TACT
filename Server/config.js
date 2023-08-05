import "dotenv/config";

// Exporting env variable
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SERVER_MIGRATION_RETRIES =
  process.env.SERVER_MIGRATION_RETRIES === undefined
    ? 10
    : process.env.SERVER_MIGRATION_RETRIES;

if (CLIENT_ID === undefined || CLIENT_SECRET === undefined) {
  throw new Error(
    `Please edit/create .env file in Server root and add the Amadeus config`
  );
}

export { CLIENT_ID, CLIENT_SECRET, SERVER_MIGRATION_RETRIES };
