from fastapi import FastAPI, HTTPException
import gspread
import time
from datetime import datetime
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from cachetools import TTLCache
import random
import os
import requests
from gspread.utils import rowcol_to_a1
import urllib3
import requests.packages

urllib3.disable_warnings()
requests.packages.urllib3.disable_warnings()

app = FastAPI()

SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
FOLDER_ID = "1Xva1VR6x8wDgWHrkxSFYzjI0dO3Ie7RW"  # Replace with your actual folder ID

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caching to reduce API calls
data_cache = TTLCache(maxsize=100, ttl=10)  # Cache paycode data for 10 sec
sheets_cache = TTLCache(maxsize=1, ttl=10)  # Cache sheet list for 10 sec

# Service account directory
SERVICE_ACCOUNTS_DIR = "service_accounts"

def get_random_service_account():
    """Randomly selects a service account JSON file for load balancing API calls."""
    service_accounts = [f for f in os.listdir(SERVICE_ACCOUNTS_DIR) if f.endswith(".json")]

    if not service_accounts:
        raise Exception("No service accounts found")
    print (os.path.join(SERVICE_ACCOUNTS_DIR, random.choice(service_accounts)))    
    return os.path.join(SERVICE_ACCOUNTS_DIR, random.choice(service_accounts))

def get_gspread_client():
    """Returns a Google Sheets client with randomly selected credentials."""
    creds = Credentials.from_service_account_file(get_random_service_account(), scopes=SCOPES)
    return gspread.authorize(creds)

def get_sheets_list():
    """Fetches the list of available Google Sheets in the folder."""
    try:
        if "sheets_list" in sheets_cache:
            return sheets_cache["sheets_list"]
        
        drive_service = build("drive", "v3", credentials=Credentials.from_service_account_file(get_random_service_account(), scopes=SCOPES))
        query = f"'{FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet'"
        result = drive_service.files().list(q=query).execute()
        
        sheets = {file["name"]: file["id"] for file in result.get("files", [])}
        sheets_cache["sheets_list"] = sheets
        return sheets
    except Exception as e:
        print(f"Error fetching sheets list: {e}")
        return {}

def exponential_backoff(api_call, retries=5):
    """Retries the API call with exponential backoff if rate limits are hit."""
    wait_time = 1  # Initial wait time
    for attempt in range(retries):
        try:
            return api_call()
        except HttpError as e:
            if e.resp.status == 429:  # Rate limit exceeded
                print(f"Rate limit exceeded. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                wait_time *= 2  # Double the wait time
            else:
                raise  # Raise other errors immediately
    raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")

@app.get("/getalloteddata/{filename}/{paycode}")
async def get_paycode_data(filename: str, paycode: str, status: str = None):
    """Fetches data for a specific paycode, optionally filtering by status."""
    cache_key = f"{filename}_{paycode}_{status}"
    if cache_key in data_cache:
        return data_cache[cache_key]

    try:
        client = get_gspread_client()
        sheets = get_sheets_list()

        if filename not in sheets:
            raise HTTPException(status_code=404, detail=f"File '{filename}' not found")

        sheet = client.open_by_key(sheets[filename]).sheet1
        headers = sheet.row_values(1)
        raw_data = sheet.get_all_values()

        records = []
        for row_index, row in enumerate(raw_data[1:], start=2):  # Skip header row (row 1)
            record = {headers[col_index]: row[col_index] if col_index < len(row) else "" for col_index in range(len(headers))}
            if record.get("Paycode", "").strip() == paycode:
                record["name_box"] = f"A{row_index}"  # Example: "A5"
                records.append(record)

        if status:
            status_lower = status.strip().lower()
            if status_lower == "new":
                records = [row for row in records if not row.get("LatestStatus", "").strip()]
            else:
                records = [row for row in records if row.get("LatestStatus", "").strip().lower() == status_lower]

        data_cache[cache_key] = records
        return records if records else {"message": f"No matching records for Paycode {paycode}"}

    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/update-status")
async def update_status(payload: dict):
    """Updates the status and details in the Google Sheet."""
    required_fields = ["filename", "name_box", "FacultyName", "LatestStatus", "LatestUpdate", "Remarks"]

    for field in required_fields:
        if field not in payload:
           
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
            

    try:
        client = get_gspread_client()
        sheet = client.open(payload["filename"]).sheet1  
       
        #headers = sheet.row_values(1)
       
     
      
        row_number = int(payload["name_box"][1:])  
        
        column_indexes={'Mobile': 1, 'Name': 2, 'City': 3, 'Address': 4, 'Reference': 5, 'Paycode': 6, 'FacultyName': 7, 'LatestStatus': 8, 'LatestUpdate': 9, 'Remarks': 10, 'DetailsTrack': 11, 'interestedcourse': 12}
        """
        column_indexes = {
             "Mobile": headers.index("Mobile") + 1,
            "Name": headers.index("Name") + 1,
            "City": headers.index("City") + 1,
            "Address": headers.index("Address") + 1,
            "Reference": headers.index("Reference") + 1,
            "Paycode": headers.index("Paycode") + 1,
            "FacultyName": headers.index("FacultyName") + 1,
            "LatestStatus": headers.index("LatestStatus") + 1,
            "LatestUpdate": headers.index("LatestUpdate") + 1,
            "Remarks": headers.index("Remarks") + 1,
            "DetailsTrack": headers.index("DetailsTrack") + 1,
            "interestedcourse": headers.index("interestedcourse") + 1,
        }
        """
        #print(column_indexes)

        existing_details_track = sheet.cell(row_number, column_indexes["DetailsTrack"]).value or ""
        new_entry = f"{payload['LatestStatus']} | {payload['LatestUpdate']} | {payload.get('Remarks', '')} | {payload.get('paycode', '')} | {payload['FacultyName']};"
        updated_details_track = f"{existing_details_track}\n{new_entry}".strip()

        update_values = [
            (row_number, column_indexes["Mobile"], payload["Mobile"]),
            (row_number, column_indexes["Name"], payload["Name"]),
            (row_number, column_indexes["City"], payload["City"]),
            (row_number, column_indexes["Address"], payload["Address"]),
            (row_number, column_indexes["Reference"], payload["Reference"]),
             (row_number, column_indexes["Paycode"], payload["Paycode"]),
            (row_number, column_indexes["FacultyName"], payload["FacultyName"]),
            (row_number, column_indexes["LatestStatus"], payload["LatestStatus"]),
            (row_number, column_indexes["LatestUpdate"], payload["LatestUpdate"]),
            (row_number, column_indexes["Remarks"], payload["Remarks"]),
            (row_number, column_indexes["DetailsTrack"], updated_details_track),
             (row_number, column_indexes["interestedcourse"], payload["interestedcourse"]),
        ]

        update_range = f"{rowcol_to_a1(row_number, 1)}:{rowcol_to_a1(row_number, len(update_values))}"
        update_data = [[value for _, _, value in update_values]]

        def update_sheet():
            sheet.update(update_range, update_data)

        exponential_backoff(update_sheet)

        return {"message": "Row updated successfully", "updated_cells": update_range}

    except Exception as e:
        print(f"Error occurred: {e}")
        requests.post("https://apis.aditya.ac.in/kafka/producer/leadstatusupdate", json = { "data": payload },verify=False)
        raise HTTPException(status_code=500, detail="Internal server error")
