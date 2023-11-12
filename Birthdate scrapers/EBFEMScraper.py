
import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import json
import argparse
from selenium import webdriver
import time

def EBFEM(filename=None):

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
        nev = soup.select_one("h1").text
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
                                hibasak.append({"név": nev, "hiba": "Születés nem található"})
                                break
            if szul<szent:
                paplista.append({
                                "név": nev,
                                "született": szul
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
