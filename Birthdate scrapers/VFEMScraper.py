import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import  json
import argparse

def VFEM(filename=None):
    # Replace this with the URL of the website you want to scrape
    url = 'https://www.veszpremiersekseg.hu/kereso/'
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 200:
        html_content = response.content
    else:
        print("Failed to fetch the website.")

    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    papok = []
    for pap in soup.select_one(".priests-list").findAll("li"): 
        if "Érsek" in pap.text or "Nyugalomban" in pap.text: # Nyugállományban lévő papokat és a püspököket nem számítjul
            continue
        papok.append(pap.select_one('a')['href']) # Papi oldalak linkjei


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
                response = requests.get(pap)
                if response.status_code == 200:
                    html_content = response.content
                else:
                    print("Failed to fetch the website.")
            except:
                print("Big error")
                pass


        soup = BeautifulSoup(html_content, 'html.parser')
        nev = soup.select_one(".priest-details").select_one("h2").text.replace("  ", " ")
        if nev == "Bedy Imre": paplista.append({"név": "Bedy Imre", "született": 1982}) #Nem jó weboldal, vessző hiányzik
        elif nev == "Dékány Árpád Sixtus O. Cist": paplista.append({"név": "Dékány Árpád Sixtus O. Cist", "született": 1969}) #Forrás: https://hu.wikipedia.org/wiki/D%C3%A9k%C3%A1ny_Sixtus
        elif nev == "Holubák Attila": paplista.append({"név": "Holubák Attila", "született": 1970}) #Nem jó weboldal, vessző hiányzik
        elif nev == "Kulcsár Dávid dr.": paplista.append({"név": "Kulcsár Dávid dr.", "született": 1990}) #Nem jó weboldal, vessző hiányzik
        else: paplista.append({"név": nev, "született": int(soup.select_one(".pap-profil").text.split("Született")[1].split(", ")[1].split(".")[0])})



    if filename == None: return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Veszprémi főegyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename==None: print(VFEM(args.filename))
    else: VFEM(args.filename)