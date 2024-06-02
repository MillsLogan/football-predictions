import { database } from './main.js';
import { Player } from './Player.js';
import { TeamGame } from './TeamGame.js';

export class Controller{
    static homePage(){
        let players = database.players;

        database.createTeam("New York", "Giants");
        database.createTeam("Pittsburgh", "Steelers");
        database.createTeam("Dallas", "Cowboys");
        database.createTeam("Philadelphia", "Eagles");
        database.createTeam("New England", "Patriots");
        database.createTeam("Los Angeles", "Chargers");
        Controller.connectLeaderboard(players);
        Controller.connectUpcomingGames(database);
        Controller.connectUpcomingPredictions(database);
    }

    static teamPage(team){
        let players = database.players;
        let games = team.schedule;

        $("#teamName").text(team.name);
        $("#teamRecord").text(team.wins + " - " + team.losses);

        Controller.connectTeamSchedule(games);
        Controller.connectTeamLeaderboard(players, team);
        Controller.teamUpcomingPredictions(team);
    }

    static predictionPage(team, player){
        $("#downloadPredictions").on("click", function(){
            let csv = "data:text/csv;charset=utf-8,";
            csv += "Week,Home,Away,Prediction\n";
            database.games.forEach(game => {
                let row = `${game.week},${game.home},${game.away},${game.predictions.find(p => p.player.name === player.name).prediction}\n`;
                csv += row;
            });
            let encodedUri = encodeURI(csv);
            $(this).attr("href", encodedUri);
            $(this).attr("download", "predictions.csv");
        })
        $(".team-button").off("click");
        $(".team-button").on("click", function(){
            let teamName = $(this).data("team-name");
            let teamCity = $(this).data("team-city");
            let team = database.createTeam(teamCity, teamName);
            $(".team-button").removeClass("active");
            $(this).addClass("active");
            Controller.predictionPage(team, player);
        });

        $("#teamName").text(team.name);

        let games = team.schedule;
        $("#predictionTable").empty();
        games.forEach(game => {
            let row = $("<tr>");
            row.append($("<td class='week'>").text(game.week));
            row.append($("<td class='date'>").text(game.date.format("ddd, MM-DD")));
            row.append($("<td class='time'>").text(game.time));
            if(game.isHomeGame){
                row.append($("<td class='name'>").text(game.opponent));
            }else{
                row.append($("<td class='name'>").text("@ " + game.opponent));
            }

            let prediction = game.predictions.find(p => p.player.name === player.name);

            let select = $("<select required class='form-select'>");
            select.append($("<option value='' selected disabled>").text("Will the " + team.name + " win?"));
            select.append($("<option value='W'>").text("W"));
            select.append($("<option value='L'>").text("L"));
            row.append($("<td>").append(select));

            if(prediction !== "" && prediction !== undefined){
                select.val(prediction.prediction);
            }

            $("#predictionTable").append(row);
            row.on("change", "select", function(){
                let wins = document.getElementsByTagName("select");
                wins = Array.from(wins).map(win => win.value);
                wins = wins.filter(win => win === "W");
                let losses = document.getElementsByTagName("select");
                losses = Array.from(losses).map(loss => loss.value);
                losses = losses.filter(loss => loss === "L");
                $("#teamRecord").text(wins.length + " - " + losses.length);
                game.predictions.find(p => p.player.name === player.name).prediction = $(this).val();
                database.updateGameFromTeamGame(game, team.fullName);
            });
        });

        let wins = document.getElementsByTagName("select");
        wins = Array.from(wins).map(win => win.value);
        wins = wins.filter(win => win === "W");
        let losses = document.getElementsByTagName("select");
        losses = Array.from(losses).map(loss => loss.value);
        losses = losses.filter(loss => loss === "L");
        $("#teamRecord").text(wins.length + " - " + losses.length);
    }

    static connectTeamSchedule(games){
        $("#teamSchedule").empty();
        games.forEach(game => {
            let row = $("<tr>");
            row.append($("<td class='week'>").text(game.week));
            row.append($("<td class='date'>").text(game.date.format("ddd, MM-DD")));
            if(!game.isHomeGame){
                row.append($("<td class='name'>").text(game.opponent));
            }else{
                row.append($("<td class='name'>").text("@ " + game.opponent));
            }
            row.append($("<td class='prediction'>").text(game.result));
            let actualPlayers = game.predictions.slice(0,7);
            actualPlayers.forEach(prediction => {
                row.append($("<td class='prediction'>").text(prediction.prediction));
            });
            $("#teamSchedule").append(row);
        });
    }

    static connectTeamLeaderboard(players, team){
        let teamPlayerRecord = team.getTeamPlayerRecord(players);
        teamPlayerRecord.sort((a, b) => b.correct - a.correct);
        $("#leaderboard").empty();
        let actualPlayers = teamPlayerRecord.slice(0,7);
        actualPlayers.forEach((player, index) => {
            let row = $("<tr>");
            row.append($("<td class='rank'>").text(index + 1));
            row.append($("<td class='name'>").text(player.player.name));
            row.append($("<td class='correct'>").text(player.correct));
            row.append($("<td class='incorrect'>").text(player.incorrect));
            $("#leaderboard").append(row);
        });
        
    }

    static teamUpcomingPredictions(team){
        let games = team.schedule.filter(game => game.result === '');
        $("#upcomingPredictions").empty();
        if(games.length > 7){
            games = games.slice(0, 7);
        }
        games.forEach(game => {
            let row = $("<tr>");
            row.append($("<td class='week'>").text(game.week));
            row.append($("<td class='date'>").text(game.date.format("ddd, MM-DD")));

            if(game.isHomeGame){
                row.append($("<td class='name'>").text(game.opponent));
            }else{
                row.append($("<td class='name'>").text("@ " + game.opponent));
            }

            let actualPlayers = game.predictions.slice(0,7);

            actualPlayers.forEach(prediction => {
                if(prediction.prediction === team.name){
                    row.append($("<td class='prediction'>").text("W"));
                }else if(prediction.prediction === ''){
                    row.append($("<td class='prediction'>").text(""));
                }else{
                    row.append($("<td class='prediction'>").text("L"));
                }
            });
            $("#upcomingPredictions").append(row);
        });
    }

    static connectLeaderboard(players){
        $("#leaderboard").empty();
        let actualPlayers = players.slice(0,7);
        actualPlayers.sort((a, b) => b.correct - a.correct);
        actualPlayers.forEach((player, index) => {
            let row = $("<tr>");
            row.append($("<td class='rank'>").text(index + 1));
            row.append($("<td class='name'>").text(player.name));
            row.append($("<td class='correct'>").text(player.correct));
            row.append($("<td class='incorrect'>").text(player.incorrect));
            $("#leaderboard").append(row);
        });
    }

    static connectUpcomingGames(database){
        database.getUpcomingGames(7).forEach(game => {
            let row = $("<tr>");
            row.append($("<td class='week'>").text(game.week));
            row.append($("<td class='date'>").text(game.date.format("ddd, MM-DD")));
            row.append($("<td class='time'>").text(game.time));
            row.append($("<td class='name'>").text(game.home));
            row.append($("<td class='name'>").text(game.away));
            $("#upcomingGames").append(row);
        });
    }

    static connectUpcomingPredictions(database){
        database.getUpcomingGames(6).forEach(game => {
            let row = $("<tr>");
            row.append($("<td class='name'>").text(game.away));
            row.append($("<td class='name'>").text(game.home));
            row.append($("<td class='prediction'>").text(game.predictions[0].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[1].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[2].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[3].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[4].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[5].prediction));
            row.append($("<td class='prediction'>").text(game.predictions[6].prediction));

            $("#upcomingPredictions").append(row);
        });
    }
}