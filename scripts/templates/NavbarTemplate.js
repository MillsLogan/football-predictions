export class NavbarTemplate{
    static render(teams, players){
        return String.raw`
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" aria-label="Ninth navbar example">
            <div class="container-xl">
                <a class="navbar-brand" href="/football-predictions">Football Predictions</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
        
                <div class="collapse navbar-collapse" id="navbar">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="/football-predictions">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Teams</a>
                            <ul class="dropdown-menu">
                                ${this.teamDropdownTemplate(teams)}
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Make Predictions</a>
                            <ul class="dropdown-menu">
                                ${this.playerDropdownTemplate(players)}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;
    }

    static setActivePage(activePage){
        document.querySelectorAll(`[href="/football-predictions${activePage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    static teamDropdownTemplate(teams){
        let teamLinks = teams.map(team => {
            return `<li><a class="dropdown-item" href="/football-predictions/team?team=${team.name.toLowerCase()}">${team.name}</a></li>`
        });
        return teamLinks.join('');
    }

    static playerDropdownTemplate(players){
        let playerLinks = players.map(player => {
            return `<li><a class="dropdown-item" href="/football-predictions/predict?player=${player.name.toLowerCase()}">${player.name}</a></li>`
        });
        return playerLinks.join('');
    }
}