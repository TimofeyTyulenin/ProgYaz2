const path = require('path');
const express = require('express');
const fs = require("fs");
var Path = path.join(__dirname, "views");
var ejsMate = require("ejs-mate");
var aFunc = require("./aFunc");
var layouts = require("express-ejs-layouts");
const ind = express();

ind.set("view engine", "ejs");
ind.set("views", Path);
ind.set("layout", "layout.ejs");
ind.engine("ejs", ejsMate);
ind.use(express.urlencoded({ extended: true }));
ind.use(express.json());
ind.use(layouts);


ind.delete("/delete", (req, res) => {
    try {
      let dir = path.join(__dirname, req.body.path);
      if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
      }
      res.status(200).json({message: "Удалено"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Ошибка при удаления' });
      }
  });

ind.get("/download/*", (req, res) => {
    try {
      let dir = path.join(__dirname, `${req.url.slice(10)}`);
      res.download(dir);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Download error' });
      }    
  });


  ind.get("/", (req, res) => {
    try {
      res.redirect("/local/");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Transition error' });
      }      
  });

  ind.get("/local/*", aFunc(async (req, res) => {
    try {
      let dir;
          if (req.url.slice(6) == "") {
              dir = `${"./images/"}${req.url.slice(6)}`;
          } else {
              dir = `${"./images/"}${req.url.slice(6)}/`;
          }
          var names = await fs.promises.readdir(dir, (files) => {
            var list = [];
            files.forEach((file) => {
                list.push(file);
            });
          });
          var list = [];
          names.forEach((name) => {
              let type = "dir";
              if (name.indexOf(".") > -1) {
                  type = "file";
              }
              list.push({
                  name: name,
                  type: type,
            });
          });
          res.render("layout", { list, dir });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Transition error' });
      }           
    })
  );
  



ind.listen(3000, () => {
    console.log('listen port 3000');
});