import mwparserfromhell
import requests

API_URL = "https://thwiki.cc/api.php"
headers = {"User-Agent": "My-Bot-Name/1.0"}


def query(title):
    params = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "rvlimit": 1,
        "titles": title,
        "format": "json",
        "formatversion": "2",
    }
    req = requests.get(API_URL, headers=headers, params=params)
    res = req.json()
    revision = res["query"]["pages"][0]["revisions"][0]
    text = revision["slots"]["main"]["content"]
    return mwparserfromhell.parse(text)


def get_table(title, section):
    params = {
        'action': "parse",
        'page': title,
        'prop': 'wikitext',
        'section': section,
        'format': "json"
    }
    res = requests.get(API_URL, params=params)
    data = res.json()
    wikitext = data['parse']['wikitext']['*']
    lines = wikitext.split('|-')
    print(lines)
    entries = []
    for line in lines:
        line = line.strip()
        if line.startswith("|"):
            table = line[2:].split('||')
            entry = table[0].split("|")[0].strip(
                "'''[[]]\n"), table[0].split("|")[1].strip("\n")
            entries.append(entry)

    return entries


if __name__ == '__main__':
    # print(query('蓬莱人形'))
    print(get_table('蓬莱人形', 4))
