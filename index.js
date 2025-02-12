const express = require("express");
require("dotenv").config();
const pg = require("pg");
const client = new pg.Client();
const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/api/flavors", async (req, res) => {
  try {
    const SQL = `SELECT * FROM flavors ORDER BY created_at DESC;`;
    const { rows } = await client.query(SQL);
    res.send(rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/flavors", async (req, res) => {
  try {
    console.log(req.body);
    const SQL = `INSERT INTO flavors(name, tubs, supplier) VALUES($1, $2, $3) RETURNING *`;
    const { rows } = await client.query(SQL, [
      req.body.name,
      req.body.tubs,
      req.body.supplier,
    ]);

    res.send(rows);
  } catch (err) {
    res.send(err);
  }
});

app.put("/api/flavors/:id", async (req, res) => {
  try {
    const SQL = `UPDATE flavors SET name=$1, tubs=$2, supplier=$3, updated_at=now() WHERE id=$4 RETURNING *;`;
    const { rows } = await client.query(SQL, [
      req.body.name,
      req.body.tubs,
      req.body.supplier,
      req.params.id,
    ]);
    console.log(rows);
    res.send(rows[0]);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/api/flavors/:id", async (req, res) => {
  try {
    const SQL = `DELETE FROM flavors WHERE id=$1 RETURNING *;`;
    const { rows } = await client.query(SQL, [req.params.id]);
    console.log(rows);
    res.send(rows);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}!`);
});

const init = async () => {
  console.log("Connecting to DB...");
  await client.connect();
  console.log("Connected!");
  /**
   * CREATE TABLE books(id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL);
   *
   *
   */
  let SQL = `
  DROP TABLE IF EXISTS flavors;

CREATE TABLE
    flavors (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT now (),
        updated_at TIMESTAMP DEFAULT now (),
        name VARCHAR(255) NOT NULL,
        tubs INTEGER DEFAULT 1 NOT NULL,
        supplier VARCHAR(255) NOT NULL
    );`;
  await client.query(SQL);
  SQL = `
    INSERT INTO
        flavors (name, tubs, supplier)
    VALUES
        (
            'strawberry cheesecake',
            '987',
            'Ice Creams Are Us'
        );`;
  await client.query(SQL);
  SQL = `
    INSERT INTO
        flavors (name, tubs, supplier)
    VALUES
        (
        'berry fun dip supreme',
        '1',
        'Rare Ice Cream Supply Company'
    );`;
  await client.query(SQL);
  SQL = `
    INSERT INTO
        flavors (name, tubs, supplier)
    VALUES
        (
        'rainbow butterscotch',
        '19',
        'Ye Olde Supplier of Weird Olde Ice Creams'
    );`;
  await client.query(SQL);
  SQL = `
    INSERT INTO
        flavors (name, tubs, supplier)
    VALUES
        ('chocolate pecan', '24', 'Shatner Farms');`;
  await client.query(SQL);
  console.log("tables created!");
};

init();
