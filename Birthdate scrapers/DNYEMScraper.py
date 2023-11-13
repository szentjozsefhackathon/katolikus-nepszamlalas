
import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import json
import argparse


def DNYEM(filename=None, year=None):
    url = 'https://www.dnyem.hu/papjaink/'
    response = requests.get(url)
    if response.status_code == 200:
        html_content = response.content
    else:
        print("Failed to fetch the website.")

    soup = BeautifulSoup(html_content, 'html.parser')

    papok = []
    # A nem nyugalmazott és nem püspök papok
    for pap in soup.select_one(".ticss-fcfbf173").findAll("h6"):
        papok.append(pap.select_one('a')['href'])  # Papi oldalak linkjei

    firstLine = 0
    paplista = []
    for pap in tqdm(papok):  # Nézze meg az összes pap linkjét
        try:  # Kétszeri próbálkozásra szokott menni
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
        firstLine = True
        for sor in soup.select_one("#main table").findAll("tr"):
            if firstLine and soup.select_one("#main article h1").text!="Mészáros Zsolt":
                firstLine = False
                continue
            if soup.select_one("#main article h1").text == "Molnár József":
                paplista.append({
                    "name": soup.select_one("#main article h1").text,
                    "birth": 1968
                })
                continue
            if soup.select_one("#main article h1").text == "Sári András":
                paplista.append({
                    "name": soup.select_one("#main article h1").text,
                    "birth": 1971
                })
                continue
            print(soup.select_one("#main article h1").text)
            try:
                sor.select_one("br").replace_with("\n")
            except: pass
            if len(sor.text.split("\n")[0].split(", ")) < 2:
                break # Ft. Czele József atyára tekintettel
            paplista.append({
                "name": soup.select_one("#main article h1").text,
                "birth": int(sor.text.split("\n")[0].split(", ")[1].split(".")[0])
            })
            break


    if filename == None:
        return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Debrecen-Nyíregyházi egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None,
                        help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename == None:
        print(DNYEM(args.filename))
    else:
        DNYEM(args.filename)
