class SimpleDataMarkup extends Markup {
    calculate() {
        if(!this.data)  return
        if (this.settings['inProprotionTo'] && this.row[this.settings['inProprotionTo']]) {
            this.proptional = {};
            YEARS.forEach(year => {
                this.proptional[year] = this.data[year] / this.row[this.settings['inProprotionTo']][year] * 100;
            });
            this.diff = {
                "20012022": this.proptional[2022] - this.proptional[2001],
                "20012011": this.proptional[2011] - this.proptional[2001],
                "20112022": this.proptional[2022] - this.proptional[2011]
            };
        } else if (!this.settings['inProprotionTo']) {
            this.diff = {
                "20012022": (this.data[2022] - this.data[2001]) / this.data[2001] * 100,
                "20012011": (this.data[2011] - this.data[2001]) / this.data[2001] * 100,
                "20112022": (this.data[2022] - this.data[2011]) / this.data[2011] * 100
            }
        } 
        this.calculated = true
        return
    }
    sortTable() {
        if (!this.calculated) this.calculate()
        if (this.type == "sort" || this.type == 'type') {
            switch (document.getElementById(this.orderSelect).value) {
                case "2022data":
                    return this.proptional? this.proptional["2022"] : this.data["2022"]

                case "2011data":
                    return this.proptional? this.proptional["2011"] : this.data["2011"]

                case "2001data":
                    return this.proptional? this.proptional["2001"] : this.data["2001"]

                case "diff20012011":
                    return this.diff["20012011"]

                case "diff20112022":
                    return this.diff["20112022"]

                case "diff20012022":
                    return this.diff["20012022"]

            }
        } else return null
    }
    render() {
        if (!this.data) return '<i>Hiányzó adat.</i>'; // '<span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';
        this.calculate()
        if(this.sortTable()) return this.sortTable()
        

        if (this.settings['inProprotionTo']) {
            if (!this.row[this.settings['inProprotionTo']]) {
                return '<i>Hiányzó adat.</i>'; // '<span class="alert alert-danger">' + this.settings['inProprotionTo'] + ' is missing!</span>';
            }

            var markup =
                `<span ${isNaN(this.proptional[2022])?'style="display: none" ':''}class="badge text-bg-primary even-larger-badge" title="${this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })} (2022-es adat)">
                    ${this.proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span><br/>
                <span ${isNaN(this.proptional[2001])?'style="display: none" ':''} class="badge text-bg-secondary" title="${this.data[2001] ? this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"} (2001-es adat)">
                    ${this.proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%</span>&nbsp;
                <span ${isNaN(this.proptional[2011])?'style="display: none" ':''}class="badge text-bg-secondary" title="${this.data[2011] ? this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) : "undefined"} (2011-es adat)">
                    ${this.proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 })}%
                </span>&nbsp;`

        } else {
            var markup = `<span ${isNaN(this.data[2022])?'style="display: none" ':''}class="badge text-bg-primary even-larger-badge" title="2022-es adat">
                    ${this.data[2022]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span><br/>		
                <span ${isNaN(this.data[2001])?'style="display: none" ':''}class="badge text-bg-secondary" title="2001-es adat">
                    ${this.data[2001]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}</span>&nbsp;
                <span ${isNaN(this.data[2011])?'style="display: none" ':''}class="badge text-bg-secondary" title="2011-es adat">
                    ${this.data[2011]?.toLocaleString('hu-HU', { maximumFractionDigits: 2 })}
                </span>&nbsp;`
        }
        return markup
    }
}

Markup.addMarkup("simpleData", SimpleDataMarkup)