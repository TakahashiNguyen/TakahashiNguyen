username = 'takahashinguyen'

import requests
stats = requests.get(f'https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&locale=vi&hide_border=True&theme=swift&hide_title=True&card_width=500')
toplang = requests.get(f'https://github-readme-stats.vercel.app/api/top-langs?username={username}&layout=compact&langs_count=6&show_icons=true&locale=vi&hide_border=True&theme=swift&card_width=300')
print(
        f"""<svg viewBox="0 0 800 175" xmlns="http://www.w3.org/2000/svg" width="800" height="175">\n{stats.text + toplang.text.replace('viewBox="0 0 300 165"', 'viewBox="0 0 300 165" x="500"')}\n</svg>"""
    )