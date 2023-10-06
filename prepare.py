import json, glob, re, sys

#
# Load list of Areas aka Dioceses
stringe = open('OSM DataSources/initData.json', 'r',  encoding="utf-8")
#
areas = json.load(stringe)
#for area in areas:    
#     print(area['name'])



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
                
i = 0;
for area in areas:
    if area['osmid'] in osms:
        areas[i]['settlements'] = osms[area['osmid']]['settlements']
        areas[i]['ksh_refs'] = osms[area['osmid']]['ksh_refs']
    i+=1
print('Done', flush=True)

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
    relationRegex = re.compile(r'(\\(.*))\.geojson')
    mo = relationRegex.search(geojson_file)
    name = mo.group(2)
    
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
i = 0;
for area in areas:
    areas[i]['inCounties'] = {}
    areas[i]['population'] = 0
    for ksh_ref in area['ksh_refs']:
        if not settlementCounty[ksh_ref] in area['inCounties']:
            areas[i]['inCounties'][settlementCounty[ksh_ref]] = { 'name' : counties[settlementCounty[ksh_ref]]['name'],  'ksh_ref' : counties[settlementCounty[ksh_ref]]['TERUL_GEO3'], 'population' : 0 }
        areas[i]['inCounties'][settlementCounty[ksh_ref]]['population'] += int(settlementPopulations[ksh_ref])
        areas[i]['population'] += int(settlementPopulations[ksh_ref])
    i+=1
    
    
for area in areas:  
    for ksh_ref, county in area['inCounties'].items():
        county['percentageOfCounty'] = county['population'] / counties[ksh_ref]['population'] * 100
print('Done', flush=True) 

#
# Collect KSH Data by Settlements
print('Collecting KSH data by Settlements', end=' ', flush=True)
#
ksh_files = glob.glob('KSH DataSources/*.json')
for ksh_file in ksh_files:
    print('.', end=' ', flush=True)
    kshjson = json.load(open(ksh_file, 'r', encoding="utf-8"))
    
    i = 0
    for area in areas:
        c = 0
        for kshitem in kshjson:
            # check if its valid ksh json
            if not "OBS_VALUE" in kshitem or not "TIME_PERIOD" in kshitem or not "TEL_SZ_ADAT" in kshitem or not "TERUL_GEO5" in kshitem :
                break
            
            if kshitem["TERUL_GEO5"] in area['ksh_refs']:
                if not 'data' in areas[i]:
                    areas[i]['data'] = {}
                if not kshitem["TEL_SZ_ADAT"] in areas[i]['data']:
                    areas[i]['data'][kshitem["TEL_SZ_ADAT"]] = {}     
                if not kshitem["TIME_PERIOD"] in areas[i]['data'][ kshitem["TEL_SZ_ADAT"] ]:
                    areas[i]['data'][kshitem["TEL_SZ_ADAT"]][kshitem["TIME_PERIOD"]] = 0
                if kshitem["OBS_VALUE"]:                
                    areas[i]['data'][ kshitem["TEL_SZ_ADAT"] ][ kshitem["TIME_PERIOD"] ] += int(kshitem["OBS_VALUE"])
            
            c+=1
        i+=1
print('Done', flush=True)

#
# Calculations
print('Makeing some calculated data', end=' ', flush=True)
#
i = 0
for area in areas:
    if not "data" in area:
        break
    
    areas[i]['data']['Y_LT15'] = {
        '2001': area['data']['FY_LT15']['2001'] + area['data']['FY_LT15']['2001'],
        '2011': area['data']['FY_LT15']['2011'] + area['data']['FY_LT15']['2011'],
        '2022': area['data']['FY_LT15']['2022'] + area['data']['FY_LT15']['2022']
    }    
    print('.', end=' ', flush=True)
    
    areas[i]['data']['Y15-64'] = {
        '2001': area['data']['FY15-64']['2001'] + area['data']['FY15-64']['2001'],
        '2011': area['data']['FY15-64']['2011'] + area['data']['FY15-64']['2011'],
        '2022': area['data']['FY15-64']['2022'] + area['data']['FY15-64']['2022']
    }
    print('.', end=' ', flush=True)
    
    areas[i]['data']['Y_GE65'] = {
        '2001': area['data']['FY_GE65']['2001'] + area['data']['FY_GE65']['2001'],
        '2011': area['data']['FY_GE65']['2011'] + area['data']['FY_GE65']['2011'],
        '2022': area['data']['FY_GE65']['2022'] + area['data']['FY_GE65']['2022']
    }
    print('.', end=' ', flush=True)

    areas[i]['data']['RE_C_NOTRG'] = {
        '2001': area['data']['RE_C']['2001'] - area['data']['RE_RC']['2001'] - area['data']['RE_GC']['2001'],
        '2011': area['data']['RE_C']['2011'] - area['data']['RE_RC']['2011'] - area['data']['RE_GC']['2011'],
        '2022': area['data']['RE_C']['2022'] - area['data']['RE_RC']['2022'] - area['data']['RE_GC']['2022'],
    }
    print('.', end=' ', flush=True)    
    
    i+=1
print('Done', flush=True)

#
# Clean JSON data file
print('Cleaning JSON fullData ...', end=' ', flush=True)
for area in areas:
    area.pop("ksh_refs")
print('Done', flush=True)

#
# Dump JSON data to file
print('Dumping JSON data to file ...', end=' ', flush=True)
#
with open("fullData.json", "w") as write_file:
    json.dump(areas, write_file, indent=4)
print('Done', flush=True)
