function markupSimpleData (data, type, row) {
								

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
								var markup =
									`<span class="badge text-bg-primary even-larger-badge" title="2022-es KSH adat">
	${data[2022].toLocaleString('hu-HU')}
</span>
<br/>
<span class="badge text-bg-secondary" title="2001-es KSH adat">
	${data[2001].toLocaleString('hu-HU')}
</span>&nbsp;
<span class="badge text-bg-secondary" title="2011-es KSH adat">
	${data[2011].toLocaleString('hu-HU')}
</span>&nbsp;
`
								return markup
							}