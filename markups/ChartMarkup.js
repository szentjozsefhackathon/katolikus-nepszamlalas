class ChartMarkup extends Markup {
    render() {
        const type = this.settings["markup"].slice(0, -5)
        const random = Math.random()

        if (this.type == "sort" || this.type == 'type') return 0
        const labels = JSON.stringify(this.settings.data.map(d => getLabel(d)))
        const years = this.settings["years"] || YEARS
        const _datasets = JSON.stringify(YEARS.map(y => {
            return {
                type,
                label: y,
                data: this.settings.data.map(d => this.row[d][y]),
                hidden: !years.includes(y)
            }
        }))
        var chart = `<canvas id="chart${random}"></canvas>
                <script>
                new Chart(document.getElementById("chart${random}"), {
                    type: 'bar',
    data: {
      labels: ${labels},
      datasets: ${_datasets}
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
        return chart

    }
}

["pie", "doughnut", "bar", "bubble", "line", "polarArea", "radar"].forEach(t => {
    Markup.addMarkup(`${t}Chart`, ChartMarkup)
})