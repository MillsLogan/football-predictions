import { Database } from './Database.js';
import { Controller } from './Controller.js';
import { Player } from './Player.js';

const API_KEY = 'AIzaSyBdRF5JfDAWvs-nwT1UESo5nnZPS0L6aaY';

async function fetchSheetData(sheetID, range) {
    return new Promise(async (resolve, reject) => {
        await gapi.client.init({
            'apiKey': API_KEY,
        });

        let response = await gapi.client.request({
            'path': `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}`,
        });

        resolve(response.result.values);
    });
}

export async function getSheetData(sheetID, range, callback){
    gapi.load('client', () => fetchSheetData(sheetID, range).then(data => callback(data)));
}

var database = new Database();
database.init();

while(!database.ready){
    console.log("waiting");
    await new Promise(r => setTimeout(r, 500));
}

if(window.location.pathname.includes('predict')){
    switch(window.location.search){
        case '?player=logan':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[0]);
            break;
        case '?player=nick':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[1]);
            break;
        case '?player=mom':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[2]);
            break;
        case '?player=dad':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[3]);
            break;
        case '?player=bernadette':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[4]);
            break;
        case '?player=joey':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[5]);
            break;
        case '?player=taylor':
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[6]);
            break;
        default:
            Controller.predictionPage(database.createTeam("Pittsburgh", "Steelers"), database.players[7]);
            break;
    }

}else if(window.location.pathname.includes("team")){
    if(window.location.search === '?team=steelers'){
        Controller.teamPage(database.createTeam('Pittsburgh', 'Steelers'));
    }else if(window.location.search === '?team=giants'){
        Controller.teamPage(database.createTeam('New York', 'Giants'));
    }else if(window.location.search === '?team=cowboys'){
        Controller.teamPage(database.createTeam('Dallas', 'Cowboys'));
    }else if(window.location.search === '?team=eagles'){
        Controller.teamPage(database.createTeam('Philadelphia', 'Eagles'));
    }else if(window.location.search === '?team=patriots'){
        Controller.teamPage(database.createTeam('New England', 'Patriots'));
    }else if(window.location.search === '?team=chargers'){
        Controller.teamPage(database.createTeam('Los Angeles', 'Chargers'));
    }
}else{
    Controller.homePage();
}



export { database };