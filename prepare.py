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
print('Collecting OSM data', end=' ', flush=True)
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
# Dump JSON data to file
print('Dumping JSON data to file ...', end=' ', flush=True)
#
with open("allPreparedData.json", "w") as write_file:
    json.dump(areas, write_file, indent=4)
print('Done', flush=True)
