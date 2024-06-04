export class LeaderboardTemplate{
    static tableTemplate(tableRows){
        return String.raw`
        <h2 class="subtitle tex-center">Leaderboard</h2>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Player</th>
                        <th scope="col">Correct</th>
                        <th scope="col">Incorrect</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `
    }


    static rowTemplate(index, player){
        return String.raw`
            <tr>
                <th scope="row" class="rank">${index + 1}</th>
                <td class="name">${player.name}</td>
                <td class="correct">${player.correct}</td>
                <td class="incorrect">${player.incorrect}</td>
            </tr>
        `
    }

    static render(players){
        return this.tableTemplate(this.#fillRows(Object.values(players)));
    }

    static #fillRows(players){
        let rows = ``;
        let index = 0;
        players = players.sort((a, b) => {return b.correct - a.correct });
        players.map((player) => {
            rows += this.rowTemplate(index, player);
            index++;
        });

        return rows;
    }
}