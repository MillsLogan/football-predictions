import { database } from '../main.js';
import { NavbarTemplate } from '../templates/NavbarTemplate.js';
import { LeaderboardTemplate } from '../templates/LeaderboardTemplate.js';
import { GameTemplate } from '../templates/GameTemplate.js';

const TEAMS = [
    {
        city: 'Pittsburgh',
        name: 'Steelers'
    },
    {
        city: 'New York',
        name: 'Giants'
    },
    {
        city: 'Dallas',
        name: 'Cowboys'
    },
    {
        city: 'Philadelphia',
        name: 'Eagles'
    },
    {
        city: 'New England',
        name: 'Patriots'
    },
    {
        city: 'Los Angeles',
        name: 'Chargers'
    }
];

export class Controller{
    constructor(){
        if(new.target === Controller){
            throw new Error("Cannot create an instance of an interface.");
        }

        this.TEAMS = TEAMS;

        this.database = database;
    }

    renderPage(...getParams){
        throw new Error("Method 'renderPage()' must be implemented.");
    }

    renderNavbar(activePage){
        let players = Object.values(this.database.players);
        let navbar = NavbarTemplate.render(TEAMS, players, activePage);
        document.getElementById('navbar-container').innerHTML = navbar;
        NavbarTemplate.setActivePage(activePage);
    }

    _renderUpcomingGames(games){
        if(games.length === 0){
            $('#upcoming-games-container').html('<h2 class="subtitle text-center">No Upcoming Games</h2>');

            return;
        }

        let gamesTemplate = games.map(game => GameTemplate.gameTemplate(game)).join('');
        $('#upcoming-games-container').html(gamesTemplate);

        this._putPlayerPredictionsOnGames(games);
    }

    _renderRecentGames(games){
        if(games.length === 0){
            $('#recent-games-container').html('<h2 class="subtitle text-center">No Recent Games</h2>');
            return;
        }

        let gamesTemplate = games.map(game => GameTemplate.gameTemplate(game)).join('');
        $('#recent-games-container').html(gamesTemplate);
        this._putPlayerPredictionsOnGames(games);
        this._renderWinnerBadges(games);
    }

    _renderWinnerBadges(games){
        games.forEach(game => {
            let gameContainer = document.querySelector(`[data-game-id="${game.id}"]`);
            let winnerName = game.winner;
            let winnerContainer = $(gameContainer).find(`[data-team-name="${winnerName}"]`).closest('[class^="col"]');
            winnerContainer.addClass('winner');
            
            let loserName = game.winner === game.home ? game.away : game.home;
            let loserContainer = $(gameContainer).find(`[data-team-name="${loserName}"]`).closest('[class^="col"]');
            loserContainer.addClass('loser');
        });
    }

    _putPlayerPredictionsOnGames(games){
        games.forEach(game => {
            let playerPredictions = this.database.predictions[game.id];
            let gameContainer = document.querySelector(`[data-game-id="${game.id}"]`);
            for(let playerName in playerPredictions){
                let playerPrediction = playerPredictions[playerName];
                let teamName = playerPrediction.winner;
                let teamContainer = $(gameContainer).find(`[data-team-name="${teamName}"]`).closest('[class^="col"]');
                teamContainer.append(GameTemplate.playerPredictionTemplate(this.database.players[playerName]));
            }
        });
    }
    
    _renderLeaderboard(players){
        let leaderboardTemplate = LeaderboardTemplate.render(players);
        document.getElementById('leaderboard-container').innerHTML = leaderboardTemplate;
    }
}