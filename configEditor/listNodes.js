function listNodes() {
    $("#listNodeContainer").html(`
      <div class="container">
        <label for="newNodeType">Megjelenítés típusa</label>
        <select class="form-control" id="newNodeType">
          ${Object.keys(Markup.list()).map(key => `<option value="${key}">${Markup.list()[key].hungarianName}</option>`).join('\n')}
        </select>
        <div id="container_NewNodeData">
          <label for="newNodeData">Adat</label>
          <select class="form-control" id="newNodeData"></select>
        </div>
        <div id="newNodeYears">
          <label>Megjelenített évek</label>
          <div class="form-check-inline">
            <input class="form-check-input" type="checkbox" id="newNode2022" checked>
            <label class="form-check-label" for="newNode2022">
              2022
            </label>
          </div>
          <div class="form-check-inline">
            <input class="form-check-input" type="checkbox" id="newNode2011">
            <label class="form-check-label" for="newNode2011">
              2011
            </label>
          </div>
          <div class="form-check-inline">
            <input class="form-check-input" type="checkbox" id="newNode2001">
            <label class="form-check-label" for="newNode2001">
              2001
            </label>
          </div>
        </div>
        <div id="container_NewNodeInProprotionTo">
          <input class="form-check-input" type="checkbox" id="newNodeInProprotionToCheck" checked>
          <label class="form-check-label" for="newNodeInProprotionToCheck">
            Arányosítás
          </label>
          <br>
          <div id="container_newNodeInProprotionTo_Field">
            <label for="newNodeInProprotionTo">Arányosítva ehhez</label>
            <select class="form-control" id="newNodeInProprotionTo"></select>
          </div>
        </div>
        <button id="addNodeButton" type="button" class="btn btn-primary">Elem hozzáadása</button>
     </div>`
    );
  }
