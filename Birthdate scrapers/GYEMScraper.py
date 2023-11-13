
import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import json
import argparse

def GYEM(filename=None, year=None):

    url = 'https://gyor.egyhazmegye.hu/api/priest?limit=116&offset=0'
    response = requests.get(url)
    if response.status_code == 200:
        json_content = json.loads(response.content)
    else:
        print("Failed to fetch the website.")
    
    url = f'https://gyor.egyhazmegye.hu/api/priest?limit={json_content["totalElements"]}&offset=0' #Ezzel lesz időtálló
    response = requests.get(url)
    if response.status_code == 200:
        json_content = json.loads(response.content)
    else:
        print("Failed to fetch the website.")
    paplista = []


    for pap in tqdm(json_content["items"]):
        if pap["type"] == "NYUGDIJAS":
            continue

        if pap["name"] == "Dr. Veres András":
            continue
        print(pap["name"])
        soup = BeautifulSoup(pap["text"], 'html.parser')
        for sor in soup.select("p"):
            if "Született" in sor.text:
                try:
                    paplista.append({
                        "name": pap["name"],
                        "birth": int(sor.text.split(", ")[1].split(".")[0])
                    })
                except:
                    try:
                        paplista.append({
                            "name": pap["name"],
                            "birth": int(sor.text.split(", ")[2].split(".")[0])
                        })
                    except: pass


    if filename == None:
        return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Győri egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None,
                        help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename == None:
        print(GYEM(args.filename))
    else:
        GYEM(args.filename)
