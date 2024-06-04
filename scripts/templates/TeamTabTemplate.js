export class TeamTabTemplate{
    static renderTab(teamName){
        return String.raw`
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="${teamName}-tab" data-bs-toggle="tab" data-bs-target="#${teamName}-tab-pane" type="button" role="tab" aria-controls="${teamName}-tab-pane" aria-selected="false">${teamName}</button>
            </li>`
    }

    static renderTabPane(teamName){
        return String.raw`
            <div class="tab-pane fade" id="${teamName}-tab-pane" role="tabpanel" aria-labelledby="${teamName}-tab-pane">
                <h2 class="section-title">${teamName}</h2>
                <div class="section-container" id="${teamName}-games-container">

                </div>
            </div>
        `
    }
}