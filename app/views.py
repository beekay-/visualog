from app import app
from flask import render_template, render_template_string, send_from_directory, make_response, jsonify, request, redirect, url_for, flash
from pymongo import MongoClient, ASCENDING, DESCENDING, errors, GEOSPHERE
import math
from app import csrf
import json
from bson.objectid import ObjectId
import time
import random
import os

from moves_utilities import *

@app.route("/")
def index():
    return render_template("gmap.html")
