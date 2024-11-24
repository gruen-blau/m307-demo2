import { createApp } from "./config.js";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });

const app = createApp({
  user: "cold_glitter_5060",
  host: "bbz.cloud",
  database: "cold_glitter_5060",
  password: "30359fc543f2d64b3908edb1f08ac546",
  port: 30211,
});


/* Startseite */
app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("SELECT p.*,u.username FROM posts AS p JOIN users AS u ON u.Id = p.user_id  ORDER By likenumber desc LIMIT 3");
  const favorites = await app.locals.pool.query("SELECT p.type,p.title FROM favorites AS f JOIN posts AS p ON p.Id = f.post_id WHERE f.user_id = $1",
    [req.session.userid]
  )
  res.render("start", { posts: posts.rows,favorites: favorites.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/newpost", async function (req, res) {
  res.render("newpost", {});
});

app.post("/create_post",upload.any(), async function (req, res) {
  if(req.session.userid == null){
    res.redirect("/login");
    return;
  }
  if(req.files.length != 2){
    res.redirect("/newpost")
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO posts (user_id,title, picture, text, type, file) VALUES ($1, $2, $3, $4, $5, $6)",
    [req.session.userid ,req.body.title, req.files[0].filename, req.body.text,req.body.type, req.files[1].filename]
  );
  res.redirect("/");
});

app.get("/bm-posts", async function (req, res) {
  const posts = await app.locals.pool.query("SELECT p.*,u.username FROM posts AS p JOIN users AS u ON u.Id = p.user_id WHERE p.type='BM' ORDER By title");
  const favorites = await app.locals.pool.query("SELECT p.type,p.title FROM favorites AS f JOIN posts AS p ON p.Id = f.post_id WHERE f.user_id = $1",
    [req.session.userid]
  )
  res.render("posts", { posts: posts.rows,favorites: favorites.rows });
});

app.get("/mdm-posts", async function (req, res) {
  const posts = await app.locals.pool.query("SELECT p.*,u.username FROM posts AS p JOIN users AS u ON u.Id = p.user_id WHERE p.type='MDM' ORDER By title");
  const favorites = await app.locals.pool.query("SELECT p.type,p.title FROM favorites AS f JOIN posts AS p ON p.Id = f.post_id WHERE f.user_id = $1",
    [req.session.userid]
  )
  res.render("posts", { posts: posts.rows,favorites: favorites.rows });
});

app.get("/login", async function (req, res) {
  res.render("login", {});
});

app.get("/profile", async function (req, res) {
  if(req.session.userid == null){
    res.redirect("/login");
    return;
  }
  const posts = await app.locals.pool.query("SELECT p.*,u.username FROM posts AS p JOIN users AS u ON u.Id = p.user_id WHERE p.user_Id=$1 ORDER By title",[
    req.session.userid
  ]);
  const user = await app.locals.pool.query("SELECT * FROM users WHERE id = $1",
    [req.session.userid]
  )
  res.render("profile", { posts: posts.rows,user: user.rows });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
