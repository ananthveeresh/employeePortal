import gspread
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import pandas as pd
import time
from datetime import datetime,timedelta
import pytz


# Google API Configuration
SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
SERVICE_ACCOUNT_FILE = "google_summary.json"

# Google Drive Folder IDs
SOURCE_FOLDER_ID = "1Xva1VR6x8wDgWHrkxSFYzjI0dO3Ie7RW" 
SUMMARY_FOLDER_ID = "1Awi3Om-XSd9lqf-vVRFeh0cWBM8y43nh"  

ist = pytz.timezone('Asia/Kolkata')
_sheets_cache = None

def get_gspread_client():
    """Initialize and return a Google Sheets API client."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return gspread.authorize(creds)

def get_drive_service():
    """Initialize and return a Google Drive API client."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build("drive", "v3", credentials=creds)

def get_sheets_list_from_folder():
    """Retrieve and cache Google Sheets from a specific folder in Google Drive."""
    global _sheets_cache
    if _sheets_cache is not None:
        return _sheets_cache  

    try:
        drive_service = get_drive_service()
        query = f"'{SOURCE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet'"
        results = drive_service.files().list(q=query).execute()
        _sheets_cache = {file["name"]: file["id"] for file in results.get("files", [])}
        return _sheets_cache
    except Exception as e:
        print(f"❌ Error fetching sheets list: {e}")
        return {}

def exponential_backoff(func, *args, max_retries=5):
    """Handles API rate limits using exponential backoff."""
    for attempt in range(max_retries):
        try:
            return func(*args) 
        except gspread.exceptions.APIError as e:
            if "Quota exceeded" in str(e):
                print(f"Quota exceeded, retrying in {120} seconds...")
                time.sleep(120)
            else:
                raise  
    print("Max retries reached. Skipping request.")
    return None

def get_sheet_data(filename: str):
    """Fetch all records from a Google Sheet with retry handling."""
    sheets = get_sheets_list_from_folder()
    if filename not in sheets:
        return None, None

    client = get_gspread_client()
    sheet_id = sheets[filename]

    try:
        sheet = exponential_backoff(client.open_by_key, sheet_id).sheet1
        data = exponential_backoff(sheet.get_values)
        if not data or len(data) < 2:
            return [], sheet
        headers = data[0]
        records = [dict(zip(headers, row + [""] * (len(headers) - len(row)))) for row in data[1:] if row]
        return records, sheet
    except Exception as e:
        print(f"Error accessing sheet '{filename}': {e}")
        time.sleep(120)

        return None, None

def update_all_files():
    """Update summary for all Google Sheets and move summary file to another folder."""
    sheets = get_sheets_list_from_folder()
    files_summary = []

    for filename in sheets:
        records, _ = get_sheet_data(filename)
        print(f"{filename} Processing...")

        if filename != 'SummaryReport':
            update_file_summary(records, filename)

        if records is None:
            continue  

        df = pd.DataFrame(records)
        df["filename"] = filename
        files_summary.append(df)

    if not files_summary:
        return {"message": "No data available"}
    Yesderday = (datetime.now(ist) - timedelta(days=1)).strftime("%Y-%m-%d") +"_Updates"
    df = pd.concat(files_summary, ignore_index=True)
    if "LatestUpdate" in df.columns:
        df["LatestUpdate"] = pd.to_datetime(
                df["LatestUpdate"].astype(str).str.strip(),
                format="%Y-%m-%d %I:%M%p",  # Adjust format if needed
                errors="coerce"
            )            
        df["Today_Updates"] = df["LatestUpdate"].dt.date == (datetime.now(ist) - timedelta(days=1)).date()
    else:
        df["Today_Updates"] = False  # Default if column is missing

    df["Assigned"] = df["Paycode"].notna() & df["Paycode"].ne("")
    df["Pending"] = df["LatestStatus"].isna() | df["LatestStatus"].eq("")
    df["Interested"] = df["LatestStatus"] == "Interested"
    df["Not Interested"] = df["LatestStatus"] == "Not Interested"
    df["Joined"] = df["LatestStatus"] == "Joined"
    df["Others"] = ~(df["Interested"] | df["Not Interested"] | df["Joined"] | df["Pending"])
    df["Today_Updates"] = df["LatestUpdate"].dt.date == (datetime.now(ist) - timedelta(days=1)).date()

    summary_df = df.groupby("filename").agg(
        Total_Students=("filename", "count"),
        Assigned=("Assigned", "sum"),
        Pending=("Pending", "sum"),
        Joined=("Joined", "sum"),
        Interested=("Interested", "sum"),
        Not_Interested=("Not Interested", "sum"),
        Others=("Others", "sum"),
        Yesderday=("Today_Updates","sum"),
    ).reset_index()

    summary_df["CallingPercentage"] = ((summary_df["Total_Students"] - summary_df["Pending"]) / summary_df["Total_Students"] * 100).round(2)
    summary_df["PendingPercentage"] = 100 - summary_df["CallingPercentage"]
    print(summary_df.head())

    sheet_data = [summary_df.columns.tolist()] + summary_df.values.tolist()

    client = get_gspread_client()
    sheet_title = "SummaryReport"
    sheet_name = f"Summary"

    try:
        spreadsheet = client.open(sheet_title)
    except gspread.exceptions.SpreadsheetNotFound:
        spreadsheet = client.create(sheet_title)
        spreadsheet.share("analysis@aditya.ac.in", perm_type="user", role="writer")

    try:
        worksheet = spreadsheet.worksheet(sheet_name)
        worksheet.clear()
    except gspread.exceptions.WorksheetNotFound:
        worksheet = spreadsheet.add_worksheet(title=sheet_name, rows="100", cols="10")

    exponential_backoff(worksheet.update, sheet_data)
    print(f"Summary updated in sheet '{sheet_name}'")

    move_file_to_folder(spreadsheet.id, SUMMARY_FOLDER_ID)

def move_file_to_folder(file_id, folder_id):
    """Move a file to a specific folder in Google Drive."""
    try:
        drive_service = get_drive_service()
        file = drive_service.files().get(fileId=file_id, fields="parents").execute()
        prev_parents = ",".join(file.get("parents"))
        drive_service.files().update(
            fileId=file_id,
            addParents=folder_id,
            removeParents=prev_parents,
            fields="id, parents"
        ).execute()
        print(f" Moved file {file_id} to folder {folder_id}")
    except Exception as e:
        print(f" Error moving file {file_id} to folder {folder_id}: {e}")

def update_file_summary(records, filename):
    """Update the summary per file and place it in the summary sheet."""
    Yesderday = (datetime.now(ist) - timedelta(days=1)).strftime("%Y-%m-%d") +"_Updates"

    df = pd.DataFrame(records)
    if "LatestUpdate" in df.columns:
        df["LatestUpdate"] = pd.to_datetime(
                df["LatestUpdate"].astype(str).str.strip(),
                format="%Y-%m-%d %I:%M%p",  # Adjust format if needed
                errors="coerce"
            )            
        df["Today_Updates"] = df["LatestUpdate"].dt.date == (datetime.now(ist) - timedelta(days=1)).date()
    else:
        df["Today_Updates"] = False  # Default if column is missing
    
    try:
        df["Assigned"] = df["Paycode"].notna() & df["Paycode"].ne("")
        df["Pending"] = df["LatestStatus"].isna() | df["LatestStatus"].eq("")
        df["Interested"] = df["LatestStatus"] == "Interested"
        df["Not Interested"] = df["LatestStatus"] == "Not Interested"
        df["Joined"] = df["LatestStatus"] == "Joined"
        df["Others"] = ~(df["Interested"] | df["Not Interested"] | df["Joined"] | df["Pending"])
        summary_df = df.groupby("FacultyName").agg(
            Total_Assigned=("Assigned", "sum"),
            Joined=("Joined", "sum"),
            Pending=("Pending", "sum"),
            Interested=("Interested", "sum"),
            Not_Interested=("Not Interested", "sum"),
            Others=("Others", "sum"),
            Yesderday=("Today_Updates","sum"),
        ).reset_index()
        summary_df.insert(0, "Last_Update", datetime.now(ist).strftime("%Y-%m-%d"))

        sheet_data = [summary_df.columns.tolist()] + summary_df.values.tolist()

    except Exception as e:
        print("Column does not exist in the DataFrame.", e)

    try:
        client = get_gspread_client()
        sheet_title = filename+"Summary"  
        
        try:
            spreadsheet = client.open(sheet_title)
            # spreadsheet.share("analysis@aditya.ac.in", perm_type="user", role="writer")

        except gspread.exceptions.SpreadsheetNotFound:
            spreadsheet = client.create(sheet_title)
            spreadsheet.share("analysis@aditya.ac.in", perm_type="user", role="writer")

        
        try:
            worksheet = spreadsheet.worksheet("Sheet1")
            worksheet.clear()
        except gspread.exceptions.WorksheetNotFound:
            worksheet = spreadsheet.add_worksheet(title="Sheet1", rows="100", cols="10")

        exponential_backoff(worksheet.update, sheet_data)

        move_file_to_folder(spreadsheet.id, SUMMARY_FOLDER_ID)

        print(f"{sheet_title} Summary updated")
        print(f"Sheet URL: https://docs.google.com/spreadsheets/d/{spreadsheet.id}")

    except Exception as e:
        print(f"Error: {e}")



#update_all_files()

def get_seconds_until_target(target_hour=6, target_minute=0):
    # Get current time in IST
    now = datetime.now(ist)
    print(now)
    
    # Create target time for today
    target = now.replace(hour=target_hour, minute=target_minute, second=0, microsecond=0)
    
    # If target time has already passed today, set it for tomorrow
    if now >= target:
        target = target + timedelta(days=1)
    
    # Return seconds until target
    return (target - now).total_seconds()

while True:
    # Calculate seconds until next 12:00
    seconds_to_wait = get_seconds_until_target(6, 0)
    
    # Sleep until the target time (or close to it)
    if seconds_to_wait > 60:
        # Sleep most of the time, but wake up 30 seconds before to be precise
        time.sleep(seconds_to_wait - 30)
    else:
        # When we're close, check more frequently
        time.sleep(1)
    
    # Check if it's time to run the function
    now = datetime.now(ist)
    if now.hour == 6 and now.minute == 0:
        update_all_files()
        # Sleep until the minute is over to prevent multiple executions
        time.sleep(60)
       
