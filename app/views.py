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

client = MongoClient()
visualog = client['visualog']

@app.route("/")
def index():
    return redirect(url_for('gmap'))

@app.route("/map")
def gmap():
    return render_template("gmap.html")

@csrf.exempt
@app.route('/getData', methods=['POST','GET'])
def getData():
	# dataType = request.args.get("type", None)
	boundingBox = [json.loads(request.data)]
	JSONData = []
	# if dataType == 'places':
	dataCollection = visualog["places"]
	for data in dataCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"properties.place.name":1, "properties.category":1, "geometry":1}):
		JSONData.append({"type":"Feature","geometry":data["geometry"], "properties": {"name":data["properties"]["place"]["name"], "category":data["properties"]["category"]}})
	return jsonify(data = {"type":"FeatureCollection", "features":JSONData})
