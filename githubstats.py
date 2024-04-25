username = "TakahashiNguyen"
spotify_user_id = "31qy6z7gz35jc5yccywp6eyumuxy"

import requests, os

stats = requests.get(
    f"https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&locale=vi&hide_border=True&theme=swift&hide_title=True&card_width=450"
).text.replace('viewBox="0 0 450 165"', 'viewBox="0 0 450 165" x="50"')
toplang = requests.get(
    f"https://github-readme-stats.vercel.app/api/top-langs?username={username}&layout=compact&langs_count=6&show_icons=true&locale=vi&hide_border=True&theme=swift&card_width=338"
).text.replace('viewBox="0 0 338 165"', 'viewBox="0 0 338 165" x="537"')
contributestreak = requests.get(
    f"https://streak-stats.demolab.com?user={username}&theme=swift&hide_border=true&locale=vi&card_width=900"
).text.replace("viewBox='0 0 900 195'", 'viewBox="0 0 900 195" y="165"')
snake = requests.get(
    f"https://raw.githubusercontent.com/{username}/{username}/output/github-contribution-grid-snake.svg"
).text.replace('width="880"', 'width="800" x="50" y="360"')
snakeBlack = requests.get(
    f"https://raw.githubusercontent.com/{username}/{username}/output/github-contribution-grid-snake-dark.svg"
).text.replace('width="880"', 'width="800" x="50" y="360"')
output = f"""<svg viewBox="0 0 900 552" xmlns="http://www.w3.org/2000/svg">\n
        <rect width="100%" height="100%" fill="#f7f7f7"/>\n{stats+toplang+contributestreak+snake}\n</svg>"""
outputBlack = f"""<svg viewBox="0 0 900 552" xmlns="http://www.w3.org/2000/svg">\n
        <rect width="100%" height="100%" fill="#f7f7f7"/>\n{stats+toplang+contributestreak+snakeBlack}\n</svg>"""
musicurl = f"https://data-card-for-spotify.herokuapp.com/api/card?user_id={spotify_user_id}&hide_title=true"

with open("./dist/stats.svg", "w") as f:
    f.write(output)
with open("./dist/stats-dark.svg", "w") as f:
    f.write(
        outputBlack.replace("000000", "BLACK")
        .replace("f7f7f7", "000000")
        .replace("F7F7F7", "00000")
        .replace("BLACK", "f7f7f7")
    )

with open("./dist/musicstats.svg", "w") as f:
    f.write(
        requests.get(musicurl)
        .text.replace(
            'class="card-container"', 'class="card-container" style="color:black;"'
        )
        .replace("121212", "f7f7f7")
        .replace("121212", "373737")
        .replace(".attribution {", ".attribution {display: none !important;")
    )

os.system("python3 ./svg2gif.py index.html")
