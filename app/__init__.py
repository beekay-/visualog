#!/usr/bin/python
from flask import Flask
import sys

# FLASK APP
app = Flask(__name__)
app.config["DEBUG"] = True

# CSRF PROTECT
from keys import secret_key
app.secret_key = secret_key
from flask_wtf.csrf import CsrfProtect
csrf = CsrfProtect(app)

from app import views
