var socket = io();
socket.on('sendSetupData', rcvSetupData);

var setupData;
var currentViewpoint = 0;
var transitionTimeout;

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
  terrainShadows : true,
  navigationInstructionsInitiallyVisible : false
});

function rcvSetupData(data) {
	setupData = data;
	console.log("Received Setup Data:\n" + JSON.stringify(data));
		
  viewer.entities.add({
    name : "Home Area - Danger",
    position : Cesium.Cartesian3.fromDegrees(data.homeCoordinates.longitude,
                                             data.homeCoordinates.latitude,
                                             data.homeCoordinates.altitude + 250),
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
    position : Cesium.Cartesian3.fromDegrees(data.homeCoordinates.longitude,
                                             data.homeCoordinates.latitude,
                                             data.homeCoordinates.altitude + 1250),
    cylinder : {
      length : 2500.0,
      topRadius : 2500.0,
      bottomRadius : 2500.0,
      material : Cesium.Color.GREEN.withAlpha(0.1),
      outline : true,
      outlineColor : Cesium.Color.BLACK
    }
  });
  
  if(data.viewpoints.length > 0) {
  	console.log("Transitioning camera to: " + JSON.stringify(data.viewpoints[0]));
    viewer.camera.setView({
      destination : Cesium.Cartesian3.fromDegrees(data.viewpoints[0].longitude,
                                                  data.viewpoints[0].latitude,
                                                  data.viewpoints[0].altitude),
      orientation : {
        heading : data.viewpoints[0].heading,
        pitch : data.viewpoints[0].pitch,
        roll : data.viewpoints[0].roll
      }
    });
  }
  
  if(data.viewpoints.length > 1) {
  	transitionTimeout = setTimeout(transitionWaypoints, setupData.viewpointHoldTime * 1000);
  	// to clear this later for some reason: `clearTimeout(transitionTimeout);`
  }
}

function transitionWaypoints() {
	currentViewpoint++;
	if(currentViewpoint == setupData.viewpoints.length) {
		currentViewpoint = 0;
	}
	vp = setupData.viewpoints[currentViewpoint];
	console.log("Transitioning camera to: " + JSON.stringify(vp));
	
	viewer.camera.flyTo({
		destination : Cesium.Cartesian3.fromDegrees(vp.longitude,
                                                vp.latitude,
                                                vp.altitude),
    orientation : {
        heading : vp.heading,
        pitch : vp.pitch,
        roll : vp.roll
    },
    duration : setupData.viewpointTransitionTime,
    cancel : stopTransitions,
    complete : function() {
      transitionTimeout = setTimeout(transitionWaypoints, setupData.viewpointHoldTime * 1000);
    }
	});
}

function stopTransitions() {
	console.log("Stopping camera transitions.");
  clearTimeout(transitionTimeout);
}

function toggleTransitions() {
	console.log("toggled");
}