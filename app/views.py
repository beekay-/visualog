from app import app
from flask import render_template, send_from_directory, jsonify, request, redirect, url_for
from pymongo import MongoClient
from app import csrf
import json
from bson.objectid import ObjectId
from moves_utilities import *
from keys import instagram_client_id, instagram_access_token

client = MongoClient()
visualog = client['visualog']

@app.route("/")
def index():
    return redirect(url_for('map'))

@app.route("/map")
def map():
    return render_template("map.html")

@csrf.exempt
@app.route('/getData', methods=['POST','GET'])
def getData():
    boundingBox = [json.loads(request.data)]
    placesJSONData = []
    movementJSONData = []
    placesCollection = visualog["places"]
    movementCollection = visualog["movement"]
    for place in placesCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"properties.place.name":1, "properties.category":1, "geometry":1}):
    	placesJSONData.append({"type":"Feature","geometry":place["geometry"], "properties": {"name":place["properties"]["place"]["name"], "category":place["properties"]["category"]}})
    for movement in movementCollection.find({"geometry":{"$geoWithin": {"$geometry": {"type" : "Polygon" ,"coordinates": boundingBox}}}},{"properties.activity":1, "geometry":1}):
        movementJSONData.append({"type":"Feature","geometry":movement["geometry"], "properties": {"activity":movement["properties"]["activity"]}})
    return jsonify(placesMovement = {"type":"FeatureCollection", "features":movementJSONData + placesJSONData})

@app.route("/photos")
def photos():
    return render_template("photos.html", client_id=instagram_client_id, access_token=instagram_access_token)

@app.route('/stats', methods=['GET'])
def stats():
    placesCollection = visualog["places"]
    movementCollection = visualog["movement"]
    aggregateCategories = [ { "$group": { "_id": { "category": "$properties.category" }, "total": { "$sum":1 } }}, { "$group": { "_id": "$_id.category", "total": { "$sum": "$total" } }}, { "$sort": { "total":-1 }}, { "$limit": 19 } ]
    aggregateDuration = [ { "$group": { "_id": "$properties.activity", "total": { "$sum": "$properties.duration" }, "avg": { "$avg": "$properties.duration" } } }, { "$sort": { "total":-1 } }, { "$limit": 8 } ]
    # aggregateDistance = [ { "$group": { "_id": "$properties.activity", "total": { "$sum": "$properties.distance" }, "avg": { "$avg": "$properties.distance" } } }, { "$sort": { "total":-1 } }, { "$limit": 8 } ]
    allCategories = placesCollection.aggregate(aggregateCategories)
    allDuration = movementCollection.aggregate(aggregateDuration)
    # allDistance = movementCollection.aggregate(aggregateDistance)
    totalPlaces = len(placesCollection.distinct('properties.place'))
    return render_template("stats.html", allCategories=allCategories, allDuration=allDuration, totalPlaces=totalPlaces)

@app.route('/getTotalVisits', methods=['GET'])
def getTotalVisits():
    placesCollection = visualog["places"]
    place = request.args.get('p')
    # aggregatePlaces = [ { "$group": { "_id": { "category": "$properties.category" }, "total": { "$sum":1 } }}, { "$group": { "_id": "$_id.category", "total": { "$sum": "$total" } }}, { "$sort": { "total":-1 }} ]
    # cursor = placesCollection.aggregate(aggregatePlaces)
    # allPlaces = list(cursor)
    placeCount = placesCollection.find({"properties.place.name": place }).count()
    return jsonify(total=placeCount)
