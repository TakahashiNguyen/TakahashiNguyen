import glob
import contextlib
import re
import os
import shutil
import sys
import time

from PIL import Image, GifImagePlugin
from math import ceil
from selenium import webdriver
from multiprocessing import Pool

SCREENSHOTS_PER_SECOND = 8  # This arbitrary number worked but is not perfect
total_time_animated = 80

if len(sys.argv) == 2:
    FILE_NAME = sys.argv[1]
    ABSOLUTE_FILE_PATH = os.getcwd()
elif len(sys.argv) == 1:
    ABSOLUTE_FILE_PATH = os.getcwd()
    FILE_NAME = "examples/test.svg"
else:
    raise Exception("Usage: python svg2gif.py <SVG_file>")


def captureBanner(fname, darkMode=False, width=900, height=200):
    folder = f"_screenshots-{fname}"
    if os.path.exists(folder):
        shutil.rmtree(folder)
    os.makedirs(folder)

    opts = webdriver.EdgeOptions()
    opts.add_argument("--headless")
    driver = webdriver.Edge(options=opts)
    driver.set_window_size(width, height)
    driver.get(f"file:///{ABSOLUTE_FILE_PATH}/{FILE_NAME}")
    driver.execute_script("bannerTime()")
    if darkMode:
        driver.execute_script("toggleDarkMode()")

    total_screenshots = int(SCREENSHOTS_PER_SECOND * total_time_animated)
    time.sleep(4)
    start = time.time()
    for i in range(total_screenshots):
        time.sleep(0.05)
        driver.get_screenshot_as_file(f"{folder}/{i}.png")
    tta = ceil(time.time() - start)

    driver.close()
    driver.quit()
    exportGIF(
        f"{folder}/*.png",
        f"./dist/{fname}.gif",
        tta,
    )
    shutil.rmtree(folder)


def exportGIF(fp_in, fp_out, tt):
    GifImagePlugin.LOADING_STRATEGY = GifImagePlugin.LoadingStrategy.RGB_ALWAYS
    with contextlib.ExitStack() as stack:
        files = glob.glob(fp_in)
        files.sort(key=lambda f: int(re.sub("\D", "", f)))

        imgs = (stack.enter_context(Image.open(f)) for f in files)
        img = next(imgs)

        img.save(
            fp=fp_out,
            format="GIF",
            append_images=imgs,
            save_all=True,
            duration=(tt * 1000) / (len(files)),
            loop=0,
        )


if __name__ == "__main__":
    svg_file = open(FILE_NAME, "r+")
    pool = Pool(processes=4)
    pool.starmap(
        captureBanner,
        [
            ("greeting",),
            (
                "greeting-dark",
                True,
            ),
        ],
    )
