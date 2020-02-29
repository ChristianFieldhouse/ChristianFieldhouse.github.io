import urllib.request, time
import git

interval = 10 * 60 * 1000

repo = git.Repo()

while True:
    ip = urllib.request.urlopen("https://api.ipify.org/").read().decode("utf-8")
    with open("ip_address.js", "r") as f:
        current_line = f.read()
        
    new_line = "var ip = \"" + ip + "\""
    if new_line != current_line:
        with open("ip_address.js", "w") as f:
            f.write(new_line)
        repo.index.add("ip_address.js")
        repo.index.commit("automated ip address update")
        repo.remotes.origin.push()
        print("updated to new ip : ", ip)
    else:
        print("same old ip : ", ip)

    time.sleep(interval)