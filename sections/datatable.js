sections.push('publishDatatable');

var datatable1;

if (!$("#container_datatable").length) {
	$("#sections").append(`<div id="container_datatable" class="float-end container" style="display: none">
			<h2>Egyházmegyék összehasonlítása táblázatos formában</h2>
			<p>Az egyes területi egységek különféle adatait itt táblázatos formában tudjuk összehasonlítani. Az oszlopok vonszolással mozgathatóak, és a legtöbb esetben sorba is lehet rendezni egy-egy oszlop szerint a táblázatot. Alul a <a href="#config">Beállítások</a> részben adhatjuk meg, hogy mely területek jelenjenek meg a listában. Valamint egy összetett JSON formátum segítségével állíthatjuk be, hogy milyen oszlopaink legyenek és ott hogyan jelenítsük meg az értékeket.</p>
			<div class="row">
			<label for="selectOrder1" class="col-sm-2">Rendezés alapja</label>
			<select class="form-select col-sm" id="selectOrder1" onchange="publish('publishDatatable')">
				<option value="2022data">2022-es KSH adatok</option>
				<option value="2011data">2011-es KSH adatok</option>
				<option value="2001data">2001-es KSH adatok</option>
				<option value="diff20012011">Változás 2001 és 2011 között</option>
				<option value="diff20112022">Változás 2011 és 2022 között</option>
				<option value="diff20012022">Változás 2001 és 2022 között</option>
			</select>
			</div>
			<table id="datatable" class="stripe row-border hover"></table>
			
		</div>
		<div class="b-example-divider float-end"></div>`
	);
}

$('#datatable').on( 'column-reorder.dt', function () {
	ChartMarkup.renderAll()
} );


function publishDatatable(data, settings) {
	$.fn.dataTableExt.sErrMode='none'
	document.getElementById("container_datatable").style.display = "block";

	if (datatable1) {
		datatable1.destroy()
		datatable1 = null
		$('#datatable').html('')
	}



	datatable1 = $('#datatable').DataTable(
		{
			paging: false,
			searching: false,
			info: false, //english footer,
			colReorder: true,
			buttons: ["print"],
			data: Object.keys(data)
				.reduce((cur, key) => {
					data[key]
					cur.push({
						diocese: data[key].name,
						...data[key].data
					})
					return cur
				}, []),
			columns: [{
				data: 'diocese',
				title: 'Egyházmegye',
			},
			...settings.map(c => {

				if (c['inProprotionTo']) {
					var title = `<span title="${c['data']}">${getLabel(c['data'])}</span>
								<br/><small>Arányosítva: <span title="${c['inProprotionTo']}">${getLabel(c['inProprotionTo'])}</span></small>`;

				} else {
					var title = "<span title='" + c['data'] + "' data-bs-toggle='tooltip'>" + getLabel(c['data']) + "</span>";
				}

				return {
					data: c['data'],
					title: title,
					render: function (data, type, row) {
						return Markup.callMarkup(data, type, row, {...c, showBig: false})
					}
				}
			})],
			fixedColumns: {
				left: 1
			}

		}
	);
}