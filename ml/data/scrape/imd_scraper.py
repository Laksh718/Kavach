import requests
from bs4 import BeautifulSoup
import os
import time

# --- CONFIGURATION ---
BASE_RAW_DIR = "data/raw"
GRIDDED_DIR = os.path.join(BASE_RAW_DIR, "gridded_rainfall")
CITY_MET_DIR = os.path.join(BASE_RAW_DIR, "city_met_data")

YEARS = range(2018, 2025)

# --- UTILS ---
def ensure_dir(d):
    if not os.path.exists(d):
        os.makedirs(d)

def download_file(url, target_path, method="GET", data=None):
    """ Downloads file with streaming to handle large gridded data. """
    print(f"📡 Downloading {url} (Method: {method}, Target: {target_path})")
    try:
        if method == "POST":
            response = requests.post(url, data=data, stream=True, timeout=30)
        else:
            response = requests.get(url, stream=True, timeout=30)
        
        response.raise_for_status()
        
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"✅ Success: {target_path}")
    except Exception as e:
        print(f"❌ Failed: {e}")

# --- IMD PUNE GRIDDED DATA (POST) ---
def scrape_imd_pune():
    ensure_dir(GRIDDED_DIR)
    
    # Binary (.grd) - Source: https://www.imdpune.gov.in/cmpg/Griddata/Rainfall_25_Bin.html
    BIN_URL = "https://www.imdpune.gov.in/cmpg/Griddata/rainfall.php"
    
    # NetCDF (.nc) - Source: https://www.imdpune.gov.in/cmpg/Griddata/RF25_NetCDF.html
    NC_URL = "https://www.imdpune.gov.in/cmpg/Griddata/RF25.php"
    
    for year in YEARS:
        # 1. Download Binary
        bin_target = os.path.join(GRIDDED_DIR, f"rainfall_{year}.grd")
        download_file(BIN_URL, bin_target, method="POST", data={"rain": str(year)})
        
        # 2. Download NetCDF
        nc_target = os.path.join(GRIDDED_DIR, f"rainfall_{year}.nc")
        download_file(NC_URL, nc_target, method="POST", data={"RF25": str(year)})
        
        time.sleep(1) # Be polite

# --- OPENCITY.IN (GET) ---
def scrape_opencity():
    ensure_dir(CITY_MET_DIR)
    OPENCITY_BASE_URL = "https://data.opencity.in/dataset?organization=india-meteorological-department"
    
    try:
        print(f"🔍 Crawling {OPENCITY_BASE_URL}")
        res = requests.get(OPENCITY_BASE_URL, timeout=15)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Find all dataset links
        # Looking for <a href="/dataset/[name]">
        links = soup.find_all('a', href=True)
        dataset_paths = list(set([l['href'] for l in links if l['href'].startswith('/dataset/')]))
        
        print(f"📦 Found {len(dataset_paths)} candidate datasets.")
        
        for d_path in dataset_paths:
            full_url = f"https://data.opencity.in{d_path}"
            print(f"📄 Checking dataset: {full_url}")
            
            # Get resource links in each dataset
            d_res = requests.get(full_url, timeout=15)
            d_soup = BeautifulSoup(d_res.text, 'html.parser')
            
            # Find download buttons
            # Usually <a class="resource-url-analytics" href="..."> or links ending in .csv
            res_links = d_soup.find_all('a', href=True)
            
            for rl in res_links:
                href = rl['href']
                if href.endswith('.csv'):
                    dataset_name = d_path.split('/')[-1]
                    filename = href.split('/')[-1]
                    
                    # Optional: Filter by years if present in filename
                    # Note: We'll download all and filter later in processed pipeline if needed, 
                    # but user specifically asked for 'all cities for 18-24'.
                    # Often opencity files are "1901-2020.csv", etc.
                    
                    target_file = os.path.join(CITY_MET_DIR, f"{dataset_name}_{filename}")
                    
                    # Avoid duplicated downloads
                    if not os.path.exists(target_file):
                        download_file(href, target_file)
                        time.sleep(0.5)

    except Exception as e:
        print(f"❌ OpenCity error: {e}")

# --- MAIN ---
if __name__ == "__main__":
    print("🌧️ Starting IMD Grid & City Meteorology Scraping Pipeline")
    scrape_imd_pune()
    scrape_opencity()
    print("🎉 All Scrapers Finished.")
