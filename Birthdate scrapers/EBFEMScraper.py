
import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import json
import argparse
from selenium import webdriver
import time

def EBFEM(filename=None, year=None):

    url = 'https://www.esztergomi-ersekseg.hu/papsag'
    driver = webdriver.Firefox()

    driver.get(url)


    driver.implicitly_wait(2)


    driver.execute_script("(async function() {while (isDataAvailable) {listmore(); await new Promise(r => setTimeout(r, 3000))}})()")

    for i in tqdm(range(15)):
        time.sleep(1)

    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()
    papok = []

    for pap in soup.select_one("#listazas").select(".hirbox"):
        papok.append(pap.select_one('a')['href'])  # Papi oldalak linkjei
    
    firstLine = 0
    paplista = []
    hibasak = []

    for pap in tqdm(papok):  # Nézze meg az összes pap linkjét
        try:  # Kétszeri próbálkozásra szokott menni
            response = requests.get(f"{url}/{pap.split('/')[1]}")
            if response.status_code == 200:
                html_content = response.content
            else:
                print("Failed to fetch the website.")
        except:
            try:
                response = requests.get(f"{url}/{pap.split('/')[1]}")
                if response.status_code == 200:
                    html_content = response.content
                else:
                    print("Failed to fetch the website.")
            except:
                print("Big error")
                pass

        soup = BeautifulSoup(html_content, 'html.parser')
        nev = soup.select_one("h1").text.strip()
        print(nev)
        if soup.select_one(".titulus") and "érsek" in soup.select_one(".titulus").text:
            continue
        szent = 0
        for fieldset in soup.select("fieldset"):
            if "Szentelés" in fieldset.text:
                try:
                    szent = int(fieldset.text.split(", ")[1].split(".")[0])
                except:
                    pass
            if not "Életrajz" in fieldset.text:
                continue
            if "Nyugállományban" in fieldset.text:
                continue
            szul = 0
            try:
                szul = int(fieldset.text.split(", ")[1].split(".")[0])
            except:
                try:
                    szul =  int(fieldset.text.split(", ")[0].split(".")[0].split(" ")[1])
                except:
                    try:
                        szul = int(fieldset.text.split(", ")[0].split(".")[0].split(" ")[2])
                    except:
                        try:
                            szul = int(fieldset.text.split("-")[0].split(" ")[1])
                        except:
                            try:
                                szul = int(fieldset.text.split(".")[0].split(" ")[-1])
                            except:
                                pass
                                
            
            if nev == "Fábry Kornél dr.": #https://hu.wikipedia.org/wiki/F%C3%A1bry_Korn%C3%A9l
                szul = 1972
            
            if nev == "Riesz Domonkos": #http://esztergomiszeminarium.eu/riesz-domonkos/
                szul = 1994
            
            if nev == "Faragó András": #http://esztergomiszeminarium.eu/i-evfolyam/farago-andras/
                szul = 1993

            if nev == "Fehér Zoltán": #https://albertfalviplebania.hu/index.php/cikkek/interju-feher-zoltan-atyaval
                szul = 1995
            
            if nev == "Forgács Balázs": # http://esztergomiszeminarium.eu/forgacs-balazs/
                szul = 1988
            
            if nev == "Gyurász Krisztián": #https://bosihirado.net/index.php/papjaink
                szul = 1989
            
            if nev == "Kiss Géza Imre":
                szul = 1988
            
            if nev == "Lendvai Z. Zalán OFM": #https://orszagutiferencesek.hu/plebania/kepviselotestulet/
                szul = 1964
            
            if nev == "Lőw Gergely": #https://pmi.katolikus.hu/?page_id=1904
                szul = 1993
            
            if nev == "Máté János Kristóf": #http://esztergomiszeminarium.eu/mate-janos-kristof/
                szul = 1993

            if nev == "Varga Kamill OFM": #http://jaszhelytortenet.hu/e-6-15-varga-jozsef-fr-kamill-ofm.html
                szul = 1974

            if szul == 0:
                hibasak.append({"név": nev, "hiba": "Születés nem található"})
                break


            if szul<szent:
                paplista.append({
                                "name": nev,
                                "birth": szul
                            })
            else:
                hibasak.append({"név": nev, "hiba": "Szentelése előbbi, mint születése"})
            break

    print(hibasak)
    print("Hibás:", len(hibasak))
    print("Talán jó:", len(paplista))

    if filename == None:
        return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Esztergom-Budapesti főegyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None,
                        help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename == None:
        print(EBFEM(args.filename))
    else:
        EBFEM(args.filename)
