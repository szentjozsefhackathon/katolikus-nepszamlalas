
import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import  json
import argparse

def PEM(filename=None, year=None):
    # Replace this with the URL of the website you want to scrape
    url = 'https://pecsiegyhazmegye.hu/egyhazmegye/papsag/papjaink'
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 200:
        html_content = response.content
    else:
        print("Failed to fetch the website.")

    # Parse the HTML content with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    papok = []
    firstLine = True # Az első sor csak fejléc
    for sor in soup.select_one(".item-page table").tbody.findAll("tr"): # Táblázat sorainak keresése
        if firstLine:
            firstLine = False
            continue
        if "nyugállományban" in sor.text or "megyéspüspök" in sor.text: # Nyugállományban lévő papokat és a püspököket nem számítjul
            continue
        papok.append(sor.findAll('td')[0].select_one('a')['href']) # Papi oldalak linkjei

    paplista = []
    for pap in tqdm(papok): # Nézze meg az összes pap linkjét
        try: # Kétszeri próbálkozásra szokott menni
            response = requests.get(pap)
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
        for sor in soup.select_one(".kpriest-content-right table").findAll("tr"): # Papi táblázat
            if(sor.select_one("th").text == "Született"): #A született fejléc számít
                paplista.append({
                    "name": soup.select_one(".page-header h2").text, # A pap neve
                    "birth": int(sor.select_one("td").text.strip().split(", ")[1].split(".")[0]) # A vesszővel levágjuk a helyet, a .-tal meg az évet
                })
    if filename == None: return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Pécsi egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename==None: print(PEM(args.filename))
    else: PEM(args.filename)