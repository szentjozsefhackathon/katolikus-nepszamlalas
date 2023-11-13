import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import  json
import argparse

def SZFVEM(filename=None, year=None):
    url = "https://www.szfvar.katolikus.hu/"
    papok = []
    def papkereso(link):
        response = requests.get(link)
        if response.status_code == 200:
            html_content = response.content
        else:
            print("Failed to fetch the website.")
        soup = BeautifulSoup(html_content, 'html.parser')
        _papok = []
        for pap in soup.select_one(".adattar").select(".listadoboz"):
            _papok.append(pap.select_one("h3 a")["href"])
        
        return _papok
    
    papok += papkereso("https://www.szfvar.katolikus.hu/adattar/papok/?min=0")
    papok += papkereso("https://www.szfvar.katolikus.hu/adattar/papok/?min=50")


    paplista = []
    for pap in tqdm(papok): # Nézze meg az összes pap linkjét
        try: # Kétszeri próbálkozásra szokott menni
            response = requests.get(url+pap)
            if response.status_code == 200:
                html_content = response.content
            else:
                print("Failed to fetch the website.")
        except:
            try:
                response = requests.get(url+pap)
                if response.status_code == 200:
                    html_content = response.content
                else:
                    print("Failed to fetch the website.")
            except:
                print("Big error")
                pass


        soup = BeautifulSoup(html_content, 'html.parser')

        adatlapText = soup.select_one(".adatlap").text
        if "megyés püspök" in adatlapText or "nyugállományban" in adatlapText: continue


        nev = soup.select_one("h1").text
        print(nev)
        szul = 0
        tartalomText = soup.select_one(".tartalom").text.split("\n")
        for sor in tartalomText:
            if nev == "Ébner Vilmos": # Term. nem jó ott sem a sor, mert vmi fura szóköz van
                szul = 1996
                break
            if nev == "Mészáros Péter":
                szul = 1974
                break
            if nev == "Orvos Levente, dr.":
                szul = 1970
                break
            if nev == "Szilágyi Szabolcs":
                szul = 1986
                break
            if nev == "Ugrits Tamás":
                szul = 1961
                break
            if nev == "Szemere János":
                szul = 1977 #https://metropolita.hu/2017/05/interju-egy-papnovendekkel/
            if "Született" in sor:
                szul = int(sor.split(", ")[1].split(".")[0])
        if szul==0:
            raise Exception(nev)
        
        paplista.append({
            "name": nev,
            "birth": szul
        })


    if filename == None: return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Székesfehérvári egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename==None: print(SZFVEM(args.filename))
    else: SZFVEM(args.filename)