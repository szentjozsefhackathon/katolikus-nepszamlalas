function markupData (data, type, row) {
								var diff = (data[2022] - data[2001]) / data[2001] * 100;
								var diff1 = (data[2011] - data[2001]) / data[2001] * 100;
								var diff2 = (data[2022] - data[2011]) / data[2011] * 100;

								if (type == "sort" || type == 'type') {
									switch (document.getElementById("selectOrder1").value) {
										case "2022data":
											return data["2022"]

										case "2011data":
											return data["2011"]

										case "2001data":
											return data["2001"]

										case "diff20012011":
											return diff1

										case "diff20112022":
											return diff2

										case "diff20012022":
											return diff

									}
								}
								if (diff > 5) var color = "success"
								else if (diff < -5) var color = "danger"
								else var color = "info"
								var markup =
									`<span class="badge text-bg-primary even-larger-badge" title="2022-es KSH adat">
	${data[2022].toLocaleString('hu-HU')}
</span>
<span class="badge text-bg-${color} even-larger-badge" title="Különbség a 2022-es és a 2001-es KSH adat között.">
	${diff.toFixed(2)}%
</span><br/>
<span class="badge text-bg-secondary" title="2001-es KSH adat">
	${data[2001].toLocaleString('hu-HU')}
</span>&nbsp;
<span class="badge text-bg-secondary" title="2011-es KSH adat">
	${data[2011].toLocaleString('hu-HU')}
</span>&nbsp;
<span class="badge text-bg-light" title="Változás 2001 és 2011 között.">
	${diff1.toFixed(2)}%
</span>
<span class="badge text-bg-light" title="Változás 2011 és 2022 között.">
	${diff2.toFixed(2)}%
</span>
`
								return markup
							}