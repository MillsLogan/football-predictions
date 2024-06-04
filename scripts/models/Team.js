import { database } from '../test.js';


export class Team{
    constructor(city, name, schedule, wins, losses, ties){
        this.city = city;
        this.name = name;
        this.schedule = schedule.sort((a, b) => a.week - b.week);
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
    }

    get fullName(){
        return `${this.city} ${this.name}`;
    }

    get record(){
        return `${this.wins}-${this.losses}-${this.ties}`;
    }

    get allTeamPredictions(){
        return database.getAllTeamPredictionsFromSchedule(this.schedule);
    }

    get allPlayersTeamRecord(){
        let teamPredictions = this.allTeamPredictions;
        let playerRecords = {};
        for(let gamePredictions of teamPredictions){
            Object.entries(gamePredictions).map(([player, prediction]) => {
                if(!playerRecords[player]){
                    playerRecords[player] = {player: player, correct: 0, incorrect: 0};
                }

                if(prediction.isCorrect()){
                    playerRecords[player].correct++;
                }else if(prediction.isIncorrect()){
                    playerRecords[player].incorrect++;
                }
            });
        }

        return playerRecords;
    }

    getPlayerRecord(player){
        return this.allPlayersTeamRecord[player.name];
    }

    updatePlayerRecord(player){
        let record = this.getPlayerRecord(player);
        player.correct += record.correct;
        player.incorrect += record.incorrect;
    }

    getRecentGames(limit){
        return this.schedule.filter(game => game.date.isBefore(moment())).slice(0, limit);
    }

    getUpcomingGames(limit){
        return this.schedule.filter(game => game.date.isAfter(moment())).slice(0, limit);
    }
}