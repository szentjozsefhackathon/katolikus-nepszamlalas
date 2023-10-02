#KSH adatok

A KSH népszámlálási adatait a [nepszamlalas2022.ksh.hu](https://nepszamlalas2022.ksh.hu/) oldalról lehet lekérdezni. 

Az eredményeket a `Letöltés` gombra kattintva JSON formáumban tudjuk lementeni. Ebben az esetben a kész JSON fájlban minden cella (sortól és oszloptól függetlenül) külön JSON elem ilyen adatokkal [például](https://nepszamlalas2022.ksh.hu/adatbazis/#/table/WBS003/N4IgFgpghgJiBcBtEAVAkgWQKIH0AKWASmgPIAiIANKlgDI4DKAWjgIJmsogC61AzgEsYEBMhREAqvQDiWEgFYe_CAGMALgID2AO1G8QAMwEAbNRABOfBKADWA7XHggMUAA5UQEbWvMCIVpDFMXAJicipbe0cQBgg1DwA3KGMAV39REAAmAAZMzI8cgEZCguzsku4AX14xOkYWdk4IkDsHBBi4xOS0gORCXEIAYR5qqsqgA=):
```
	{
		"OBS_STATUS": null, // ??
		"OBS_VALUE": "14", // Az adtott érték
		"TIME_PERIOD": "2022", // Népszámlálás éve 
		"TEL_SZ_ADAT": "RE_RC", // Katolikuson belül római katolikus
		"TERUL_GEO5": "20844" // Az OSM adatbázisban ksh_ref
	}
```

Fontos, hogy a `Sorokban (oldalrovatban) megjelenő dimenziók` részbe be legyen húzva a teljes `Település, járás, vármegye, régió` rész.

