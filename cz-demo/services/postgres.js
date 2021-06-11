const { Client } = require('pg'),
  uuidV4 = require('uuid/v4'),
  connectionData = {
    connectionString: process.env.DATABASE_URL || "postgres://napsuiqmfzzioa:8f5fd7ab801a5cc158809767a38c873e394a3feacfd3af05d1f42e827b9bb561@ec2-54-224-120-186.compute-1.amazonaws.com:5432/dcqil73almnnuv",
    ssl: { rejectUnauthorized: false }
  }

/**
 * Tables
 * animals - base animals - name, description, rarity int
 * hybrids - animal combos keyed by two animal IDs - name, animal_id_1, animal_id_2, description
 * creatures - instances of animals or hybrids, created timestamp, animal_id guid, is_hybrid bool, is_egg bool true, has_bred bool false, breed_count int 0, last_bred timestamp
 * creature_history - creature_id int, action, action_timestamp (transaction history, should update every time the creature does something, is sold etc.)
 */

function pgPromise(client, qstr){
  return new Promise((resolve, reject) => {
    client.query(qstr, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  })
}
/*
    {
      q: "",
      tier: "",
      answers: [
        {
          title: "",
          text: ""
        }
      ]
    }
    
*/
function insertQuestions(){
  client.query(`SELECT * FROM animals`, (err, data) => {
    if (err) console.error(err)
    else {
      console.log(data.rows)
      const promises = []
      data.rows.forEach((animal) => {
        const querystr = `INSERT INTO hybrids(name, unique_id, rarity, is_hybrid) VALUES('${animal.name}', '${animal.unique_id}', ${animal.rarity}, false)`
        promises.push(pgPromise(client, querystr))
      })

      Promise.all(promises).then(() => {
        client.end()
      })
    }
  })
}



//insertQuestions()
pgPromise(client, `SELECT * FROM creatures`).then((data) =>{
  console.log(data.rows)
  client.end()
})
/*
const a = '6f7c6370-fac1-401c-84eb-8535bc50cc1f',
  b = 16
Promise.all([
  pgPromise(client, `UPDATE animals SET animal_id_1 = '${a}' WHERE _animal_id_1 = ${b}`),
  pgPromise(client, `UPDATE animals SET animal_id_2 = '${a}' WHERE _animal_id_2 = ${b}`)
])
.then((data) =>{
  console.log(a,b)
  console.log(data)
  client.end()
})
/*
const promiseArr = []
let i = 2
while(++i < 15){
  promiseArr.push(pgPromise(client,`UPDATE Question_Tiers SET sort_order = ${i-1} WHERE id = ${i}`))
}
Promise.all(promiseArr).then(() =>{
  client.end()
})
*/
/*

*/
/*
client.query(`ALTER TABLE creatures ADD has_bred boolean default false`, (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
})
/*
// REMOVE EMPTY CATEGORIES

client.query(`SELECT category FROM Categories`, (err, res) => {
  if (err) throw err;
  res.rows.forEach(row => {
    client.query(`SELECT count(category) FROM Questions WHERE category = '${row.category.replace(/'/g, "''")}'`, (err, x) => {
      if(parseInt(x.rows
        client.query(`DELETE FROM Categories WHERE category = '${row.category.replace(/'/g, "''")}'`, (err, y) => {
          if(err) console.log(err)
          console.log('deleted', row.category)
        })
      }
    })
  })
});
*/
/*

client.query('SELECT category FROM Questions GROUP BY category', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(row.category);
  }
  client.end();
});
/*

*/
/*
client.query('ALTER TABLE Questions ADD daily_double boolean', (err, res) => {
  if (err) console.error(err)
  console.log('done')
  client.end();
})*/