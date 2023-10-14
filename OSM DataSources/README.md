#OSM Adatok

A [Hungary/Katolikus Templomok](https://wiki.openstreetmap.org/wiki/Hungary/Katolikus_Templomok) projekt keretében valamennyi magyar katolikus egyházmegye felkerült az OSM térképre: [Aktuális katolikus területi felosztás](https://wiki.openstreetmap.org/wiki/Hungary/Katolikus_Templomok#Aktu.C3.A1lis_katolikus_ter.C3.BCleti_feloszt.C3.A1s)

Az egyes Egyházmegyék településeinek lekérdezése a legegyszerűbb az OSM-ben már meglévő `ksh_ref` kulcsokra szűrés az overpass-turbo.eu segítségével. 

Például: 

https://overpass-turbo.eu/s/1Bhd
```
[out:json][timeout:25];
area[name = "Egri főegyházmegye"];

// gather results
(
  // query part for: “ksh_ref=18209”
  node["ksh_ref"](area);
  way["ksh_ref"](area);
  relation["ksh_ref"](area);
);
// print results
out body;
>;
out skel qt;
```

Ezt egyelőre külön-külön meg kell csinálni valamennyi egyházmegyére.


Egyházmegye határokat az alábbi lekérdezéssel értük el:
```
[out:json][timeout:25];
area[name="Magyarország"]->.boundaryarea;

// gather results
(
nwr(area.boundaryarea)["admin_level"=6]["denomination"="roman_catholic"][name!="Pannonhalmi Területi Főapátság"];
  - node(r:"admin_centre");
);
// print results
out;
(
  way(r);
  node(w);
);

out skel qt;
```
