sections.push('publishSettingsTable');

var settingsTable;

if (!$("#container_settingsTable").length) {
    $("#sections").append(`<div id="container_settingsTable" class="float-end container">
			<h2>Beállítások</h2>
            <h3>Adatmező hozzáadása</h3>
            <div class="container" id="addNodeContainer"></div>
            <h3>Megjelenített adatmező(k)</h3>

			<p>Itt lehet beállítani, hogy az egyházmegyei táblázatban milyen adatok jelenjenek meg és milyen formában</p>
			<table id="settingsTable" class="stripe row-border hover"></table>
			
		</div>
		<div class="b-example-divider float-end"></div>`
    );
}
function removeDataFromSettings(id) {
    settings.splice(id,1)
    $("#config_textarea").html(JSON.stringify(settings, null, 2));
    publish()
}

function publishSettingsTable(data, settings) {
    $.fn.dataTableExt.sErrMode = 'none'

    if (settingsTable) {
        settingsTable.destroy()
        $('#settingsTable').html('')
    }



    settingsTable = $('#settingsTable').DataTable(
        {
            paging: false,
            ordering: false,
            searching: false,
            info: false, //english footer,
            buttons: ["print"],
            data: settings,
            columns: [{
                data: 'data',
                title: 'Adat (arányosítva)',
                render: function (data, type, row, meta) {
                    if (row['inProprotionTo']) {
                        return `<span title="${row['data']}">${getLabel(row['data'])}</span>
                                    <br/><small>Arányosítva: <span title="${row['inProprotionTo']}">${getLabel(row['inProprotionTo'])}</span></small>`;
    
                    } else {
                        return "<span style='white-space:normal' title='" + row['data'] + "' data-bs-toggle='tooltip'>" + getLabel(row['data'], true) + "</span>";
                    }
                },

            },
            {
                data: 'markup',
                title: 'Megjelenítés típusa',
                render: function (data, type, row, meta) {
                    return "<span title='" + Markup.getName(data) + "' data-bs-toggle='tooltip'>" + Markup.getName(data) + "</span>";
                },

            },
            {
                data: 'Remove',
                title: 'Levétel',
                render: function (data, type, row, meta) {
                    return `<button type="button" class="btn btn-danger" onclick="removeDataFromSettings(${meta.row})"><i class="fa fa-trash"></i></button>`
                },

            }]

        }
    );
}