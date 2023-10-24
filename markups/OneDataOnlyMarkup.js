class OneDataOnlyMarkup extends SimpleDataMarkup {

    render() {
		
        if (!this.data) return '<i>Hiányzó adat.</i>'; // <span class="alert alert-danger">' + this.settings['data'] + ' is missing!</span>';
        this.calculate()
        if (this.sortTable()) return this.sortTable()

		const OriginalType = this.type
		this.type = "sort"
		
		const value = this.sortTable()

		if(OriginalType=="sort" || OriginalType == "type") return value
        if (this.settings['inProprotionTo']) {
            if (!this.row[this.settings['inProprotionTo']]) {
                return '<i>Hiányzó adat.</i>'; // '<span class="alert alert-danger">' + this.settings['inProprotionTo'] + ' is missing!</span>';
            }			
			
			if(!document.getElementById(this.orderSelect).value) return this.proptional[2022] + "%";
			
			switch(document.getElementById(this.orderSelect).value) {
			  case "2022data":
				return this.proptional[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
			  case "2011data":
				return this.proptional[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
			  case "2001data":
				return this.proptional[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
			  case "diff20012011":
				return this.diff[20012011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
			  case "diff20012022":
				return this.diff[20012022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
			  case "diff20112022":
				return this.diff[20112022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + " százalékpont";
				
			  default:
				return false;

			}

        } else {
			switch(document.getElementById(this.orderSelect).value) {
				case "2022data":
				  return this.data[2022].toLocaleString('hu-HU', { maximumFractionDigits: 2 });
				case "2011data":
				  return this.data[2011].toLocaleString('hu-HU', { maximumFractionDigits: 2 });
				case "2001data":
				  return this.data[2001].toLocaleString('hu-HU', { maximumFractionDigits: 2 });
				case "diff20012011":
				  return this.diff[20012011].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				case "diff20012022":
				  return this.diff[20012022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				case "diff20112022":
				  return this.diff[20112022].toLocaleString('hu-HU', { maximumFractionDigits: 2 }) + "%";
				  
				default:
				  return false;
  
			  }
		   
        }



    }
}

Markup.addMarkup("oneDataOnly", OneDataOnlyMarkup, "Sorbarendezés szerinti adat", true, false, false)