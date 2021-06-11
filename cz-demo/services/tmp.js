
  const animals = [{ id: 1, name: 'Gorilla'},
  { id: 2, name: 'Pug'},
  { id: 3, name: 'Shark'},
  { id: 4, name: 'Lion'},
  { id: 5, name: 'Elk'},
  { id: 6, name: 'Butterfly'},
  { id: 7, name: 'Blobfish'},
  { id: 8, name: 'Naked Mole Rat'},
  { id: 9, name: 'Orca'},
  { id: 10, name: 'Turtle'},
  { id: 11, name: 'Penguin'},
  { id: 12, name: 'Kitten'},
  { id: 13, name: 'Elephant'},
  { id: 14, name: 'Duckling'},
  { id: 15, name: 'Panda'},
  { id: 16, name: 'Bear'}],
    hybrids = [
['Baby Gorilla', 'Gug', 'Gorillark', 'Gorillion', 'Gorillelk', 'Gorillafly', 'Gorillablob', 'Gorilla Rat', 'Gorca', 'Gorturtle', 'Gorillaguin', 'Gorkitten', 'Gorillaphant', 'Gorilling', 'Goranda', 'Gorillabear'], 
['Pugorilla', 'Puggy', 'Pugshark', 'Puglion', 'Pelk', 'Puggerfly', 'Plobfish', 'Pugrat', 'Pugorca', 'Pugurtle', 'Pugguin', 'Pugitten', 'Puggerphant', 'Pugling', 'Pugda', 'Pugbear'], 
['Sharkorilla', 'Shug', 	'Baby Shark', 'Shlion', 'Shelk', 'Sharkerfly', 'Shlobfish', 'Shark Rat', 'Shorca', 'Shurtle', 'Shanguin', 'Sharkitten', 'Sharkephant', 'Sharkling', 'Sharnda', 'Sharkbear'], 
['Lionilla', 'Lionpug', 'Lionshark', 'Lion Cub', 'Lionelk', 'Lionfly', 'Lionfish', 'Lion Rat', 'Lionorca', 'Lionturtle', 'Lionguin', 'Litten', 'Lelephant', 'Lionling', 'Lionda', 'Lionbear'], 
['Elkorilla', 'Elkpug', 'Elkshark', 'Elkion', 	'Baby Elk', 'Elkerfly', 'Elkfish', 'Elk Rat', 'Elka', 'Elkurtle', 'Elkenguin', 'Elkitten', 	'Elkephant 2', 'Elkling', 'Elkanda', 'Elkbear'], 
['Butterla', 'Butterpug', 'Buttershark', 'Butterflion', 'Butterflelk', 'Caterpillar', 'Butterblob', 'Butterrat', 'Buttorca', 'Butturtle', 'Butterflenguin', 'Butterflitten', 'Butterphant', 'Butterfling', 'Butterflanda', 'Butterbear'], 
['Blobilla', 'Blobpug', 'Blobshark', 'Bloblion', 'Blobelk', 'Blobberfly', 	'Baby Blob', 'Blobrat', 'Bloborca', 'Bloburtle', 'Blob Penguin','Blob kitten', 'Blobaphant', 'Blobling', 'Blobda', 'Blob Bear',], 
['Naked Mole Gorilla',	'Naked Mole Pug',	'Naked Mole Shark',	'Naked Lion',	'Naked Mole Elk',	'Naked Butterfly',	'Naked Blobfish',	'Naked Rat Baby', 	'Naked Mole Orca',	'Naked Turtle','Naked Penguin',	'Naked Mole Kitten','Naked Elephant','Naked Duckling','Naked Panda',	'Naked Mole Bear'], 
['Orcilla', 'Orcapug', 'Orcashark', 'Orclion', 'Orcelk', 'Orcafly', 'Orcablob', 'Orcarat', 	'Baby Orca', 'Orcaturtle', 'Orcapeng', 'Orkitten', 'Orcaphant', 'Orcling', 'Orcanda', 'Orca Bear'], 
['Turtilla', 'Turtpug', 'Turtleshark', 'Turtlion', 'Turtelk', 'Turtterfly', 'Turtleblob', 'Turtlerat', 'Turtorca', 'Tiny Turtle', 'Turtlepeng', 'Turkitten', 'Turtelephant', 'Turtling', 'Turtanda', 'Turtle Bear'], 
['Penguilla', 'Pengpug', 'Penguin Shark', 'Penguilion', 'Penguelk', 'Penggerfly', 'Penguinfish', 'Penguinrat', 'Penguorca', 'Pengurtle', 'Penguin Chick', 'Pengkitty', 'Pelephant', 'Pengling', 'Penda', 'Pengbear'], 
['Kittorilla', 'Kitty Pug', 'Shark Kitty', 'Lion Kitty', 'Kittelk', 'Kitterfly', 'Kitty Blob', 'Kitty Rat', 'Kittorca', 'Kitturtle', 'Kittypenguin', 'Kitten', 'Kittyphant', 'Kittyling', 'Kittypan', 'Kittybear'], 
['Elephantilla', 'Elepug', 'Eleshark', 'Elephlion', 	'Elkephant 1', 'Elephantterfly', 'Eleblob', 'Elephrat', 'Elephorca', 'Elephanturtle', 'Elepenguin', 'Elephitten', 	'Baby Elephant', 'Elephling', 'Elepanda', 'Elebear'], 
['Duckorilla', 'DuckPug', 'Duckshark', 'Ducklion', 'Duckelk', 'Duckerfly', 'Duckblob', 'Duckrat', 'Dorca', 'Durtle', 'Ducklinguin', 'Duckitten', 'Ducklephant', 	'Gen 1 Egg', 'Duckda', 'Duckbear'], 
['Pandalla', 'Pandapug', 'Pandashark', 'Pandalion', 'Pandelk', 'Pandafly', 'Pandablob', 'Pandarat', 'Pandorca', 'Pandaturtle', 'Panduin', 'Pandacat', 'Pandaphant', 'Pandaling', 'Panda Cub', 'Pearda'], 
['Bearilla', 'Bearpug', 'Bearshark', 'Bearlion', 'Belk', 'Beartterfly', 'Bearblob', 'Bearrat', 'Bearca', 'Beartle', 'Benguin', 'Beartten', 'Belephant', 'Bearling', 'Banda', 'Bear Cub']
  ]

  function insertQuestions(){

    const promises = []
    animals.forEach((animal, i) => {
      if(i >= 11){
        animals.forEach((animal2, j) => {
          const hybrid = hybrids[i][j],
            querystr = `INSERT INTO hybrids(name, animal_id_1, animal_id_2) VALUES('${hybrid}', ${animal.id}, ${animal2.id})`
          promises.push(pgPromise(client, querystr))
        })
      }
    })
  
    Promise.all(promises).then(() => {
      client.end()
    })
  }