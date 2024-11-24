import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";
import bbz307 from "bbz307";


export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);
  const login = new bbz307.Login('users', ['username', 'passwort', 'profilepicture'], pool);
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", function (req, res) {
    var password = bcrypt.hashSync(req.body.password, 10);
    pool.query(
      "INSERT INTO users (email, password, username, profilepicture) VALUES ($1, $2)",
      [req.body.username, password],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login",upload.none(), function (req, res) {
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (result.rows.length > 0 && req.body.password, result.rows[0].passwort) {
          req.session.userid = result.rows[0].id;
          res.redirect("/");
        } else {
          console.log(req.body)
          res.redirect("/login");
        }
      }
    );
  });
  // app.post("/login", upload.none(), async (req, res) => {
  //   const user = await login.loginUser(req);
  //   if (!user) {
  //     res.redirect("/login");
  //     return;
  //   } else {
  //     res.redirect("/intern");
  //     return;
  //   }
  // });

  return app;
}

export { upload };
