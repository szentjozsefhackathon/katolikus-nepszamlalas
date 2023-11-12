import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import  json
import argparse

def SZHEM(filename=None):
    url = "https://www.martinus.hu/nev-es-cimtar/lelkipasztorok?oldal="
    papok = []
    def papkereso(link):
        response = requests.get(link)
        if response.status_code == 200:
            html_content = response.content
        else:
            print("Failed to fetch the website.")
        soup = BeautifulSoup(html_content, 'html.parser')
        _papok = []
        for pap in soup.select_one(".content ul").select("li"):
            _papok.append(pap.select_one("a")["href"])
        
        return _papok
    
    for i in tqdm(range(6,-1,-1)):
        papok += papkereso(f"{url}{i}")




    paplista = []
    for pap in tqdm(papok): # Nézze meg az összes pap linkjét
        try: # Kétszeri próbálkozásra szokott menni
            response = requests.get(f"https://www.martinus.hu{pap}")
            if response.status_code == 200:
                html_content = response.content
            else:
                print("Failed to fetch the website.")
        except:
            try:
                response = requests.get(f"https://www.martinus.hu{pap}")
                if response.status_code == 200:
                    html_content = response.content
                else:
                    print("Failed to fetch the website.")
            except:
                print("Big error")
                pass


        soup = BeautifulSoup(html_content, 'html.parser')
        nev = soup.select_one("#main .content h1").text
        if "+" in nev:
            continue
        if "megyéspüspök" in soup.text:
            continue
        if "nyugállomány" in soup.text:
            continue
        print(nev)

        for sor in soup.select("#main .content p"):
            if "Születési hely, idő:" in sor.text:
                try:
                    paplista.append({
                        "név": nev,
                        "született": int(sor.text.split(".")[0].split(", ")[-1])
                    })
                except: pass
                break

    if filename == None: return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Szombathelyi egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename==None: print(SZHEM(args.filename))
    else: SZHEM(args.filename)