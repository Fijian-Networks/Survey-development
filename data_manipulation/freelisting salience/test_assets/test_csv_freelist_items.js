// simple test csv creation flow
// output == freelisting_responses.csv

// load libs, filesystem and fast-csv 
const fs = require('fs');
const { format, writeToStream } = require('fast-csv');

// create file output
const fileout = fs.createWriteStream("freelisting_responses.csv");

// header for csv format
// TEST for ODK-X csv out, create csv headers matching output from ODK-x
const csvStream= format ({ headers: ['_id', 'age','location', 'item_01','item_02','item_03','item_04','item_05','item_06','item_07','item_08','item_09','item_10', '_form_id','_locale','_savepoint_type','_savepoint_timestamp','_savepoint_creator','_deleted','_data_etag_at_modification','gender','id','_default_access','_group_modify','_group_privileged','_group_read_only','_row_etag','_row_owner']})

// end process, pipes to fileout on exit.
csvStream.pipe(fileout).on('end', () => process.exit());

///////////////////////
// freelist csv random generation
//

// probability fudging
itemProbability = 0.5

// RNG function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// create array of choices
const itemArray = ['Apple', 'Box', 'Chair', 'Dishes', 'Eggs', 'Firewood', 'Grain', 'Heater', 'Ice', 'Juice', 'Kava', 'Lime', 'Money'];
const locations= ['Levuka Vakavita', 'Baba', 'Wailailai', 'Vagadaci']
const gender = ['male', 'female']

// functions to select from arrays
const chooseItem = function (i) {
    return itemArray[i];
}

const chooseLocation = function (i) {
    return locations[i];
}

const chooseGender = function (i) {
    return gender[i];
}

// create an array to fill csv line
// naTestBoolean == true for a mixed amount of answers given per participant, if == false fill all item responses
const fillCsv = function(id, naTestBoolean) {
    let max = 10;
    if(naTestBoolean){
        max = getRandomInt(7) + 4;
    }
    // pass ID to new row
    let line = [id]
    // choose a location and add to row
    line.push(chooseLocation(getRandomInt(locations.length)))
//choose gender
    line.push(chooseGender(getRandomInt(2)))

    // loop gets location and items from arrays, and populates 
    for(let i = 0; i < max; i++){
        // force bias to certain item for testing salience etc...
        if (Math.random() < itemProbability){ // alter for probability
            line.push(chooseItem(0)) // which item from itemArray to choose when the above condition is met 
        } else {
        line.push(chooseItem(getRandomInt(itemArray.length))); //get random item from array
        }
    }
    return line
}


// test function to write to csv, set i to be number of 'participants'
for(let i = 0; i< 40; i++){
    let test = fillCsv(i, true);
    csvStream.write(test);
}
csvStream.end();