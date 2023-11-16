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
import numpy

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
        dioceses[diocese] = {
            "PRIEST_YAVG": year - birthSum/len(data),
            "PRIEST_YSTD": numpy.std([(year - priest["birth"]) for priest in data]),
            "PRIEST_YMED": numpy.median([(year - priest["birth"]) for priest in data]),
            "PRIEST_YLT30": sum([(1 if (year - priest["birth"]) < 30 else 0) for priest in data]),
            "PRIEST_Y30-39": sum([(1 if 30 <= (year - priest["birth"]) < 40 else 0) for priest in data]),
            "PRIEST_Y40-49": sum([(1 if 40 <= (year - priest["birth"]) < 50 else 0) for priest in data]),
            "PRIEST_Y50-59": sum([(1 if 50 <= (year - priest["birth"]) < 60 else 0) for priest in data]),
            "PRIEST_Y60-69": sum([(1 if 60 <= (year - priest["birth"]) < 70 else 0) for priest in data]),
            "PRIEST_Y70-79": sum([(1 if 70 <= (year - priest["birth"]) < 80 else 0) for priest in data]),
            "PRIEST_YGTE80": sum([(1 if 80 <= (year - priest["birth"]) else 0) for priest in data]),
            "PRIEST_KNOWNY": len(data)
        }

    
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

