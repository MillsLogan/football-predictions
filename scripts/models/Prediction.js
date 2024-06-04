import { database } from '../test.js';


export class Prediction{
    constructor(playerName, gameId, winner){
        this.player = playerName;
        this.gameId = gameId;
        this.winner = winner;
    }

    isCorrect(){
        let game = database.getGameByID(this.gameId);

        if(this.#validatePrediction(game)){
            return this.winner === game.winner;
        }

        return false;
    }

    isIncorrect(){
        let game = database.getGameByID(this.gameId);

        if(this.#validatePrediction(game)){
            return this.winner !== game.winner;
        }

        return false;
    }

    #validatePrediction(game){

        if(this.winner !== game.home && this.winner !== game.away){
            return false;
        }
    
        if(game.winner !== game.home && game.winner !== game.away){
            return false;
        }

        return true;
    }
}