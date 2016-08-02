var socket = io();
socket.on('sendHomeCoordinates', rcvHomeCoordinates);

Cesium.BingMapsApi.defaultKey = '';
var viewer = new Cesium.Viewer('map', {
  baseLayerPicker : false,
  imageryProvider : new Cesium.createOpenStreetMapImageryProvider({
    url : 'https://a.tile.openstreetmap.org/'
  }),
  terrainProvider : new Cesium.CesiumTerrainProvider({
    url : 'https://assets.agi.com/stk-terrain/world'
  }),
  skyAtmosphere : false,
  shadows : true,
  terrainShadows : true
});

viewer.camera.setView({
  destination : Cesium.Cartesian3.fromDegrees(-86.932939, 33.212747, 5000),
  orientation : {
    heading : 0.268019659921368,
    pitch : -0.34878977794813504,
    roll : 0.0 }
});
	
function rcvHomeCoordinates(data) {
	console.log("Received home coordinates: " + JSON.stringify(data));
		
  viewer.entities.add({
    name : "Home Area - Danger",
    position : Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, data.altitude + 250),
    cylinder : {
      length : 500.0,
      topRadius : 500.0,
      bottomRadius : 500.0,
      material : Cesium.Color.RED.withAlpha(0.3),
      outline : true,
      outlineColor : Cesium.Color.BLACK
    }
  });
      
  viewer.entities.add({
    name : "Home Area - Safe",
    position : Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, data.altitude + 1250),
    cylinder : {
      length : 2500.0,
      topRadius : 2500.0,
      bottomRadius : 2500.0,
      material : Cesium.Color.GREEN.withAlpha(0.1),
      outline : true,
      outlineColor : Cesium.Color.BLACK
    }
  });
}
