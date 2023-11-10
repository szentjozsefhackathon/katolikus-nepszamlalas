if ($("#addNodeContainer").length == 1) {
  $("#addNodeContainer").append(`
    <div class="container">
      <label for="newNodeType">Megjelenítés típusa</label>
      <select class="form-select" id="newNodeType">
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
      <button id="addNodeButton" type="button" class="btn btn-primary">Adatmező hozzáadása</button>
   </div>`
  );
}

$("#newNodeInProprotionToCheck").click(function() {
  if ($("#newNodeInProprotionToCheck").prop("checked")) $("#container_newNodeInProprotionTo_Field").show()
  else $("#container_newNodeInProprotionTo_Field").hide()
})

$("#newNodeType").on("change", event => {
  const mu = Markup.list()[$("#newNodeType").val()]
  if (mu.year) $("#newNodeYears").show()
  else $("#newNodeYears").hide()

  if (mu.inProprotionTo) $("#container_NewNodeInProprotionTo").show()
  else $("#container_NewNodeInProprotionTo").hide()

  if (mu.multipleData) $("#newNodeData").attr("multiple", "multiple")
  else $("#newNodeData").removeAttr("multiple")

  $("#newNodeData").select2()

})

$("#newNodeType").trigger("change")


function getNewNodeData() {
  const node = {markup: $("#newNodeType").val(), data: $("#newNodeData").val()}
  const mu = Markup.list()[$("#newNodeType").val()]
  if (mu.year) {
    node.years = YEARS.filter(y => $(`#newNode${y}`).prop("checked"))
  }
  if (mu.inProprotionTo && $("#newNodeInProprotionToCheck").prop("checked")) {
    node.inProprotionTo = $("#newNodeInProprotionTo").val()
  }

  return node
}

$("#addNodeButton").click(function() {
  settings.push(getNewNodeData())
  $("#config_textarea").html(JSON.stringify(settings, null, 2));
  changeSetting()
  publish()
})