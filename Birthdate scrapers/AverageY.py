from DNYEMScraper import DNYEM
from EBFEMScraper import EBFEM
from EFEMScraper import EFEM
from GYEMScraper import GYEM
from KEMScraper import KEM
from PEMScraper import PEM
from SZFVEMScraper import SZFVEM
from SZHEMScraper import SZHEM
from VFEMScraper import VFEM

import json
import argparse

def averageY(year, filename=None):
    _dioceses = {
        "Esztergom-Budapesti főegyházmegye": EBFEM(year=year),
        "Győri egyházmegye": GYEM(year=year),
        "Székesfehérvári egyházmegye": SZFVEM(year=year),
        # "Kalocsa-Kecskeméti főegyházmegye": ,
        "Pécsi egyházmegye": PEM(year=year),
        #"Szeged-Csanádi egyházmegye": ,
        "Egri főegyházmegye": EFEM(year=year),
        #"Váci egyházmegye":,
        "Debrecen-Nyíregyházi egyházmegye": DNYEM(year=year),
        "Veszprémi főegyházmegye": VFEM(year=year),
        "Kaposvári egyházmegye": KEM(year=year),
        "Szombathelyi egyházmegye": SZHEM(year=year),
        #"Hajdúdorogi főegyházmegye": ,
        #"Miskolci egyházmegye": ,
        #"Nyíregyházi egyházmegye": ,
        #"Pannonhalmi területi főapátság": 
    }

    dioceses = {}

    for diocese, data in _dioceses.items():
        birthSum = sum(priest["birth"] for priest in data)
        dioceses[diocese] = year - birthSum/len(data)
    
    if filename == None:
        return dioceses
    else:
        with open(filename, "w") as outfile:
            outfile.write(json.dumps(dioceses))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                        description='Papok átlagéletkora')
    parser.add_argument('--filename', required=False, action="store", default=None, help="JSON to save. If not set, the result will be displayed on screen")
    parser.add_argument('--year', required=False, action="store", default=2023, help="Actual year")

    args = parser.parse_args()

    if args.filename==None: print(averageY(int(args.year)))
    else: averageY(int(args.year), args.filename)

