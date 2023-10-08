sections.push('publishDatatable');

var datatable1;

if( ! $("#container_datatable").length ) {
	$("#sections").append(`<div id="container_datatable" class="float-end container" style="display: none">
			<h2>KSH adatok kategóriánként</h2>
			<label for="selectOrder1">Rendezés alapja</label>
			<select class="form-control" id="selectOrder1" onchange="reRender()">
				<option value="2022data">2022-es KSH adatok</option>
				<option value="2011data">2011-es KSH adatok</option>
				<option value="2001data">2001-es KSH adatok</option>
				<option value="diff20012011">Változás 2001 és 2011 között</option>
				<option value="diff20112022">Változás 2011 és 2022 között</option>
				<option value="diff20012022">Változás 2001 és 2022 között</option>
			</select>
			<table id="datatable"></table>
			
		</div>
		<div class="b-example-divider float-end"></div>`
		);
}


function publishDatatable(data, headers) {

			document.getElementById("container_datatable").style.display = "block";
				
			if (datatable1) {
				datatable1.destroy()
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
					...headers.filter(c => getLabel(c) && settings.includes(c)).map(c => {
						return {
							data: c,
							title: getLabel(c),
							render: function (data, type, row) {
								return markupData(data, type, row)
							}
						}
					})]
				}
			);
		}