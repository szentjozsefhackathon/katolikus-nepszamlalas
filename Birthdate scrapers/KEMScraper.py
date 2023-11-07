import requests
from bs4 import BeautifulSoup
import re
from tqdm import tqdm
import json
import argparse


def KEM(filename=None):
    url = 'https://kaposvar.egyhazmegye.hu/index.php/papok/aktiv-papok'
    response = requests.get(url)
    if response.status_code == 200:
        html_content = response.content
    else:
        print("Failed to fetch the website.")

    soup = BeautifulSoup(html_content, 'html.parser')

    paplista = []
    for pap in soup.select(".qx-element-person"):
        paplista.append({
            "név": pap.select_one("h4").text,
            "született": int(pap.select_one(".qx-person-description p").text.split("Szent.:")[0].split(", ")[1].split(".")[0])
        })



    if filename == None:
        return paplista
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(paplista))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Kaposvári egyházmegye papjainak születési éve')
    parser.add_argument('--filename', required=False, action="store", default=None,
                        help="JSON to save. If not set, the result will be displayed on screen")

    args = parser.parse_args()

    if args.filename == None:
        print(KEM(args.filename))
    else:
        KEM(args.filename)
