import { Controller } from './Controller.js';


export class TeamController extends Controller{
    teamPaths = {
        "team=steelers": this.TEAMS[0],
        "team=giants": this.TEAMS[1],
        "team=cowboys": this.TEAMS[2],
        "team=eagles": this.TEAMS[3],
        "team=patriots": this.TEAMS[4],
        "team=chargers": this.TEAMS[5],
        "default": this.TEAMS[0],
    }

    renderPage(teamName){

        let team = this.teamPaths[teamName] ? this.teamPaths[teamName] : this.teamPaths["default"];
        
        team = this.database.getTeamByCityAndName(team.city, team.name);

        this.renderNavbar("/team?team=" + team.name.toLowerCase());

        this.#initializePlayerRecords(team);

        this.#setTeamTitle(team);

        this._renderLeaderboard(Object.values(this.database.players).slice(0, -1)); // Drop the 'New Player' record

        this._renderRecentGames(team.getRecentGames(6));

        this._renderUpcomingGames(team.getUpcomingGames(6));
    }

    #initializePlayerRecords(team){
        this.database.fillPlayerRecordFromTeam(team);
    }

    #setTeamTitle(team){
        $("#team-city").text(team.city);
        $("#team-name").text(team.name);
        $("#team-wins").text(team.wins);
        $("#team-losses").text(team.losses);
    }

}