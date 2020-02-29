import urllib.request, time
import git

repo = git.Repo()

while True:
    ip = urllib.request.urlopen("https://api.ipify.org/").read().decode("utf-8")
    with open("ip_address.js", "w") as f:
        f.write("var ip = \"" + ip + "\"")
    repo.index.add("ip_address.js")
    repo.index.commit("automated ip address update")
    repo.remotes.origin.push()
    time.sleep(20000)