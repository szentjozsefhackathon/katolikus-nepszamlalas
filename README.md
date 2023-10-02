# Népszámlálás adatai katolikus szemmel

https://borazslo.github.io/katolikus-nepszamlalas/

Cél a népszámlálása adatait egyházmegyei szintre lebontani és megjeleníteni.

A népszámlálási adatok a Magyar Katolikus Egyházról és összetételéről is sokat mesél. Ám míg az adatok alapvetően vármegye szinten és települési szinten érhetőek el legkönnyebben, addig a katolikus egyháznak az a leghasznosabb, ha egyházmegyei szinten is elérhetőek és elemezhetőek az adatok. Ehhez kívánunk segítséget nyújtani ezzel az egyszerű felelülettel. Talán az adatokat nézegetve észrevehetünk leheséges összefüggéseket, ami segíthet a reflexióban.

Milyen adatokat lehet megnézni és összehasonlítani egyházmegye szinten? Első fordulóban: katolikusok, római katolikusok, görögkatolikusok száma és lakossághoz viszonyított aránya, lakosság száma, átlagéletkora. De további szempontokat is szívesen behozunk, ha valaki kéri. 

Lépések
1) OSM alapján megtudjuk, hogy melyik egyházmegyéhez mely KSH település adatok tartoznak. Egyházmegyénként JSON fájl a mappába. Lásd OSM DataSources mappa.
2) KSH-ből település szintű adatokat lekérdezünk. Mivel véges számú mező lehet, ezért több lekérés is. Ezeket JSON-ban gyűjtjük a mappába. Lásd KSH DataSources mappa
3) A két adatcsomagot összekötjük és közös nevezőre hozzuk.
4) Származtatot adatokat gyártunk, ha érdekes.
5) És megjelenítjük

Lehet segíteni. Mert, én nem értek hozzá.
