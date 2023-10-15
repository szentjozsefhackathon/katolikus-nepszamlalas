sections.push('publishMap');

if (!$("#container_map").length) {
    $("#sections").append(`<div class="container float-end" id="container_map">
            <h2>Térkép</h2>
            <label for="mapData">Megjelenített adat</label>
            <select id="mapData" class="form-control" onchange="publish('publishMap')"></select>
            <label for="mapInProprotionTo">Arányosítva ehhez</label>
            <select id="mapInProprotionTo" class="form-control" onchange="publish('publishMap')"></select>
            <label for="mapColoring">Színezés alapja</label>
			<select class="form-control" id="mapColoring" onchange="publish('publishMap')">
				<option value="2022data">2022-es KSH adatok</option>
				<option value="2011data">2011-es KSH adatok</option>
				<option value="2001data">2001-es KSH adatok</option>
				<option value="diff20012011">Változás 2001 és 2011 között</option>
				<option value="diff20112022">Változás 2011 és 2022 között</option>
				<option value="diff20012022">Változás 2001 és 2022 között</option>
			</select>
			<div id="map" style="height: 800px"></div>
		</div>
		<div class="b-example-divider float-end"></div>`
    );
}

var map;

function publishMap(filteredData, settings) {
    if(map) {
        map.remove()
        $("#map").html("")
    }
    map = L.map('map').setView([47.134, 19.693], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 8,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.dragging.disable();



    // control that shows state info on hover
    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };


    info.update = function (props) {
        var HU = filteredData.find(d => d.name == "Magyarország")
        HU = {diocese: HU.name, ...HU.data}
        const _HU = Markup.callMarkup(HU[$("#mapData option:selected")[0]?.value || "RE_C"], "data", HU, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value || "NEME_SEX"})
        var d = props ? filteredData.find(d => d.name.toLowerCase() == props.name.toLowerCase()) : null
        if (d) {
            d = { diocese: d.name, ...d.data }
        }
        const markup = props ? Markup.callMarkup(d[$("#mapData option:selected")[0].value], "data", d, { data: $("#mapData option:selected")[0].value, inProprotionTo: $("#mapInProprotionTo option:selected")[0].value }) : ""
        const contents = props ? `<b>${props.name}</b><br/>${markup}` : 'Irányítsa a kurzort egy egyházmegye fölé';

        this._div.innerHTML = `<h4>Magyarország</h4>${_HU}<br>${contents}`;
    };

    info.addTo(map);


    function getColor(name) {
        function RGB2HTML(red, green, blue) {
            var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
            return '#' + decColor.toString(16).substr(1);
        }

        var d = filteredData.find(d => d.name.toLowerCase() == name.toLowerCase())
        if (d) {
            d = { diocese: d.name, ...d.data }
        }
        const value = Math.floor(Markup.callMarkup(d[$("#mapData option:selected")[0]?.value||"RE_C"], "sort", d, { data: $("#mapData option:selected")[0]?.value || "RE_C", inProprotionTo: $("#mapInProprotionTo option:selected")[0]?.value ||"NEME_SEX" }, "mapColoring"))
        return value < 0 ? RGB2HTML(255, Math.floor(value*2.55), Math.floor(value*2.55)) :
                value > 0 ? RGB2HTML(255-Math.floor(value*2.55), 255, 255-Math.floor(value*2.55)):"#FFFFFF"

    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.name),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        layer.bringToFront();

        info.update(layer.feature.properties);
    }

    /* global statesData */
    const geojson = L.geoJson(dioceses_osm, { style: style, onEachFeature: onEachFeature }).addTo(map);


    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }
}