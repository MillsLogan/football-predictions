import { Controller } from './Controller.js';
import { TeamTabTemplate } from '../templates/TeamTabTemplate.js';
import { GameTemplate } from '../templates/GameTemplate.js';
import { PredictionTemplate } from '../templates/PredictionTemplate.js';

export class PredictController extends Controller{
    constructor(){
        super();
        this.currentTeam = null;
    }

    renderPage(playerName){
        let player = this.#getPlayer(playerName);

        this.renderNavbar("/predict?player=" + player.name.toLowerCase());

        this.#renderTeamTabsAndPanes(player);

        this.#connectDownloadPredictionsButton(player);
    }

    #connectDownloadPredictionsButton(player){
        let downloadButton = $("#download-predictions");
        downloadButton.on("click", () => {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Week,Home,Away,Prediction\n";
            Object.values(this.database.predictions).forEach(allPlayerPredictions => {
                let prediction = allPlayerPredictions[player.name];
                let game = this.database.games[prediction.gameId];
                csvContent += game.week + "," + game.home + "," + game.away + "," + prediction.winner + "\n";
            });
            
            let encodedUri = encodeURI(csvContent);
            downloadButton.attr("href", encodedUri);
            downloadButton.attr("download", player.name + "_predictions.csv");
        });
    }

    #renderPlayerPredictions(player, tabPane){
        tabPane.siblings().empty();
        this.#renderTeamSchedule(player, tabPane);
    }

    #renderTeamSchedule(player, tabPane){
        $("#team-name-header").text(this.currentTeam.fullName);
        this.currentTeam.schedule.forEach(game => {
            tabPane.append(GameTemplate.gameTemplate(game));
        });

        this.#connectGameToPrediction(player);
    }

    #connectGameToPrediction(player){
        let games = $(".game-container");

        for(let i = 0; i < games.length; i++){
            let game = $(games[i]);
            let gameId = game.data("game-id");
            let gameObj = this.database.games[gameId];
            let prediction = this.database.predictions[gameId][player.name];
            
            game = game.find("div.row").last();
            game.append(PredictionTemplate.renderPredictionButtons());

            // Win button
            let buttons = game.find(".prediction-button");
            buttons[0].addEventListener("click", (e) => {
                buttons[0].classList.add("active");
                buttons[1].classList.remove("active");
                prediction.winner = this.currentTeam.fullName;
                this.#renderPrediction(game, prediction);
                this.#updateRecord();
            });

            // Loss button
            buttons[1].addEventListener("click", (e) => {
                buttons[0].classList.remove("active");
                buttons[1].classList.add("active");
                prediction.winner = gameObj.getOpponent(this.currentTeam.fullName);
                console.log(prediction);
                this.#renderPrediction(game, prediction);
                this.#updateRecord();
            });

            this.#renderPrediction(game, prediction);
            this.#updateRecord();
        }
    }

    #updateRecord(){
        $("#team-wins").text($(`.winner:has([data-team-name='${this.currentTeam.fullName}'])`).length);
        $("#team-losses").text($(`.loser:has([data-team-name='${this.currentTeam.fullName}'])`).length);
    }

    #renderPrediction(game, prediction){
        if(prediction.winner === "" || prediction.winner === undefined){
            game.find(".team-container").removeClass("winner loser");
            return;
        }
        game.find(".team-container").removeClass("winner loser");
        game.find("[data-team-name='" + prediction.winner + "']").closest("[class^=col]").addClass("winner");
        game.find(".team-container:has([data-team-name!='"+ prediction.winner + "'])").addClass("loser");
    }

    #renderTeamTabsAndPanes(player){
        this.TEAMS.forEach(team => {
            $("#team-tabs").append(this.#renderTab(team.name));
            $("#team-tab-panes").append(this.#renderTabPane(team.name));
        }
        );

        this.#connectTabsToRender(player);
    }

    #connectTabsToRender(player){
        let tabs = $("#team-tabs").children();
        let tabPanes = $("#team-tab-panes").children();

        for(let i = 0; i < tabs.length; i++){
            tabs[i].addEventListener("click", () => {
                this.currentTeam = this.database.getTeamByCityAndName(this.TEAMS[i].city, this.TEAMS[i].name);
                this.#renderPlayerPredictions(player, $(tabPanes[i]));
            });
        }
    }

    #renderTab(team){
        return TeamTabTemplate.renderTab(team);
    }

    #renderTabPane(team){
        return TeamTabTemplate.renderTabPane(team);
    }

    #formatPlayerName(playerName){
        if(playerName){
            return playerName.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        }

        return "New Player"
    }

    #getPlayer(playerName){
        if(playerName === "") playerName = "player=New Player";

        playerName = playerName.split("=")[1];

        playerName = this.#formatPlayerName(playerName);

        return this.database.players[playerName] ? this.database.players[playerName] : this.database.players["New Player"];
    }
}