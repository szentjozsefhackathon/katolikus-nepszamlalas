var datatable1;
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