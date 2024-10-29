import { createApp } from "./config.js";

const app = createApp({
  user: "cold_glitter_5060",
  host: "bbz.cloud",
  database: "cold_glitter_5060",
  password: "30359fc543f2d64b3908edb1f08ac546",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("select * from posts");
  res.render("start", { posts: posts.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/newpost", async function (req, res) {
  res.render("newpost", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
