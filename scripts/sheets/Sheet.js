export class Sheet{
    static API_KEY= 'AIzaSyBdRF5JfDAWvs-nwT1UESo5nnZPS0L6aaY';

    static async #fetchSheetData(sheetID, range) {
        return new Promise(async (resolve, reject) => {
            await gapi.client.init({
                'apiKey': Sheet.API_KEY,
            });
    
            let response = await gapi.client.request({
                'path': `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}`,
            });
    
            resolve(response.result.values);
        });
    }
    
    static async getSheetData(sheetID, range, callback){
        gapi.load('client', () => Sheet.#fetchSheetData(sheetID, range).then(data => callback(data)));
    }
}


