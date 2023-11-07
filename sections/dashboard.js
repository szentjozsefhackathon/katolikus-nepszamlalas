sections.push('publishDashboard');

if (!$("#container_dashboard").length) {
	$("#sections").append(`<div id="container_dashboard" class=" container float-end" style="display: none">
			<h2 class="chart-title">Egyházmegyénkénti Dashboard</h2>
			<p>Itt egy-egy területi egységnek láthatjuk a kiválogatott adatait, így a táblázatos formánál áttekinthetőbb információkat kapunk. Azt hogy milyen adatok jelenjenek meg itt, és hogy milyen sorrendben, azz alul a <a href="#config">Beállítások</a> részben adhatjuk meg egy elsőre talán szokatlan JSON formátumban. Számtalan adat áll rendelkezésre és akár grafikonokat is meg tudunk jeleníteni.</p>
			<div id="dashboard"  class="">
				<div class="description"></div>
				<div class="settings"></div>
				<table id="datatableDashboard" class="cell-border"></table>
				<div class=""></div>			
			</div>
		<div class="b-example-divider float-end"></div>`
	);
}

var datatable_dashboard;

function publishDashboard(filteredData, settings) {
	document.getElementById("container_dashboard").style.display = "block";

	if (!$('#dashboard .select').length) {
		var markup = `<select id='dashboard_select' class='select form-control' onchange='publish("publishDashboard")'>`;
		for (let i = 0; i < Object.values(filteredData).length; i++) {

			markup += "<option value=\"" + filteredData[Object.keys(filteredData)[i]]['osmid'] + "\">" + filteredData[Object.keys(filteredData)[i]]['name'] + "</option>"
		}
		markup += "</select>";

		$("#dashboard .settings").html(markup);
	}


	var osmid = $("#dashboard_select option:selected")[0].value;

	var id;
	Object.entries(filteredData).forEach(([key, value]) => {
		if (value['osmid'] == osmid) {
			id = key;
			return
		}
	});

	const data = filteredData[id];


	if (datatable_dashboard) {
		datatable_dashboard.destroy()
		$('#datatableDashboard').html('')
	}

	const details = `
	  <h5 class="card-title">` + data['name'] + `</h5>
	  <h6 class="card-subtitle mb-2 text-muted">Ez egy remek hely.</h6>
	  <p class="card-text">Bármi összefoglaló leírás itten.</p>`
	var markups = [details, ...settings.map((value) => {
		var subtitle = "";
		if (value['inProprotionTo']) subtitle = `
			<h6 class="card-subtitle mb-2 text-muted" title="${subtitle}">
				Arányosítva: ${getLabel(value['inProprotionTo'])}</h6>`;


		return `<h5 class="card-title" title="${value['data']}">${getLabel(value['data'])}</h5>
		 		${subtitle}
		 		${Markup.callMarkup(data['data'][value['data']], false, data['data'], value)}`
	})]


	const COLUMNS = 3
	function generateColumns() {
		columns = []
		for (var i = 0; i < COLUMNS; i++) {
			columns.push({ data: `${i}`, title: '' })
		}
		return columns
	}

	function generateData() {
		var actualCol = 0;
		var rows = [];
		var actualRow = {}
		for (const markup in markups) {
			actualRow[actualCol] = markups[markup]

			if (++actualCol == COLUMNS || markup == markups.length-1) {
				rows.push(actualRow)
				actualRow = {}
				actualCol = 0
			}


		}
		return rows
	}
	datatable_dashboard = $('#datatableDashboard').DataTable(
		{
			paging: false,
			searching: false,
			info: false, //english footer,
			colReorder: false,
			ordering: false,
			buttons: ["print"],
			data: generateData(),
			columns: generateColumns()
		}
	);
}


