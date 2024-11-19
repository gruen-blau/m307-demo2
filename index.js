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

app.post("/create_post", async function (req, res) {
  await app.locals.pool.query(
    "INSERT INTO posts (title, picture, text, likenumber, type, upload, submit) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [req.body.image, req.body.title, req.body.text, req.body.file]
  );
  res.redirect("/");
});

app.get("/bm-posts", async function (req, res) {
  res.render("bm-posts", {});
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/profile", async function (req, res) {
  res.render("profile", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
