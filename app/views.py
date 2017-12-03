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
@app.route('/getPlaces', methods=['POST','GET'])
def getPlaces():
	# dataType = request.args.get("type", None)
	boundingBox = [json.loads(request.data)]
	JSONData = []
	# if dataType == 'places':
	placesCollection = visualog["places"]
	for place in placesCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"properties.place.name":1, "properties.category":1, "geometry":1}):
		JSONData.append({"type":"Feature","geometry":place["geometry"], "properties": {"name":place["properties"]["place"]["name"], "category":place["properties"]["category"]}})
	return jsonify(places = {"type":"FeatureCollection", "features":JSONData})

@csrf.exempt
@app.route('/getMovement', methods=['POST','GET'])
def getMovement():
	# dataType = request.args.get("type", None)
	boundingBox = [json.loads(request.data)]
	JSONData = []
	# if dataType == 'places':
	movementCollection = visualog["movement"]
	# for movement in movementCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"properties.distance":1, "properties.activity":1, "properties.duration":1, "geometry":1}):
	for movement in movementCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"geometry":1}):
		JSONData.append({"type":"Feature","geometry":movement["geometry"]})
	return jsonify(movement = {"type":"FeatureCollection", "features":JSONData})

@app.route('/stats', methods=['GET'])
def mostVisited():
    # userIP = request.remote_addr
    placesCollection = visualog["places"]
    aggregatePlaces = [
    	{ "$group": {
    		"_id": {
    			"category": "$properties.category"
    		},
    		"count": { "$sum":1 }
    	}},
    	{ "$group": {
    		"_id": "$_id.category",
    		"count": { "$sum": "$count" }
    	}},
    	{ "$sort": { "count":-1 }},
    	{ "$limit": 15 }
    ]
    # cursor = placesCollection.aggregate(aggregatePlaces)
    # allPlaces = list(cursor)
    allPlaces = placesCollection.aggregate(aggregatePlaces)
    return render_template("most-visited.html", allPlaces=allPlaces)
