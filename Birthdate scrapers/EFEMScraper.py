import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import  json
import argparse

def EFEM(filename=None):
    url = "https://eger.egyhazmegye.hu/hitelet/papsag?page="
    paplista = []
    def papkereso(link):
        response = requests.get(link)
        if response.status_code == 200:
            html_content = response.content
        else:
            print("Failed to fetch the website.")
        soup = BeautifulSoup(html_content, 'html.parser')
        _papok = []
        for _pap in soup.select(".container > .row .article"):
            pap = _pap.select_one(".row")
            if not pap:
                continue

            if "Ternyák Csaba" in pap.select_one("h2").text:
                continue

            if "Katona István" in pap.select_one("h2").text:
                continue

            if "nyugállományban" in pap.text:
                continue
            print(pap.select_one("h2").text)
            _papok.append({
                "név": pap.select_one("h2").text,
                "született": int(pap.select_one(".col-sm-8 div").text.split(": ")[1].split(".")[0])
            })
        return _papok
    
    for i in tqdm(range(1,13,1)):
        paplista += papkereso(f"{url}{i}")





    if filename == None: return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Egri főegyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename==None: print(EFEM(args.filename))
    else: EFEM(args.filename)