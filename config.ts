import { Client } from "https://deno.land/x/postgres/mod.ts";



// const client = new Client("postgres://firzzido:QumdHkUI-bg7tfI-TPG6JWIrNB8dCotk@topsy.db.elephantsql.com:5432/firzzido");
// const client = new Client(
//   "postgres://pifbqfzzeokxen:9a821e98c76b3e5e5411d2924094bb2313b9cf58b03cd85820687bfd9d592836@ec2-54-235-158-17.compute-1.amazonaws.com:5432/d4amg6rg6ei84n"
// );

const dbCreds = {
  user: "postgres",
  database: "deno_auction",
  password: "1234",
  hostname: "localhost",
  port: 5432,
};

const client = new Client(dbCreds);

export { client };
