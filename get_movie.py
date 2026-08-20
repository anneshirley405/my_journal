#download movies given a magnet addres #bt torrent

import libtorrent as lt
import time
import sys
import os


def download_torrent(magnet_link,custom_name):
    # --- SETUP TARGET DIRECTORY & RENAME FILE ---
    output_dir = "downloaded_movies"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output folder: {output_dir}")

    # Prompt user for a custom file name
#    custom_name = input("Enter a custom name for this movie (e.g., Mothers_Pride.mkv): ").strip()
    if not custom_name:
        custom_name = "downloaded_movie.mkv" # Fallback if left blank
        
    # 1. Create a session with automatic port management settings
    settings = {
        'listen_interfaces': '0.0.0.0:6881,[::]:6881',
        'enable_upnp': True,    # Tries to open a port on your router automatically
        'enable_natpmp': True,  # Tries Apple/open-source router port mapping
    }
    ses = lt.session(settings)
    
    # 2. Feed public "bootstrap" nodes to connect to the DHT network
    ses.add_dht_router("router.bittorrent.com", 6881)
    ses.add_dht_router("router.utorrent.com", 6881)
    ses.add_dht_router("dht.transmissionbt.com", 6881)
    
    print("Parsing magnet...")
    params = lt.parse_magnet_uri(magnet_link)
    params.save_path = output_dir  # Directs download into your folder
    
    # Apply custom name override to the torrent structure
    params.name = custom_name
    
    # 3. Add reliable fallback trackers
    trackers = [
        "udp://tracker.opentrackr.org:1337/announce",
        "udp://open.stealth.si:80/announce",
        "udp://tracker.coppersurfer.tk:6969/announce"
    ]
    params.trackers.extend(trackers)
    
    handle = ses.add_torrent(params)
    
    print("Connecting to DHT network and fetching metadata...")
    
    # Monitor the network build-up
    while not handle.status().has_metadata:
        status = handle.status()
        # Safe way to extract nodes across python-libtorrent versions
        try:
            nodes = ses.status().dht_nodes
        except AttributeError:
            nodes = ses.get_cache_info().get('dht_nodes', 0)
            
        sys.stdout.write(f"\rNodes in DHT cache: {nodes} | Connected Peers: {status.num_peers}   ")
        sys.stdout.flush()
        time.sleep(1)
        
    print("\nSuccess! Metadata downloaded.")
    
    # Use libtorrent rename feature to point the target file to your custom name
    try:
        torrent_info = handle.get_torrent_info()
        if torrent_info.num_files() > 0:
            handle.rename_file(0, custom_name)
    except Exception:
        pass

    print(f"Starting file download as: {custom_name}\n")

    # 4. --- LIVE VISUAL PROGRESS BAR LOOP ---
    while not handle.status().is_seeding:
        status = handle.status()
        
        percent_done = status.progress * 100
        mb_per_second = status.download_rate / (1024 * 1024) # Converts bytes to Megabytes
        
        # Generate a clean visual loading bar [██████░░░░]
        bar_length = 20
        filled_chunks = int(round(status.progress * bar_length))
        loading_bar = "█" * filled_chunks + "░" * (bar_length - filled_chunks)
        
        # Continuously update the single console line with progress details
        sys.stdout.write(f"\rProgress: [{loading_bar}] {percent_done:.2f}% | Speed: {mb_per_second:.2f} MB/s | Peers: {status.num_peers}    ")
        sys.stdout.flush()
        
        time.sleep(1)

    print(f"\n\nDownload completely finished! Check the '{output_dir}' folder for your file.")



if __name__ == "__main__":
    #check for magnet name
    info = lt.torrent_info('killer_720.torrent')
    movie_name = lt.make_magnet_uri(info)
#    movie_name = "magnet:?xt=urn:btih:6C7C19A191A85F074929F407F00E131287FED7CF"

#print(lt.make_magnet_uri(info))
#    movie_name = "magnet:?xt=urn:btih:80ac94a18e95f09035a982689ad384a58d5ca33d&dn=%e3%80%90%e9%ab%98%e6%b8%85%e5%bd%b1%e8%a7%86%e4%b9%8b%e5%ae%b6%e5%8f%91%e5%b8%83%20www.BBEBBB.com%e3%80%91%e5%ae%b6%e9%85%bf%e8%8d%a3%e8%80%80%5bHDR%2b%e6%9d%9c%e6%af%94%e8%a7%86%e7%95%8c%e5%8f%8c%e7%89%88%e6%9c%ac%5d%5b%e7%ae%80%e7%b9%81%e8%8b%b1%e5%ad%97%e5%b9%95%5d.Mothers.Pride.2026.Bluray.2160p.DTS-HDMA5.1.DoVi.HDR.x265.10bit-DreamHD&tr=http%3a%2f%2ftracker1.itzmx.com%3a8080%2fannounce&ws=http%3a%2f%2f213.193.252.42%3a11121%2f&ws=http%3a%2f%2f213.193.252.42%3a11122%2f&ws=http%3a%2f%2f213.193.252.42%3a11123%2f&ws=http%3a%2f%2f213.193.252.42%3a11125%2f&ws=http%3a%2f%2f213.193.252.42%3a11126%2f&ws=http%3a%2f%2f213.193.252.42%3a11127%2f&ws=http%3a%2f%2f213.193.252.42%3a11128%2f&ws=http%3a%2f%2f213.193.252.42%3a11129%2f"
    target = movie_name.strip()
    custom_name = "i_am_a_killer.mp4"
    download_torrent(target,custom_name)
