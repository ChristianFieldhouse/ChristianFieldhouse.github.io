import urllib.request, time
import git

repo = git.Repo()

def wait(minutes=1, seconds=0, notify_seconds=1):
    for i in range((seconds + minutes*60)//notify_seconds):
        print("                                       ", end="\r")
        print(f"fetching in {(seconds + minutes*60)-i*notify_seconds}", end="\r")
        time.sleep(notify_seconds)

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

    wait(minutes=10)