class ChartMarkup extends Markup {
  static toRender = []
  static renderAll() {
    while (this.toRender.length>0) {
      var r = this.toRender.shift()
      try { // Valamiért dob hibát, de mégis működik, ha elkapjuk...
        new Chart(document.getElementById(r.name), r.settings)
      } catch{
      }

    }
  }
  render() {
    const type = this.settings["markup"].slice(0, -5)
    const random = Math.random()

    const toRender = this.settings.toRender!==false;

    if (this.type == "sort" || this.type == 'type') return 0
    const labels = this.settings.data.map(d => getLabel(d))
    this.settings.data = this.settings.data.filter(d => this.row[d])
    const years = this.settings["years"] || ["2022"]
    const _datasets = YEARS.map(y => {
      return {
        type,
        label: y,
        data: this.settings.data.map(d => this.row[d][y]),
        hidden: !years.includes(y)
      }
    })
    if(toRender) {
      ChartMarkup.toRender.push({
        name: `chart${random}`,
        settings: {
          type: 'bar',
          data: {
            labels: labels,
            datasets: _datasets
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                display: false
              }
            }
          }
        }
      })
      var chart = `<canvas id="chart${random}"></canvas>`
    }
    else { //Igazából nem tudom miért így kell, de így jó
      var chart = `
      <canvas id="chart${random}"></canvas>
      <script>
      new Chart(document.getElementById("chart${random}"), {
          type: 'bar',
data: {
labels: ${JSON.stringify(labels)},
datasets: ${JSON.stringify(_datasets)}
},
options: {
scales: {
y: {
beginAtZero: true,
display: false
}
}
}
      })
      </script>`
    }

    return chart

  }
}

const charts = [
  {
    type: "pie",
    name: "Kördiagram"
  },
  {
    type: "doughnut",
    name: "Fánkdiagram"
  },
  {
    type: "bar",
    name: "Oszlopdiagram"
  },
  {
    type: "bubble",
    name: "Buborékdiagram"
  },
  {
    type: "line",
    name: "Vonaldiagram"
  },
  {
    type: "polarArea",
    name: "Hálódiagram" //Lehet, hogy ez a radar???? 
  },
  {
    type: "radar",
    name: "Radardiagram"
  }
]
charts.forEach(c => {
  Markup.addMarkup(`${c.type}Chart`, ChartMarkup, c.name, false, true, true)
})