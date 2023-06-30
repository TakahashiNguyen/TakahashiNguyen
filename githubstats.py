username = 'takahashinguyen'

import requests
stats = requests.get(f'https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&locale=vi&hide_border=True&theme=swift&hide_title=True&card_width=500').text
toplang = requests.get(f'https://github-readme-stats.vercel.app/api/top-langs?username={username}&layout=compact&langs_count=6&show_icons=true&locale=vi&hide_border=True&theme=swift&card_width=300').text.replace('viewBox="0 0 300 165"', 'viewBox="0 0 300 165" x="500"')
contributestreak = requests.get(f'https://github-readme-streak-stats.herokuapp.com?user={username}&theme=swift&hide_border=true&locale=vi&date_format=j%20M%5B%20Y%5D&card_width=800').text.replace("viewBox=\'0 0 800 195\'",'viewBox="0 0 800 195" y="165"')
snake = requests.get(f'https://raw.githubusercontent.com/{username}/{username}/output/github-contribution-grid-snake.svg').text.replace('width="880"', 'width="800" y="360"')
print(
        f"""<svg viewBox="0 0 800 552" xmlns="http://www.w3.org/2000/svg" width="800" height="552">\n<rect width="100%" height="100%" fill="rgba(247,247,247,255)"/>\n{stats + toplang+contributestreak+snake}\n</svg>"""
    )