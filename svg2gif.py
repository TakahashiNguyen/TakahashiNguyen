"""
Most SVG to Gif online generators are using magick's command
this was not sufficent for my use case due to the outputs not formatting correctly 
and scalability
"""

import glob
import contextlib
import re
import os
import shutil
import sys
import time

from PIL import Image, GifImagePlugin
from bs4 import BeautifulSoup
from math import ceil
from selenium import webdriver

capture = True


########################################################
# Constants
########################################################
if len(sys.argv) == 2:
    FILE_NAME = sys.argv[1]
    ABSOLUTE_FILE_PATH = os.getcwd()
elif len(sys.argv) == 1:
    ABSOLUTE_FILE_PATH = os.getcwd()
    FILE_NAME = "examples/test.svg"
else:
    raise Exception("Usage: python svg2gif.py <SVG_file>")
SCREENSHOTS_PER_SECOND = 6  # This arbitrary number worked but is not perfect

########################################################
# Helper functions
########################################################


def _clean_time_element(time):
    """
    takes time paramter in an svg and converts it to seconds

    Args:
            time (str): time format from SVG i.e. 10s = 10 seconds
    Returns:
            (float): cleaned time
    """
    if type(time) != str:
        raise Exception("did not pass str")
    elif "s" in time:
        return float(time.replace("s", ""))
    elif "m" in time:
        return float(time.replace("m", "")) * 60
    else:
        raise Exception("Time was not in seconds or minutes")


########################################################
# Beautiful soup parse to find total duration of SVG
########################################################

svg_file = open(FILE_NAME, "r+")
soup = BeautifulSoup(svg_file, features="html.parser")


animation_timers = [
    _clean_time_element(time_element.get("dur"))
    for time_element in soup.findAll("animate")
]

total_time_animated = ceil(max(animation_timers + [110]))


if capture:
    ########################################################
    # Use Selenium to play the SVG file to play the file
    # and capture screenshots of the SVG

    ## currently Magick doesn't support this conversion:
    ## https://github.com/ImageMagick/ImageMagick/discussions/2391
    ########################################################
    if os.path.exists("_screenshots"):
        shutil.rmtree("_screenshots")
    if os.path.exists("_screenshotsDark"):
        shutil.rmtree("_screenshotsDark")
    os.makedirs("_screenshots")
    os.makedirs("_screenshotsDark")

    opts = webdriver.EdgeOptions()
    opts.add_argument("--headless")
    driver = webdriver.Edge(options=opts)
    driver.set_window_size(900, 200)

    # In Selenium you need the prefix file:/// to open a local file
    driver.get(f"file:///{ABSOLUTE_FILE_PATH}/{FILE_NAME}")
    driver.execute_script("bannerTime()")
    total_screenshots = int(SCREENSHOTS_PER_SECOND * total_time_animated)
    time.sleep(8)

    start = time.time()
    for i in range(total_screenshots + 60):
        driver.get_screenshot_as_file(f"_screenshots/{i}.png")
    total_time_animated = ceil(time.time() - start)
    print(total_time_animated)

    driver.close()
    driver.quit()

    # Dark mode time
    opts = webdriver.EdgeOptions()
    opts.add_argument("--headless")
    opts.add_argument("--enable-features=WebUIDarkMode")
    opts.add_argument("--force-dark-mode")
    driver = webdriver.Edge(options=opts)
    driver.set_window_size(900, 200)

    # In Selenium you need the prefix file:/// to open a local file
    driver.get(f"file:///{ABSOLUTE_FILE_PATH}/{FILE_NAME}")
    driver.execute_script("bannerTime()")
    total_screenshots = int(SCREENSHOTS_PER_SECOND * total_time_animated)
    time.sleep(8)

    start = time.time()
    for i in range(total_screenshots + 60):
        driver.get_screenshot_as_file(f"_screenshotsDark/{i}.png")
    total_time_animated = ceil(time.time() - start)
    print(total_time_animated)

    driver.close()
    driver.quit()


########################################################
# use PIL to combine the save PNG's to a GIF
########################################################


GifImagePlugin.LOADING_STRATEGY = GifImagePlugin.LoadingStrategy.RGB_ALWAYS


# use exit stack to automatically close opened images
def exportGIF(fp_in, fp_out):
    with contextlib.ExitStack() as stack:

        files = glob.glob(fp_in)
        files.sort(key=lambda f: int(re.sub("\D", "", f)))

        # lazily load images
        imgs = (stack.enter_context(Image.open(f)) for f in files)

        img = next(imgs)

        # https://pillow.readthedocs.io/en/stable/handbook/image-file-formats.html
        img.save(
            fp=fp_out,
            format="GIF",
            append_images=imgs,
            save_all=True,
            duration=(total_time_animated * 1000) / (len(files)),
            loop=0,
        )


exportGIF("_screenshots/*.png", "./dist/greeting.gif")
exportGIF("_screenshotsDark/*.png", "./dist/greeting-dark.gif")
########################################################
# Remove temporary directories
########################################################
shutil.rmtree("_screenshots")
shutil.rmtree("_screenshotsDark")
