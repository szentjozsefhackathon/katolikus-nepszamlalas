class OneDataOnlyMarkup extends SimpleDataMarkup {
s
    render() {
		
        if (!this.data) return '<i>Hiányzó adat.</i>'; // <span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';
        this.calculate()
        if (this.sortTable()) return this.sortTable()



        if (this.settings['inProprotionTo']) {
            if (!this.row[this.settings['inProprotionTo']]) {
                return '<i>Hiányzó adat.</i>'; // '<span class="alert alert-danger">' + this.settings['inProprotionTo'] + ' is missing!</span>';
            }			
			
			if(!this.settings['which']) return this.proptional[2022] + "%";
			
			switch(this.settings['which']) {
			  case "2022data":
				return this.proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				break;
			  case "2011data":
				return this.proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				break;
			  case "2001data":
				return this.proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				break;
			  case "diff20012011":
				return this.diff[20012011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
				break;
			  case "diff20012022":
				return this.diff[20012022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
				break;
			  case "diff20112022":
				return this.diff[20112022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
				break;				
				
			  default:
				return false;

			}
			
			

        } else {
			return this.data[2022];           
        }

    }
}

Markup.addMarkup("oneDataOnly", OneDataOnlyMarkup)