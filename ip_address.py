import urllib.request, time

while True:
    ip = urllib.request.urlopen("https://api.ipify.org/").read().decode("utf-8")
    with open("ip_address.js", "w") as f:
        f.write("var ip = \"" + ip + "\"")
    time.sleep(20000)