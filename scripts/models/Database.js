import { Game } from './Game.js';
import { Sheet } from '../sheets/Sheet.js';
import { Player } from './Player.js';
import { Prediction } from './Prediction.js';
import { Team } from './Team.js';

const SHEET_ID = '10QAbJKl5CWf0XjEPYWHMmhDDO8b2LCp-441bOKMTuFQ';
const SHEET_NAME = 'AllGames!';
const SHEET_RANGE = 'A1:N92';
const PREDICTION_OFFSET = 6;
const HEADER_ROW_COUNT = 1;

export class Database{

    constructor(){
        this.ready = false;
        this.games = {};
        this.players = {};
        this.predictions = {};
        this.#loadDatabase();
    }

    getAllRecentGames(limit=5){
        let recentGames = Object.values(this.games).filter(game => game.date.isBefore(moment()));
        recentGames.sort((a, b) => b.date.diff(a.date));
        return recentGames.slice(0, limit);
    }

    fillPlayerRecordFromTeam(team){
        console.log(team);
        Object.values(this.players).map(player => {team.updatePlayerRecord(player)});
    }

    updatePlayerPrediction(playerName, gameId, winner){
        this.predictions[gameId][playerName].winner = winner;
    }    

    getAllTeamPredictionsFromSchedule(teamSchedule){
        let teamPredictions = teamSchedule.map(game => {
            return this.predictions[game.id];
        });
        return teamPredictions;
    }

    getGameByID(gameId){
        return this.games[gameId];
    }

    getTeamPredictionsFromScheduleForPlayer(teamSchedule, player){
        let teamPredictions = teamSchedule.map(game => {
            return this.predictions[game.id][player];
        });
        return teamPredictions;
    }

    getAllUpcomingGames(limit=5){
        let upcomingGames = Object.values(this.games).filter(game => game.date.isAfter(moment()));
        upcomingGames.sort((a, b) => a.date.diff(b.date));
        return upcomingGames.slice(0, limit);
    }

    getGamesByWeek(week){
        return Object.values(this.games).filter(game => game.week == week);
    }

    getTeamByCityAndName(city, name){
        let fullName = `${city} ${name}`;
        let teamSchedule = Object.values(this.games).filter(game => game.home === fullName || game.away === fullName);

        let wins = teamSchedule.filter(game => game.result === 'W').length;
        let losses = teamSchedule.filter(game => game.result === 'L').length;
        let ties = teamSchedule.filter(game => game.result === 'T').length;
        let team = new Team(city, name, teamSchedule, wins, losses, ties);
        return team;
    }

    async #loadDatabase(){
        console.log('loading database');
        return new Promise((resolve, reject) => {
            Sheet.getSheetData(SHEET_ID, SHEET_NAME + SHEET_RANGE, this.#processData.bind(this));
        });
    }

    #processData(data){
        this.#initPlayers(data[0].slice(PREDICTION_OFFSET));

        // 1st row is the header
        this.#initGamesAndPredictions(data.slice(HEADER_ROW_COUNT));

        this.ready = true;
    }

    #initGamesAndPredictions(sheetRows){
        sheetRows.map((row, gameId) => {
            let game = Game.fromSheetRow(row, gameId);
            this.games[gameId] = game;

            // Create predictions for each player
            Object.keys(this.players).map((playerName, playerIndex) => {
                let prediction = new Prediction(playerName, gameId, row[playerIndex + PREDICTION_OFFSET]);
                this.predictions[gameId] = this.predictions[gameId] || {};
                this.predictions[gameId][playerName] = prediction;
            });
        });
    }

    #initPlayers(playerNames){
        playerNames.map((name) => {
            this.players[name] = new Player(name);
        });
    }

}