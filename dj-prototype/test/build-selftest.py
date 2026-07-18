#!/usr/bin/env python3
"""Build the Salt automated test page from the current app source.

  python3 build-selftest.py            # writes selftest.html next to this file
  <headless-chromium> --no-sandbox --disable-gpu --autoplay-policy=no-user-gesture-required \\
    --window-size=1280,800 --virtual-time-budget=90000 --dump-dom selftest.html \\
    | grep -o 'id="TESTLOG">[^<]*'

Every check reports OK/FAIL; "uncaught:NONE" and "no-source-leak:OK" must
always be present. Run at 1280x800 and 390x844 before every release.
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
app = open(os.path.join(here, "..", "index.html")).read()
test = open(os.path.join(here, "testscript.html")).read()
page = ('<!doctype html><html><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'
        + app + test)
open(os.path.join(here, "selftest.html"), "w").write(page)
print("built selftest.html —", len(page), "bytes")
