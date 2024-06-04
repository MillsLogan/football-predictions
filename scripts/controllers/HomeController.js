import { Controller } from './Controller.js';

export class HomeController extends Controller{
    renderPage(...getParams){
        this.renderNavbar("");

        this.#initializePlayerRecords();

        this._renderLeaderboard(Object.values(this.database.players).slice(0, -1)); // Drop the 'New Player' record

        this._renderRecentGames(this.database.getAllRecentGames(this.TEAMS.length));

        this._renderUpcomingGames(this.database.getAllUpcomingGames(this.TEAMS.length));
    }

    #initializePlayerRecords(){
        this.TEAMS.map(team => {
            let teamModel = this.database.getTeamByCityAndName(team.city, team.name);
            this.database.fillPlayerRecordFromTeam(teamModel);
        });
    }
}