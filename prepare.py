import json, glob, re, sys
import pandas as pd

#
# Load list of Areas aka Dioceses
stringe = open('OSM DataSources/initData.json', 'r',  encoding="utf-8")
#
areas = {}
initData = json.load(stringe)
for data in initData:    
    areas[data['osmid']] = data


def loadDataOSMbySettlements():
    #
    # Collect OSM data
    # by settlements
    print('Settlements in Areas (aka Dioceses)', end=' ', flush=True)
    #
    osms = {}
    geojsons_files = glob.glob('OSM DataSources/relation-*.geojson')
    for geojson_file in geojsons_files:
        print('.', end=' ', flush=True)
        geojson = json.load(open(geojson_file, 'r',  encoding="utf-8"))

        relationRegex = re.compile(r'(relation)-(\d+)\.geojson')
        mo = relationRegex.search(geojson_file)
        id = 'relation-' + mo.group(2)
        osms[id] = { 'settlements' : [], 'ksh_refs' : [] }

        for feature in geojson['features']:
            osms[id]['settlements'].append(feature['properties']['name'])
            osms[id]['ksh_refs'].append(feature['properties']['ksh_ref'])
                    
    for key, area in areas.items():
        if area['osmid'] in osms:
            areas[key]['settlements'] = osms[area['osmid']]['settlements']
            areas[key]['ksh_refs'] = osms[area['osmid']]['ksh_refs']

    print('Done', flush=True)

loadDataOSMbySettlements()

#
# Collect OSM data
#by counties
print('Settlements in Counties', end=' ', flush=True)
#

# Collect population of settlements and counties from KSH data
datas = json.load(open("KSH DataSources/NEME_SEX.json", 'r',  encoding="utf-8")) 
settlementPopulations = {}
for data in datas:
    settlementPopulations[data['TERUL_GEO5']] = data['OBS_VALUE']
    
counties = {}    
json_data = json.load(open("KSH DataSources/byCounty/initData.json", 'r',  encoding="utf-8") )
for data in json_data:
    counties[data['TERUL_GEO3']] = data

settlementCounty = {}
geojsons_files = glob.glob('OSM DataSources/counties/*.geojson')
for geojson_file in geojsons_files:
    print('.', end=' ', flush=True)
    geojson = json.load(open(geojson_file, 'r',  encoding="utf-8"))    
    relationRegex = re.compile(r'([^\\\/]*)\.geojson')
    mo = relationRegex.search(geojson_file)    
    name = mo.group(1)
    
    for key, county in counties.items():
        if county['name'] == name:
            ksh_ref = county['TERUL_GEO3']
            break
    
    counties[ksh_ref]['ksh_refs'] = []
    counties[ksh_ref]['settlements'] = []
    counties[ksh_ref]['population'] = 0
    
    for feature in geojson['features']:
        counties[ksh_ref]['settlements'].append(feature['properties']['name'])
        counties[ksh_ref]['ksh_refs'].append(feature['properties']['ksh_ref'])
        counties[ksh_ref]['population'] += int(settlementPopulations[feature['properties']['ksh_ref']])
        if not feature['properties']['ksh_ref'] in settlementCounty or not name == 'Magyarország':
            settlementCounty[feature['properties']['ksh_ref']] = ksh_ref

# Population of Areas (aka Dioceses)    
for key, area in areas.items():
    areas[key]['inCounties'] = {}
    areas[key]['population'] = 0
    for ksh_ref in area['ksh_refs']:
        if not ksh_ref in settlementCounty:
            break
        if not settlementCounty[ksh_ref] in area['inCounties']:
            areas[key]['inCounties'][settlementCounty[ksh_ref]] = { 'name' : counties[settlementCounty[ksh_ref]]['name'],  'ksh_ref' : counties[settlementCounty[ksh_ref]]['TERUL_GEO3'], 'population' : 0 }
        areas[key]['inCounties'][settlementCounty[ksh_ref]]['population'] += int(settlementPopulations[ksh_ref])
        areas[key]['population'] += int(settlementPopulations[ksh_ref])
    
areasOfCounties = {}    
for key, area in areas.items():  
    for ksh_ref, county in area['inCounties'].items():
        percentage =  county['population'] / counties[ksh_ref]['population'] * 100
        county['percentageOfCounty'] = percentage
        if not ksh_ref in areasOfCounties:
            areasOfCounties[ksh_ref] = {}
        areasOfCounties[ksh_ref][area['osmid']] = percentage
print('Done', flush=True) 

def collectKSHbySettlements():
    #
    # Collect KSH Data by Settlements
    print('Collecting KSH data by Settlements', end=' ', flush=True)
    #
    ksh_files = glob.glob('KSH DataSources/*.json')
    for ksh_file in ksh_files:
        print('.', end=' ', flush=True)
        kshjson = json.load(open(ksh_file, 'r', encoding="utf-8"))
        
        for key, area in areas.items():
            c = 0
            for kshitem in kshjson:
                # check if its valid ksh json
                if not "OBS_VALUE" in kshitem or not "TIME_PERIOD" in kshitem or not "TEL_SZ_ADAT" in kshitem or not "TERUL_GEO5" in kshitem :
                    break
                
                if kshitem["TERUL_GEO5"] in area['ksh_refs']:
                    if not 'data' in areas[key]:
                        areas[key]['data'] = {}
                    if not kshitem["TEL_SZ_ADAT"] in areas[key]['data']:
                        areas[key]['data'][kshitem["TEL_SZ_ADAT"]] = {}     
                    if not kshitem["TIME_PERIOD"] in areas[key]['data'][ kshitem["TEL_SZ_ADAT"] ]:
                        areas[key]['data'][kshitem["TEL_SZ_ADAT"]][kshitem["TIME_PERIOD"]] = 0
                    if kshitem["OBS_VALUE"]:                
                        areas[key]['data'][ kshitem["TEL_SZ_ADAT"] ][ kshitem["TIME_PERIOD"] ] += int(kshitem["OBS_VALUE"])
                
                c+=1
    print('Done', flush=True)


def collectKSHbyCounties():
    #
    # Collect KSH Data by Counties
    print('Collecting KSH data by Counties', end=' ', flush=True)
    #
    ksh_files = glob.glob('KSH DataSources/byCounty/*.json')
    for ksh_file in ksh_files:
        print('.', end=' ', flush=True)
        kshjson = json.load(open(ksh_file, 'r', encoding="utf-8"))

        for kshitem in kshjson:
            # check if its valid ksh json
            if not "OBS_VALUE" in kshitem or not "TIME_PERIOD" in kshitem or not "TARSJELL1" in kshitem or not "TERUL_GEO3" in kshitem or not "VALLAS_V2" in kshitem :
                break
            
            #TODO: fix, miért kell az if!!?? KeyError: 'HU11'
            if kshitem['TERUL_GEO3'] in areasOfCounties:
                for area, perc in areasOfCounties[kshitem['TERUL_GEO3']].items():
                    dataKey = kshitem['VALLAS_V2'] + ":" + kshitem['TARSJELL1']
                    if not 'data' in areas[area]:
                        areas[area]['data'] = {}
                    if not dataKey in areas[area]['data']:
                        areas[area]['data'][dataKey] = {}
                    if not kshitem['TIME_PERIOD'] in areas[area]['data'][dataKey]:
                        areas[area]['data'][dataKey][kshitem['TIME_PERIOD']] = 0                    
                    
                    areas[area]['data'][dataKey][kshitem['TIME_PERIOD']] += int(int(kshitem['OBS_VALUE']) * ( perc / 100 ))

    print('Done', flush=True)
 

# egyszázalélk
# 2011: https://nav.gov.hu/ado/szja1_1/kimutatasok_elszamolasok/egyhazak_kiemelt/kozl_szja11_110607
# 2022: https://nav.gov.hu/ado/szja1_1/kimutatasok_elszamolasok/technikai-szammal-rendelkezok/felajanlasban-reszesultek-2022
# 2001: https://web.archive.org/web/20021210105632/http://www.apeh.hu/kozlemen/egyh1105.htm


def collectMKPK():
    #
    # Collect MKPK Data by Years
    print('Collecting MKPK data by Years', end=' ', flush=True)
    #
    mkpk_files = glob.glob('MKPK DataSources/*.json')
    mkpk = {}
    for mkpk_file in mkpk_files:
        print('.', end=' ', flush=True)
        mkpkjson = json.load(open(mkpk_file, 'r', encoding="utf-8"))

        for key, area in areas.items():
            if not 'data' in areas[key]:
                        areas[key]['data'] = {}
            if area['name'] in mkpkjson:
                for datatype, data in mkpkjson[area['name']].items():
                    if not datatype in areas[key]['data']:
                            areas[key]['data'][datatype] = {}
                    areas[key]['data'][datatype]['2022'] = data

    print('Done', flush=True)


def collectCatholicHierarchy():


    df = pd.read_excel('CatholicHierarchy DataSources/areas.xlsx')
    datatable = df.to_dict('index')
    
    
    data = {}
    for k, row in datatable.items():
        if not row['Name'] in data:
            data[row['Name']] = {}
        for key, value in row.items():
            if not key in ['Name','URL','Year','Source']:  
                    
                dict = {
                    "Catholics" : "R_C",
                    "Total Population": "TOTAL",
                    "Percent Catholic": "R_CPERT",
                    "Diocesan Priests": "PRIEST_D",
                    "Religious Priests": "PRIEST_R",
                    "Total Priests": "PRIEST",
                    "Catholics Per Priest": "R_CPERP",
                    "Permanent Deacons": "DEACON",
                    "Male Religious": "MREL",
                    "Female Religious": "FREL",
                    "Parishes": "PARISH"
                }
                
                key = "CH_" + dict[key]
            
                if not key in data[row['Name']]: 
                    data[row['Name']][key] = {}
                    
                #Mivel nincs minden adatunk, ezért csalunk
                if row['Year'] < 2005: year = 2001
                elif row['Year'] < 2015: year = 2011
                else: year = 2022
                
                #Egy-két mezőt számosítunk
                if type(value) == str: value = float(value.replace(',', '').replace('%', ''))
                if value != value : value = 'sd'
                else:
                    data[row['Name']][key][year] = value
            
    
    for key, area in areas.items():
        if area['name'] in data:
            if not 'data' in area: areas[key]['data'] = {}
            areas[key]['data'].update(data[area['name']])
            
    print('Done', flush=True)    

collectKSHbySettlements()
collectKSHbyCounties()
collectMKPK()
collectCatholicHierarchy()
#
# Calculations
print('Makeing some calculated data', end=' ', flush=True)
#
for key, area in areas.items():

    if not "data" in area:
        break
        
    data = areas[key]['data']
    
    if 'FY_LT15' in data and 'MY_LT15' in data:
        areas[key]['data']['Y_LT15'] = {}
        for year in ['2001', '2011', '2022']:
            tmp = 0
            if year in data['FY_LT15']: tmp += int(data['FY_LT15'][year])
            if year in data['MY_LT15']: tmp += int(data['MY_LT15'][year])
            areas[key]['data']['Y_LT15'][year] = tmp
        print('.', end=' ', flush=True)

    if 'FY15-64' in data and 'MY15-64' in data:
        areas[key]['data']['Y15-64'] = {}
        for year in ['2001', '2011', '2022']:
            tmp = 0
            if year in data['FY15-64']: tmp += int(data['FY15-64'][year])
            if year in data['MY15-64']: tmp += int(data['MY15-64'][year])
            areas[key]['data']['Y15-64'][year] = tmp
        print('.', end=' ', flush=True)
        
    if 'FY_GE65' in data and 'MY_GE65' in data:
        areas[key]['data']['Y_GE65'] = {}
        for year in ['2001', '2011', '2022']:
            tmp = 0
            if year in data['FY_GE65']: tmp += int(data['FY_GE65'][year])
            if year in data['MY_GE65']: tmp += int(data['MY_GE65'][year])
            areas[key]['data']['Y_GE65'][year] = tmp
        print('.', end=' ', flush=True)    
    
    
    areas[key]['data']['RE_C_NOTRG'] = {
        '2001': area['data']['RE_C']['2001'] - area['data']['RE_RC']['2001'] - area['data']['RE_GC']['2001'],
        '2011': area['data']['RE_C']['2011'] - area['data']['RE_RC']['2011'] - area['data']['RE_GC']['2011'],
        '2022': area['data']['RE_C']['2022'] - area['data']['RE_RC']['2022'] - area['data']['RE_GC']['2022'],
    }

    if 'MKPK_PRIEST_D' in data and 'MKPK_PRIEST_R' in data:
        areas[key]['data']['MKPK_PRIEST'] = {}
        for year in ['2001', '2011', '2022']:
            tmp = 0
            if year in data['MKPK_PRIEST_D']: tmp += int(data['MKPK_PRIEST_D'][year])
            if year in data['MKPK_PRIEST_R']: tmp += int(data['MKPK_PRIEST_R'][year])
            areas[key]['data']['MKPK_PRIEST'][year] = tmp
        print('.', end=' ', flush=True)


    
    print('.', end=' ', flush=True)    
    
print('Done', flush=True)


#
# Clean JSON data file
print('Cleaning JSON fullData ...', end=' ', flush=True)
for key, area in areas.items():
    area.pop("ksh_refs")
print('Done', flush=True)

#
# Dump JSON data to file
print('Dumping JSON data to file ...', end=' ', flush=True)
#
with open("fullData.json", "w") as write_file:
    json.dump(areas, write_file, indent=4)
print('Done', flush=True)
