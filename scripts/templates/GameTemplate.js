export class GameTemplate{
    static gameTemplate(game){
        return String.raw`
            <div class="game-container text-center" data-game-id="${game.id}">
                <div class="row text-center">
                    <div class="col-12">
                        <h1 class="game-date">${game.date.format("dddd, MM/DD")}</h1>
                        <hr>
                    </div>
                    ${this.teamTemplate(game.away)}
                    <div class="col-sm-2">
                        <h1 class="game-vs">VS</h1>
                    </div>
                    ${this.teamTemplate(game.home)}
                </div>
            </div>`
    }

    static teamTemplate(team){
        return String.raw`
            <div class="col-sm-5 team-container">
                <h2 class="team-name" data-team-name="${team}">${team}</h2>
            </div>`
    }

    static playerPredictionTemplate(playerObj){
        return String.raw`<span class="badge text-bg-dark mx-1 prediction-badge" data-player-correct="${playerObj.correct}" data-player-incorrect="${playerObj.incorrect}" data-player-name="${playerObj.name}">${playerObj.name}</span>`;
    }

}
