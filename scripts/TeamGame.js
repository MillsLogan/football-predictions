export class TeamGame{
    constructor(week, date, time, opponent, isHomeGame, result, predictions){
        this.week = week;
        this.date = date;
        this.time = time;
        this.opponent = opponent;
        this.isHomeGame = isHomeGame;
        this.result = result;
        this.predictions = predictions;
    }

    static fromGame(game, team){
        let predictions = game.predictions.map(player => {return {player: player.player, 
            prediction: player.prediction === team ? "W" : player.prediction === undefined ? "" : "L"};});
        
        let opponent = game.home === team ? game.away : game.home;
        let isHomeGame = game.home === team;
        let result = game.winner === team ? 'W' : game.winner === 'TIE' ? 'T' : game.winner === undefined ? "" : 'L';

        return new TeamGame(game.week, game.date, game.time, opponent, isHomeGame, result, predictions);
    }
}