import { Player } from './Player.js';
import { getSheetData } from './main.js';
import { Game } from './Game.js';
import { TeamGame } from './TeamGame.js'
import { Team } from './Team.js';

export class Database {
    constructor(){
        this.games = [];
        this.ready = false;
        this.players = [];
    }

    async init(){
        return new Promise((resolve, reject) => {
            getSheetData('10QAbJKl5CWf0XjEPYWHMmhDDO8b2LCp-441bOKMTuFQ', 'AllGames!A1:N92', this.processData.bind(this));
        });
    }

    getUpcomingGames(limit = 5){
        let upcomingGames = this.games.filter(game => game.date.isAfter(moment()));
        upcomingGames.sort((a, b) => a.date.diff(b.date));
        return upcomingGames.slice(0, limit);
    }

    createTeam(city, name){
        let fullName = `${city} ${name}`;
        let teamSchedule = this.games.filter(game => game.home === fullName || game.away === fullName);
        teamSchedule = teamSchedule.map(game => {
            return TeamGame.fromGame(game, fullName);
        });

        let wins = teamSchedule.filter(game => game.result === 'W').length;
        let losses = teamSchedule.filter(game => game.result === 'L').length;
        let ties = teamSchedule.filter(game => game.result === 'T').length;
        let team = new Team(city, name, teamSchedule, wins, losses, ties);
        return team;
    }

    getGamesByWeek(week){
        return this.games.filter(game => game.week == week);
    }

    processData(data){
        this.players = data[0].slice(6).map(player => new Player(player));

        for(let game of data.slice(1)){
            this.games.push(Game.fromSheetRow(game, this.players));
        }

        this.ready = true;
    }

    updateGameFromTeamGame(teamGame, team){
        let game = this.games.find(game => game.week === teamGame.week && (game.home === team || game.away === team));
        game.predictions = teamGame.predictions.map(prediction => {
            let prediction2 = {player: prediction.player, prediction: prediction.prediction === 'W' ? team : prediction.prediction === 'L' ? game.home === team ? game.away : game.home : undefined};
            console.log(prediction2);
            return prediction2;
        });
    }
}